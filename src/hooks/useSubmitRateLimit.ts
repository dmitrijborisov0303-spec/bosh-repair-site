import { useRef, useState } from "react";

const COOLDOWN_MS = 30_000;

export function useSubmitRateLimit() {
  const lastSubmitRef = useRef<number>(0);
  const [cooldown, setCooldown] = useState(false);

  function check(): boolean {
    const now = Date.now();
    if (now - lastSubmitRef.current < COOLDOWN_MS) {
      setCooldown(true);
      return false;
    }
    return true;
  }

  function register() {
    lastSubmitRef.current = Date.now();
    setCooldown(false);
  }

  return { check, register, cooldown };
}
