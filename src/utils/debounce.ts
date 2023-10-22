type DebouncedFunction<T extends any[] = any[]> = (...args: T) => void;

export default function debounce<T extends any[]>(
  func: (...args: T) => void,
  delay: number,
): DebouncedFunction<T> {
  let timer: NodeJS.Timeout | undefined;

  return function (...args: T) {
    clearTimeout(timer!);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}