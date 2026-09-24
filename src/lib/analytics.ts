const METRIKA_COUNTERS = [101026698, 109804992, 112997166];

// Соответствие ID рекламной кампании Яндекс.Директ (число в конце utm_campaign) счётчику Метрики.
// Когда появятся ID кампаний по видам техники — впишите их сюда, и цель по такой заявке
// будет уходить ТОЛЬКО в привязанный счётчик (плюс во все счётчики, как сейчас, если не заполнено).
// '123456': 101026698,
// '789012': 112997166,
const CAMPAIGN_COUNTER_MAP: Record<string, number> = {
  // 'campaign_id': counter_id
};

type YmFunction = (counterId: number, method: string, target: string, params?: Record<string, unknown>) => void;

function getCampaignId(): string | null {
  try {
    const raw = localStorage.getItem("utm_params");
    if (!raw) return null;
    const utm = JSON.parse(raw) as { utm_campaign?: string };
    const match = utm.utm_campaign?.match(/_(\d+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function getTargetCounters(): number[] {
  const campaignId = getCampaignId();
  const mapped = campaignId ? CAMPAIGN_COUNTER_MAP[campaignId] : undefined;
  if (mapped) return [mapped];
  return METRIKA_COUNTERS;
}

export function reachGoal(target: string, params?: Record<string, unknown>): void {
  const ym = (window as typeof window & { ym?: YmFunction }).ym;
  if (typeof ym !== "function") return;

  getTargetCounters().forEach(counterId => {
    try {
      ym(counterId, "reachGoal", target, params);
    } catch {
      // не критично, если метрика недоступна
    }
  });
}