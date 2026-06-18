import { useState } from "react";
import Icon from "@/components/ui/icon";
import CallbackModal from "@/components/CallbackModal";
import { useSubmitRateLimit } from "@/hooks/useSubmitRateLimit";

const SEND_APPLICATION_URL = "https://functions.poehali.dev/8e2e01ab-452f-4967-ae24-2dbd637b802f";

type IconName = string;

const HERO_IMAGE = "https://cdn.poehali.dev/projects/8b21b88d-9626-449b-a265-a3555a90f6f9/files/193dad46-35ff-41b1-ac35-e939c97b347c.jpg";
const APPLIANCES_IMAGE = "https://cdn.poehali.dev/projects/8b21b88d-9626-449b-a265-a3555a90f6f9/files/b9da38d5-a9dd-4980-afb2-5c048c7b06a5.jpg";

const NAV_LINKS = [
  { label: "Главная", href: "#home" },
  { label: "Услуги", href: "#services" },
  { label: "Прайс", href: "#price" },
  { label: "О сервисе", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

const SERVICES = [
  { icon: "Waves", title: "Стиральные машины", desc: "Ремонт любых неисправностей: не греет, не отжимает, течёт, не включается. Все модели Bosch." },
  { icon: "Thermometer", title: "Холодильники", desc: "Замена компрессора, устранение утечки фреона, ремонт No Frost, замена термостата." },
  { icon: "UtensilsCrossed", title: "Посудомоечные машины", desc: "Чистка фильтров, ремонт насоса, замена нагревательных элементов, устранение протечек." },
  { icon: "Flame", title: "Духовые шкафы", desc: "Ремонт конвекции, замена тэна, ремонт электроники, устранение неточностей температуры." },
  { icon: "Wind", title: "Вытяжки", desc: "Замена мотора, ремонт подсветки, замена фильтров, устранение посторонних шумов." },
  { icon: "Zap", title: "Варочные панели", desc: "Ремонт индукционных и электрических панелей, замена модулей управления и конфорок." },
];

const PRICES = [
  { service: "Диагностика на дому", price: "Бесплатно", note: "при условии ремонта" },
  { service: "Стиральная машина", price: "от 1 500 ₽", note: "зависит от поломки" },
  { service: "Холодильник", price: "от 2 000 ₽", note: "зависит от поломки" },
  { service: "Посудомоечная машина", price: "от 1 800 ₽", note: "зависит от поломки" },
  { service: "Духовой шкаф", price: "от 1 200 ₽", note: "зависит от поломки" },
  { service: "Варочная панель", price: "от 1 400 ₽", note: "зависит от поломки" },
  { service: "Вытяжка", price: "от 800 ₽", note: "зависит от поломки" },
  { service: "Винный шкаф", price: "от 2 000 ₽", note: "зависит от поломки" },
];

const GUARANTEES = [
  { icon: "ShieldCheck", title: "Гарантия 12 месяцев", desc: "На все виды выполненных работ предоставляется гарантия 12 месяцев." },
  { icon: "Package", title: "Оригинальные запчасти", desc: "Используем только сертифицированные запчасти Bosch и их аналоги проверенных производителей." },
  { icon: "FileText", title: "Официальный акт", desc: "Выдаём акт выполненных работ и гарантийный талон на каждый ремонт." },
  { icon: "RotateCcw", title: "Повторный выезд бесплатно", desc: "Если проблема возникла снова в гарантийный период — мастер приедет без дополнительной оплаты." },
];

const ABOUT_STATS = [
  { value: "12+", label: "лет на рынке" },
  { value: "15 000+", label: "выполненных ремонтов" },
  { value: "98%", label: "клиентов довольны" },
  { value: "24ч", label: "время реакции" },
];

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
          <p className="text-white/30 text-xs text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
        </div>
      )}
    </div>
  );
}

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [callbackOpen, setCallbackOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-light)", color: "var(--brand-text)", fontFamily: "'Golos Text', sans-serif" }}>

      {/* TOP BAR */}
      <div style={{ backgroundColor: "var(--brand-dark)" }} className="py-2 px-4 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-white/60">Ремонт бытовой техники Bosch — Москва и область</span>
          <div className="flex gap-6 items-center text-white/80">
            <span className="flex items-center gap-1.5">
              <Icon name="Clock" size={14} />
              Пн–Вс: 8:00 – 22:00
            </span>
            <a href="tel:+79307879192" className="flex items-center gap-1.5 text-white font-semibold hover:text-red-400 transition-colors">
              <Icon name="Phone" size={14} />
              +7 930 787 91 92
            </a>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header style={{ backgroundColor: "var(--brand-navy)" }} className="sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: "var(--brand-red)" }}>
              <Icon name="Wrench" size={20} className="text-white" />
            </div>
            <div>
              <div className="font-heading text-xl font-bold text-white tracking-wider">BOSCH SERVICE</div>
              <div className="text-xs text-white/50 -mt-0.5">Центральный сервисный центр</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="nav-link text-white/80 hover:text-white text-sm font-medium transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <a href="tel:+79307879192"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm text-white transition-colors"
            style={{ backgroundColor: "var(--brand-red)" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--brand-red-hover)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--brand-red)")}
          >
            <Icon name="Phone" size={16} />
            Вызвать мастера
          </a>

          {/* Mobile menu button */}
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ backgroundColor: "var(--brand-dark)" }} className="lg:hidden border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
              {NAV_LINKS.map(link => (
                <a key={link.href} href={link.href}
                  className="text-white/80 hover:text-white py-2 border-b border-white/10 text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a href="tel:+79307879192" className="mt-2 flex items-center justify-center gap-2 py-3 rounded font-semibold text-white"
                style={{ backgroundColor: "var(--brand-red)" }}>
                <Icon name="Phone" size={16} />
                +7 930 787 91 92
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Ремонт техники Bosch" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(13,27,46,0.93) 45%, rgba(13,27,46,0.55) 100%)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-widest uppercase" style={{ borderColor: "var(--brand-red)", color: "var(--brand-gold)" }}>
              <Icon name="Award" size={12} />
              Центральный сервисный центр Bosch
            </div>

            <h1 className="font-heading text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 uppercase tracking-wide">
              Ремонт<br />
              <span style={{ color: "var(--brand-red)" }}>Bosch</span><br />
              на дому
            </h1>

            <p className="text-white/75 text-lg mb-10 leading-relaxed max-w-xl">
              Профессиональный ремонт стиральных машин, холодильников, посудомоечных машин и другой техники Bosch. Мастер приедет в день обращения.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="tel:+79307879192"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded text-white font-bold text-lg transition-colors"
                style={{ backgroundColor: "var(--brand-red)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--brand-red-hover)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--brand-red)")}
              >
                <Icon name="Phone" size={20} />
                Вызвать мастера
              </a>
              <button
                onClick={() => setCallbackOpen(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded font-bold text-lg border-2 transition-colors"
                style={{ borderColor: "var(--brand-red)", color: "var(--brand-red)", backgroundColor: "transparent" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(220,38,38,0.15)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              >
                <Icon name="PhoneCall" size={20} />
                Обратный звонок
              </button>
              <a href="#price"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded font-bold text-lg border-2 text-white border-white/30 hover:border-white/70 transition-colors"
              >
                <Icon name="List" size={20} />
                Посмотреть цены
              </a>
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                { icon: "ShieldCheck", text: "Гарантия 12 месяцев" },
                { icon: "Clock", text: "Выезд за 2 часа" },
                { icon: "BadgeCheck", text: "Оригинальные запчасти" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2 text-white/80 text-sm">
                  <Icon name={item.icon as IconName} size={18} style={{ color: "var(--brand-gold)" }} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div style={{ backgroundColor: "var(--brand-red)" }} className="py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {ABOUT_STATS.map(stat => (
            <div key={stat.label} className="text-center text-white">
              <div className="font-heading text-4xl font-bold">{stat.value}</div>
              <div className="text-white/80 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--brand-red)" }}>Что мы ремонтируем</p>
            <h2 className="section-title text-4xl lg:text-5xl mb-4" style={{ color: "var(--brand-dark)" }}>Наши услуги</h2>
            <span className="divider-red mx-auto mb-6 block" />
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--brand-muted)" }}>
              Ремонтируем все виды бытовой техники Bosch любой сложности. Работаем с 2012 года.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(service => (
              <div key={service.title} className="card-hover bg-white rounded-xl p-8 border shadow-sm" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: "rgba(30,58,110,0.08)" }}>
                  <Icon name={service.icon as IconName} size={28} style={{ color: "var(--brand-blue)" }} />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3" style={{ color: "var(--brand-dark)" }}>{service.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--brand-muted)" }}>{service.desc}</p>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE */}
      <section id="price" className="py-20 px-4" style={{ backgroundColor: "var(--brand-dark)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--brand-gold)" }}>Прозрачные цены</p>
            <h2 className="section-title text-4xl lg:text-5xl mb-4 text-white">Прайс-лист</h2>
            <span className="divider-red mx-auto mb-6 block" />
            <p className="text-lg max-w-2xl mx-auto text-white/60">
              Точная стоимость определяется после бесплатной диагностики. Никаких скрытых платежей.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {PRICES.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-xl border" style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}>
                <div>
                  <div className="font-semibold text-white">{item.service}</div>
                  <div className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{item.note}</div>
                </div>
                <div className="font-heading text-xl font-bold text-right ml-4 shrink-0" style={{ color: "var(--brand-gold)" }}>
                  {item.price}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href="#contacts"
              className="inline-flex items-center gap-2 px-8 py-4 rounded font-bold text-white text-lg transition-colors"
              style={{ backgroundColor: "var(--brand-red)" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--brand-red-hover)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--brand-red)")}
            >
              <Icon name="Calculator" size={20} />
              Рассчитать стоимость ремонта
            </a>
          </div>
        </div>
      </section>

      {/* GUARANTEES */}
      <section className="py-20 px-4" style={{ backgroundColor: "#eef1f7" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--brand-red)" }}>Наши обязательства</p>
            <h2 className="section-title text-4xl lg:text-5xl mb-4" style={{ color: "var(--brand-dark)" }}>Гарантии качества</h2>
            <span className="divider-red mx-auto mb-6 block" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GUARANTEES.map(g => (
              <div key={g.title} className="bg-white rounded-xl p-8 text-center shadow-sm card-hover">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(192,40,30,0.08)" }}>
                  <Icon name={g.icon as IconName} size={32} style={{ color: "var(--brand-red)" }} />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-3" style={{ color: "var(--brand-dark)" }}>{g.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--brand-muted)" }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--brand-red)" }}>О нас</p>
              <h2 className="section-title text-4xl lg:text-5xl mb-4" style={{ color: "var(--brand-dark)" }}>О сервисном центре</h2>
              <span className="divider-red mb-8 block" />

              <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--brand-muted)" }}>
                БошСервис — специализированный сервисный центр по ремонту бытовой техники Bosch. Более 12 лет мы помогаем жителям Москвы и области вернуть технику к жизни.
              </p>
              <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--brand-muted)" }}>
                Наши мастера проходят официальное обучение и имеют доступ к оригинальным запчастям. Мы работаем честно: называем точную цену до начала ремонта и даём гарантию на все работы.
              </p>

              <div className="space-y-4">
                {[
                  "Сертифицированные мастера с опытом от 5 лет",
                  "Склад запчастей для 98% моделей Bosch",
                  "Ремонт у вас дома без транспортировки техники",
                  "Честный прайс без скрытых доплат",
                ].map(point => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "var(--brand-red)" }}>
                      <Icon name="Check" size={14} className="text-white" />
                    </div>
                    <span style={{ color: "var(--brand-text)" }} className="font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img src={APPLIANCES_IMAGE} alt="Техника Bosch" className="rounded-2xl shadow-2xl w-full object-cover" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(192,40,30,0.1)" }}>
                    <Icon name="ShieldCheck" size={28} style={{ color: "var(--brand-red)" }} />
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-bold" style={{ color: "var(--brand-dark)" }}>12 мес.</div>
                    <div className="text-sm" style={{ color: "var(--brand-muted)" }}>гарантия на работы</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              { icon: "Phone", title: "Телефон", lines: ["+7 930 787 91 92", "+7 930 787 91 92"] },
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

          {/* CALL FORM */}
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
            <a href="#" className="hover:text-white/70 transition-colors">Политика конфиденциальности</a>
            <span>Не является публичной офертой</span>
          </div>
        </div>
      </footer>

      <CallbackModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </div>
  );
}