import json
import os
import smtplib
import urllib.request
import urllib.parse
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


def send_email(name: str, phone: str, equipment: str):
    smtp_user = os.environ['SMTP_USER']
    smtp_password = os.environ['SMTP_PASSWORD']
    to_email = smtp_user

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта: {phone}'
    msg['From'] = smtp_user
    msg['To'] = to_email

    equipment_str = equipment if equipment else 'не указано'
    name_str = name if name else 'не указано'

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #c0392b;">🔧 Новая заявка — BOSCH SERVICE</h2>
        <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666;">Имя:</td><td style="padding: 8px 0; font-weight: bold;">{name_str}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Телефон:</td><td style="padding: 8px 0; font-weight: bold;">{phone}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Что сломалось:</td><td style="padding: 8px 0; font-weight: bold;">{equipment_str}</td></tr>
        </table>
    </div>
    """

    msg.attach(MIMEText(html, 'html', 'utf-8'))

    with smtplib.SMTP('smtp.yandex.ru', 587, timeout=15) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, to_email, msg.as_string())


def send_telegram(name: str, phone: str, equipment: str):
    token = os.environ['TELEGRAM_BOT_TOKEN']
    chat_id = os.environ['TELEGRAM_CHAT_ID']
    equipment_str = equipment if equipment else 'не указано'
    name_str = name if name else 'не указано'
    text = (
        f"🔔 Новая заявка на сайте BOSCH SERVICE\n\n"
        f"👤 Имя: {name_str}\n"
        f"📞 Телефон: {phone}\n"
        f"⚙️ Что сломалось: {equipment_str}\n\n"
        f"📧 Полная заявка отправлена на почту"
    )
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'HTML'
    }).encode()
    req = urllib.request.Request(url, data=data, method='POST')
    with urllib.request.urlopen(req) as resp:
        resp.read()


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта: письмо на email + уведомление в Telegram"""

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

    if not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Телефон обязателен'})
        }

    send_email(name, phone, equipment)
    send_telegram(name, phone, equipment)

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }