import { useState } from "react";
import Icon from "@/components/ui/icon";

const NAV_LINKS = [
  { label: "Главная", href: "#home" },
  { label: "Услуги", href: "#services" },
  { label: "Прайс", href: "#price" },
  { label: "О сервисе", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

interface Props {
  onCallbackOpen: () => void;
}

export default function SiteHeader({ onCallbackOpen }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
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
    </>
  );
}
