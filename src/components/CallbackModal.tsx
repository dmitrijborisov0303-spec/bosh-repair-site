import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useSubmitRateLimit } from "@/hooks/useSubmitRateLimit";

const SEND_APPLICATION_URL = "https://functions.poehali.dev/8e2e01ab-452f-4967-ae24-2dbd637b802f";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallbackModal({ isOpen, onClose }: Props) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const rateLimit = useSubmitRateLimit();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!phone.trim()) {
      setError("Введите номер телефона");
      return;
    }
    if (!agreed) {
      setError("Необходимо согласие на обработку персональных данных");
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
        body: JSON.stringify({ phone, name, type: "callback" }),
      });
      if (res.status === 429) {
        setError("Слишком много заявок. Попробуйте через несколько минут.");
      } else {
        rateLimit.register();
        setSent(true);
      }
    } catch {
      setError("Ошибка отправки. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPhone("");
    setName("");
    setError("");
    setSent(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: "var(--brand-navy)" }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <Icon name="X" size={20} />
        </button>

        {sent ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(220,38,38,0.15)" }}>
              <Icon name="CheckCircle" size={32} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Заявка принята!</h3>
            <p className="text-white/60">Наш мастер перезвонит вам в течение 15 минут</p>
            <button
              onClick={handleClose}
              className="mt-6 px-8 py-3 rounded-lg font-semibold text-white"
              style={{ backgroundColor: "var(--brand-red)" }}
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(220,38,38,0.15)" }}>
                <Icon name="PhoneCall" size={20} style={{ color: "var(--brand-red)" }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Обратный звонок</h3>
                <p className="text-white/50 text-sm">Перезвоним в течение 15 минут</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1.5 font-medium">Ваше имя</label>
                <input
                  type="text"
                  placeholder="Иван"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 outline-none text-white/90 placeholder:text-white/30 transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1.5 font-medium">Телефон *</label>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 outline-none text-white/90 placeholder:text-white/30 transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: agreed ? "var(--brand-red)" : "rgba(255,255,255,0.07)",
                      border: `1px solid ${agreed ? "var(--brand-red)" : "rgba(255,255,255,0.2)"}`,
                    }}
                  >
                    {agreed && <Icon name="Check" size={12} className="text-white" />}
                  </div>
                </div>
                <span className="text-white/50 text-xs leading-relaxed">
                  Я соглашаюсь на обработку персональных данных в соответствии с{" "}
                  <Link to="/privacy" className="underline text-white/70 hover:text-white transition-colors">
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={loading || !agreed}
                className="w-full py-4 rounded-lg font-bold text-white text-base mt-1 transition-colors disabled:opacity-40"
                style={{ backgroundColor: "var(--brand-red)" }}
                onMouseEnter={e => { if (!loading && agreed) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--brand-red-hover)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--brand-red)"; }}
              >
                {loading ? "Отправляем..." : "Перезвоните мне"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}