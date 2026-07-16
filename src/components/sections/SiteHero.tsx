import Icon from "@/components/ui/icon";
import { PHONE_TEL } from "@/lib/constants";

type IconName = string;

const HERO_IMAGE = "https://cdn.poehali.dev/projects/8b21b88d-9626-449b-a265-a3555a90f6f9/files/193dad46-35ff-41b1-ac35-e939c97b347c.jpg";
const APPLIANCES_IMAGE = "https://cdn.poehali.dev/projects/8b21b88d-9626-449b-a265-a3555a90f6f9/files/b9da38d5-a9dd-4980-afb2-5c048c7b06a5.jpg";

const SERVICES = [
  { icon: "Waves", title: "Стиральные машины", desc: "Ремонт любых неисправностей: не греет, не отжимает, течёт, не включается. Все модели Bosch." },
  { icon: "Thermometer", title: "Холодильники", desc: "Замена компрессора, устранение утечки фреона, ремонт No Frost, замена термостата." },
  { icon: "UtensilsCrossed", title: "Посудомоечные машины", desc: "Чистка фильтров, ремонт насоса, замена нагревательных элементов, устранение протечек." },
  { icon: "Flame", title: "Духовые шкафы", desc: "Ремонт конвекции, замена тэна, ремонт электроники, устранение неточностей температуры." },
  { icon: "Wind", title: "Вытяжки", desc: "Замена мотора, ремонт подсветки, замена фильтров, устранение посторонних шумов." },
  { icon: "Zap", title: "Варочные панели", desc: "Ремонт индукционных и электрических панелей, замена модулей управления и конфорок." },
];

const PRICES = [
  { service: "Диагностика на дому", price: "Бесплатно", note: "" },
  { service: "Стиральная машина", price: "от 1 500 ₽", note: "зависит от поломки" },
  { service: "Холодильник", price: "от 2 000 ₽", note: "зависит от поломки" },
  { service: "Посудомоечная машина", price: "от 1 800 ₽", note: "зависит от поломки" },
  { service: "Духовой шкаф", price: "от 1 200 ₽", note: "зависит от поломки" },
  { service: "Варочная панель", price: "от 1 400 ₽", note: "зависит от поломки" },
  { service: "Вытяжка", price: "от 800 ₽", note: "зависит от поломки" },
  { service: "Винный шкаф", price: "от 2 000 ₽", note: "зависит от поломки" },
];

const GUARANTEES = [
  { icon: "ShieldCheck", title: "Гарантия 24 месяца", desc: "На все виды выполненных работ предоставляется гарантия 24 месяца." },
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

interface Props {
  onCallbackOpen: () => void;
}

export default function SiteHero({ onCallbackOpen }: Props) {
  return (
    <>
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
              <a href={PHONE_TEL}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded text-white font-bold text-lg transition-colors"
                style={{ backgroundColor: "var(--brand-red)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--brand-red-hover)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--brand-red)")}
              >
                <Icon name="Phone" size={20} />
                Вызвать мастера
              </a>
              <button
                onClick={onCallbackOpen}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded font-bold text-lg border-2 transition-colors"
                style={{ borderColor: "var(--brand-red)", color: "var(--brand-red)", backgroundColor: "transparent" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(220,38,38,0.15)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              >
                <Icon name="PhoneCall" size={20} />
                Обратный звонок
              </button>
              <a href="#price"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded font-bold text-lg border-2 text-white border-white/30 hover:border-white/60 transition-colors"
              >
                <Icon name="List" size={20} />
                Посмотреть цены
              </a>
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                { icon: "ShieldCheck", text: "Гарантия 24 месяца" },
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
                  {item.note && <div className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{item.note}</div>}
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
                    <div className="font-heading text-2xl font-bold" style={{ color: "var(--brand-dark)" }}>24 мес.</div>
                    <div className="text-sm" style={{ color: "var(--brand-muted)" }}>гарантия на работы</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}