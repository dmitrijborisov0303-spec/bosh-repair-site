const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

type UtmKey = typeof UTM_KEYS[number];
export type UtmParams = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "utm_params";

export function captureUtmParams(): void {
  const params = new URLSearchParams(window.location.search);
  const found: UtmParams = {};
  let hasAny = false;

  UTM_KEYS.forEach(key => {
    const value = params.get(key);
    if (value) {
      found[key] = value;
      hasAny = true;
    }
  });

  if (hasAny) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  }
}

export function getUtmParams(): UtmParams {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
