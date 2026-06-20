import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: "var(--brand-dark)", minHeight: "100vh" }}>
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: "var(--brand-navy)", borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Icon name="ArrowLeft" size={18} />
            <span className="text-sm">Назад</span>
          </button>
          <span className="text-white font-heading font-semibold text-lg">Политика конфиденциальности</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none">

          <div className="mb-10">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
              Политика конфиденциальности
            </h1>
            <div className="divider-red mb-4" />
            <p className="text-white/50 text-sm">Последнее обновление: июнь 2025 г.</p>
          </div>

          <Section title="1. Общие положения">
            <p>
              Настоящая политика конфиденциальности (далее — «Политика») определяет порядок обработки и защиты персональных
              данных пользователей сайта <strong className="text-white">БошСервис</strong> (далее — «Оператор»).
            </p>
            <p>
              Используя сайт, вы соглашаетесь с условиями настоящей Политики. Если вы не согласны с условиями,
              пожалуйста, прекратите использование сайта.
            </p>
          </Section>

          <Section title="2. Какие данные мы собираем">
            <p>Оператор может собирать следующие данные:</p>
            <ul>
              <li><strong className="text-white">Контактные данные</strong> — имя, номер телефона и адрес для выезда мастера, которые вы добровольно указываете в форме заявки.</li>
              <li><strong className="text-white">Технические данные</strong> — IP-адрес, тип браузера, страницы посещений (через Яндекс.Метрику).</li>
              <li><strong className="text-white">Файлы cookie</strong> — небольшие текстовые файлы, сохраняемые в вашем браузере для корректной работы сайта и аналитики.</li>
            </ul>
          </Section>

          <Section title="3. Цели обработки данных">
            <p>Персональные данные обрабатываются в следующих целях:</p>
            <ul>
              <li>Обработка заявок на ремонт и обратный звонок.</li>
              <li>Связь с вами по вопросам предоставления услуг.</li>
              <li>Анализ посещаемости и улучшение работы сайта.</li>
              <li>Защита от спама и несанкционированных запросов.</li>
            </ul>
          </Section>

          <Section title="4. Файлы cookie">
            <p>Мы используем следующие виды cookie:</p>
            <ul>
              <li><strong className="text-white">Необходимые</strong> — обеспечивают базовую работу сайта (запоминание вашего выбора по cookie).</li>
              <li><strong className="text-white">Аналитические</strong> — Яндекс.Метрика собирает обезличенные данные о посещениях для улучшения сайта.</li>
            </ul>
            <p>
              Вы можете отказаться от cookie, нажав «Отклонить» в баннере, или очистить cookie в настройках браузера.
              Отказ от аналитических cookie не влияет на работу сайта.
            </p>
          </Section>

          <Section title="5. Передача данных третьим лицам">
            <p>
              Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением:
            </p>
            <ul>
              <li><strong className="text-white">Яндекс.Метрика</strong> — аналитический сервис, собирающий обезличенную статистику.</li>
              <li>Случаев, предусмотренных действующим законодательством РФ.</li>
            </ul>
          </Section>

          <Section title="6. Хранение данных">
            <p>
              Данные из форм заявок передаются оператору напрямую и не хранятся на серверах сайта дольше необходимого
              для защиты от спама (не более 1 часа после отправки).
            </p>
          </Section>

          <Section title="7. Ваши права">
            <p>В соответствии с ФЗ-152 «О персональных данных» вы имеете право:</p>
            <ul>
              <li>Получить информацию об обработке ваших данных.</li>
              <li>Потребовать уточнения, блокировки или удаления персональных данных.</li>
              <li>Отозвать согласие на обработку персональных данных.</li>
            </ul>
            <p>Для реализации прав обратитесь к нам по контактным данным, указанным на сайте.</p>
          </Section>

          <Section title="8. Контакты">
            <p>
              По вопросам, связанным с обработкой персональных данных, вы можете связаться с нами через форму заявки
              на сайте или по телефону, указанному в разделе «Контакты».
            </p>
          </Section>

        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="space-y-3 text-white/65 leading-relaxed text-[15px]">
        {children}
      </div>
    </section>
  );
}