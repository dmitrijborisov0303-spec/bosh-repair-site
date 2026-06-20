import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] px-4 py-4 md:py-5">
      <div
        className="max-w-4xl mx-auto rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl"
        style={{
          backgroundColor: "var(--brand-navy)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p className="text-white/70 text-sm flex-1 leading-relaxed">
          Мы используем файлы cookie для аналитики и улучшения сайта. Нажимая «Принять», вы соглашаетесь с{" "}
          <Link to="/privacy" className="underline text-white/90 hover:text-white transition-colors">
            политикой конфиденциальности
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.15)" }}
          >
            Отклонить
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-colors"
            style={{ backgroundColor: "var(--brand-red)" }}
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}