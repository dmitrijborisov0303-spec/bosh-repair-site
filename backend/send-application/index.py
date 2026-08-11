import json
import os
import smtplib
import urllib.request
import urllib.parse
from datetime import datetime, timezone, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

RATE_LIMIT_MAX = 5
RATE_LIMIT_WINDOW_MINUTES = 10


def get_ip(event: dict) -> str:
    headers = event.get('headers', {}) or {}
    for h in ('x-forwarded-for', 'X-Forwarded-For'):
        if h in headers:
            return headers[h].split(',')[0].strip()
    identity = event.get('requestContext', {}).get('identity', {})
    return identity.get('sourceIp', 'unknown')


def check_rate_limit(ip: str) -> bool:
    import psycopg2
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    window = f"{RATE_LIMIT_WINDOW_MINUTES} minutes"
    cur.execute(
        f"SELECT COUNT(*) FROM rate_limit_log WHERE ip = %s AND created_at > NOW() - INTERVAL '{window}'",
        (ip,)
    )
    count = cur.fetchone()[0]
    if count >= RATE_LIMIT_MAX:
        cur.close()
        conn.close()
        return False
    cur.execute("INSERT INTO rate_limit_log (ip) VALUES (%s)", (ip,))
    cur.execute("DELETE FROM rate_limit_log WHERE created_at < NOW() - INTERVAL '1 hour'")
    conn.commit()
    cur.close()
    conn.close()
    return True


UTM_KEYS = ('utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term')


def extract_utm(body: dict) -> dict:
    return {key: body.get(key, '').strip()[:200] for key in UTM_KEYS if body.get(key, '').strip()}


def send_email(name: str, phone: str, equipment: str, utm: dict):
    smtp_user = os.environ['SMTP_USER']
    smtp_password = os.environ['SMTP_PASSWORD']
    to_email = smtp_user

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта: {phone}'
    msg['From'] = smtp_user
    msg['To'] = to_email

    equipment_str = equipment if equipment else 'не указано'
    name_str = name if name else 'не указано'
    now = datetime.now(timezone(timedelta(hours=3))).strftime('%d.%m.%Y %H:%M (МСК)')

    utm_rows = ''.join(
        f'<tr><td style="padding: 8px 0; color: #666;">{key}:</td><td style="padding: 8px 0; font-weight: bold;">{value}</td></tr>'
        for key, value in utm.items()
    )

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #c0392b;">🔧 Новая заявка — BOSCH SERVICE</h2>
        <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666;">Дата и время:</td><td style="padding: 8px 0; font-weight: bold;">{now}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Имя:</td><td style="padding: 8px 0; font-weight: bold;">{name_str}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Телефон:</td><td style="padding: 8px 0; font-weight: bold;">{phone}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Что сломалось:</td><td style="padding: 8px 0; font-weight: bold;">{equipment_str}</td></tr>
            {utm_rows}
        </table>
    </div>
    """

    msg.attach(MIMEText(html, 'html', 'utf-8'))

    with smtplib.SMTP('smtp.yandex.ru', 587, timeout=15) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, to_email, msg.as_string())


def send_telegram(name: str, phone: str, equipment: str, utm: dict):
    token = os.environ['TELEGRAM_BOT_TOKEN']
    chat_ids = [c.strip() for c in os.environ['TELEGRAM_CHAT_ID'].split(',') if c.strip()]
    extra_chat_id = os.environ.get('TELEGRAM_CHAT_ID_2', '').strip()
    if extra_chat_id:
        chat_ids.append(extra_chat_id)
    now = datetime.now(timezone(timedelta(hours=3))).strftime('%d.%m.%Y %H:%M (МСК)')
    utm_text = ''
    if utm:
        utm_text = '\n' + '\n'.join(f'{key}: {value}' for key, value in utm.items())
    text = (
        f"🔔 Новая заявка с сайта BOSCH SERVICE\n"
        f"🕐 {now}\n\n"
        f"📧 Подробности — в письме на почте"
        f"{utm_text}"
    )
    url = f"https://api.telegram.org:443/bot{token}/sendMessage"
    for chat_id in chat_ids:
        payload = json.dumps({
            'chat_id': chat_id,
            'text': text,
            'parse_mode': 'HTML'
        }).encode('utf-8')
        req = urllib.request.Request(url, data=payload, method='POST', headers={'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=8) as resp:
                resp.read()
        except Exception as e:
            print(f"Telegram send failed for chat_id {chat_id}: {e}")


def send_bitrix24(name: str, phone: str, equipment: str, utm: dict, request_type: str):
    webhook_url = os.environ.get('BITRIX24_WEBHOOK_URL', '').strip()
    if not webhook_url:
        return

    digits_phone = ''.join(c for c in phone if c.isdigit())
    title = 'Заявка с сайта (Обратный звонок)' if request_type == 'callback' else 'Заявка с сайта (Форма обратной связи)'
    if equipment:
        title += f' — {equipment}'

    fields = {
        'TITLE': title,
        'NAME': name or 'Не указано',
        'PHONE': [
            {'VALUE': digits_phone, 'VALUE_TYPE': 'WORK'}
        ],
    }
    for key, value in utm.items():
        fields[key.upper()] = value

    payload = json.dumps({
        'fields': fields,
        'params': {'REGISTER_SONET': 'Y'}
    }).encode('utf-8')

    url = webhook_url.rstrip('/') + '/crm.lead.add.json'
    req = urllib.request.Request(url, data=payload, method='POST', headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8', errors='replace')
        masked_url = url[:40] + '...' if len(url) > 40 else url
        print(f"Bitrix24 HTTPError {e.code} for url starting '{masked_url}': {error_body}")
        raise


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта: письмо на email + уведомление в Telegram + лид в Битрикс24"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    ip = get_ip(event)
    if not check_rate_limit(ip):
        return {
            'statusCode': 429,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Слишком много заявок. Попробуйте позже.'})
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()[:100]
    phone = body.get('phone', '').strip()[:20]
    equipment = body.get('equipment', '').strip()[:100]
    request_type = body.get('type', '').strip()[:20]
    utm = extract_utm(body)

    if not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Телефон обязателен'})
        }

    send_email(name, phone, equipment, utm)
    try:
        send_telegram(name, phone, equipment, utm)
    except Exception as e:
        print(f"Telegram notification failed: {e}")
    try:
        send_bitrix24(name, phone, equipment, utm, request_type)
    except Exception as e:
        print(f"Bitrix24 notification failed: {e}")

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }