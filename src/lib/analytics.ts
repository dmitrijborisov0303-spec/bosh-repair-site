const METRIKA_COUNTERS = [101026698, 109804992, 112997166];

type YmFunction = (counterId: number, method: string, target: string, params?: Record<string, unknown>) => void;

export function reachGoal(target: string, params?: Record<string, unknown>): void {
  const ym = (window as typeof window & { ym?: YmFunction }).ym;
  if (typeof ym !== "function") return;

  METRIKA_COUNTERS.forEach(counterId => {
    try {
      ym(counterId, "reachGoal", target, params);
    } catch {
      // не критично, если метрика недоступна
    }
  });
}
