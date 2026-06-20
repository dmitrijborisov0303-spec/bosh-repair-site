import { useState } from "react";
import CallbackModal from "@/components/CallbackModal";
import SiteHeader from "@/components/sections/SiteHeader";
import SiteHero from "@/components/sections/SiteHero";
import SiteFaqContacts from "@/components/sections/SiteFaqContacts";

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [callbackOpen, setCallbackOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-light)", color: "var(--brand-text)", fontFamily: "'Golos Text', sans-serif" }}>
      <SiteHeader onCallbackOpen={() => setCallbackOpen(true)} />
      <SiteHero onCallbackOpen={() => setCallbackOpen(true)} />
      <SiteFaqContacts openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <CallbackModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </div>
  );
}
