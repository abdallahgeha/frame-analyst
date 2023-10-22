type ThrottledFunction<T extends any[] = any[]> = (...args: T) => void;

export default function throttle<T extends any[]>(
  func: (...args: T) => void,
  delay: number,
): ThrottledFunction<T> {
  let lastCallTime: number | null = null;

  return function (...args: T) {
    const currentTime = Date.now();

    if (lastCallTime === null || currentTime - lastCallTime >= delay) {
      lastCallTime = currentTime;
      func(...args);
    }
  };
}