import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useSubmitRateLimit } from "@/hooks/useSubmitRateLimit";

type IconName = string;

const SEND_APPLICATION_URL = "https://functions.poehali.dev/8e2e01ab-452f-4967-ae24-2dbd637b802f";

const FAQ = [
  {
    q: "Сколько времени занимает ремонт?",
    a: "Большинство ремонтов выполняется в течение 1–2 часов прямо у вас дома. Если нужна редкая запчасть — 2–3 рабочих дня."
  },
  {
    q: "Нужно ли везти технику в сервисный центр?",
    a: "Нет. Наш мастер приезжает к вам домой с полным набором инструментов и большинством расходных деталей."
  },
  {
    q: "Как рассчитывается стоимость ремонта?",
    a: "Стоимость складывается из работы мастера и стоимости запчастей (если они требуются). Диагностика бесплатна при условии ремонта."
  },
  {
    q: "На что распространяется гарантия?",
    a: "Гарантия 12 месяцев распространяется на выполненные работы и установленные запчасти. Если проблема повторится — мастер приедет бесплатно."
  },
  {
    q: "Работаете ли вы в выходные дни?",
    a: "Да, мы работаем 7 дней в неделю с 8:00 до 22:00, включая праздничные дни."
  },
  {
    q: "Обслуживаете ли старые модели Bosch?",
    a: "Да, ремонтируем технику Bosch начиная с 1995 года выпуска. Наши мастера имеют опыт работы со всей линейкой оборудования."
  },
];

function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [equipment, setEquipment] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const rateLimit = useSubmitRateLimit();

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Пожалуйста, укажите имя и телефон");
      return;
    }
    if (!rateLimit.check()) {
      setError("Заявка уже отправлена. Подождите 30 секунд перед следующей отправкой.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(SEND_APPLICATION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, equipment }),
      });
      if (res.ok) {
        rateLimit.register();
        setSent(true);
        setName("");
        setPhone("");
        setEquipment("");
      } else if (res.status === 429) {
        setError("Слишком много заявок. Попробуйте через несколько минут.");
      } else {
        setError("Ошибка отправки. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto rounded-2xl p-8 md:p-10" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <h3 className="font-heading text-2xl font-semibold text-white text-center mb-2">Оставить заявку</h3>
      <p className="text-white/50 text-center text-sm mb-8">Мастер перезвонит в течение 15 минут</p>

      {sent ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-white text-lg font-semibold mb-2">Заявка отправлена!</p>
          <p className="text-white/50 text-sm">Мастер свяжется с вами в ближайшее время.</p>
          <button className="mt-6 text-white/50 text-sm underline cursor-pointer" onClick={() => setSent(false)}>Отправить ещё одну</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2 font-medium">Ваше имя</label>
            <input
              type="text"
              placeholder="Иван Иванов"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none transition-all"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2 font-medium">Телефон</label>
            <input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none transition-all"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2 font-medium">Что сломалось?</label>
            <select
              value={equipment}
              onChange={e => setEquipment(e.target.value)}
              className="w-full rounded-lg px-4 py-3 outline-none transition-all"
              style={{ backgroundColor: "rgba(20,32,52,0.95)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
            >
              <option value="">Выберите технику</option>
              <option>Стиральная машина</option>
              <option>Холодильник</option>
              <option>Посудомоечная машина</option>
              <option>Духовой шкаф</option>
              <option>Варочная панель</option>
              <option>Вытяжка</option>
            </select>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-lg font-bold text-white text-lg mt-2 transition-colors cursor-pointer disabled:opacity-60"
            style={{ backgroundColor: "var(--brand-red)" }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "var(--brand-red-hover)"; }}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--brand-red)")}
          >
            {loading ? "Отправляем..." : "Отправить заявку"}
          </button>
          <p className="text-white/30 text-xs text-center">
            Нажимая на кнопку, вы соглашаетесь с{" "}
            <Link to="/privacy" className="underline hover:text-white/60 transition-colors">
              обработкой персональных данных
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

interface Props {
  openFaq: number | null;
  setOpenFaq: (i: number | null) => void;
}

export default function SiteFaqContacts({ openFaq, setOpenFaq }: Props) {
  return (
    <>
      {/* FAQ */}
      <section id="faq" className="py-20 px-4" style={{ backgroundColor: "#eef1f7" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--brand-red)" }}>Вопросы и ответы</p>
            <h2 className="section-title text-4xl lg:text-5xl mb-4" style={{ color: "var(--brand-dark)" }}>FAQ</h2>
            <span className="divider-red mx-auto mb-6 block" />
          </div>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button
                  className="w-full text-left px-7 py-5 flex items-center justify-between gap-4 font-semibold hover:bg-gray-50 transition-colors"
                  style={{ color: "var(--brand-dark)" }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={20} className="shrink-0" style={{ color: "var(--brand-muted)" }} />
                </button>
                {openFaq === i && (
                  <div className="px-7 pb-6 leading-relaxed" style={{ color: "var(--brand-muted)" }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" style={{ backgroundColor: "var(--brand-dark)" }} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--brand-gold)" }}>Связаться с нами</p>
            <h2 className="section-title text-4xl lg:text-5xl mb-4 text-white">Контакты</h2>
            <span className="divider-red mx-auto mb-6 block" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {[
              { icon: "Phone", title: "Телефон", lines: ["+7 (499) 638-27-51", "+7 (499) 638-27-51"] },
              { icon: "Clock", title: "Режим работы", lines: ["Пн–Вс: 8:00 – 22:00", "Без выходных и праздников"] },
              { icon: "MapPin", title: "Зона обслуживания", lines: ["Москва и Московская", "область (до 30 км от МКАД)"] },
            ].map(contact => (
              <div key={contact.title} className="text-center p-8 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "var(--brand-red)" }}>
                  <Icon name={contact.icon as IconName} size={24} className="text-white" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-3">{contact.title}</h3>
                {contact.lines.map(line => (
                  <p key={line} className="text-white/60">{line}</p>
                ))}
              </div>
            ))}
          </div>

          <ContactForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#060e1a", borderTop: "1px solid rgba(255,255,255,0.07)" }} className="py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: "var(--brand-red)" }}>
              <Icon name="Wrench" size={16} className="text-white" />
            </div>
            <span className="font-heading font-bold text-white tracking-wider">BOSCH SERVICE</span>
          </div>
          <p className="text-white/30 text-sm">© 2012 Bosch Service. Все права защищены.</p>
          <div className="flex gap-4 text-white/40 text-sm">
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Политика конфиденциальности</Link>
            <span>Не является публичной офертой</span>
          </div>
        </div>
      </footer>
    </>
  );
}