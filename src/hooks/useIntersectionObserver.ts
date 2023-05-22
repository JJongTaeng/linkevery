import { useEffect, useState } from 'react';

export function useIntersectionObserver<T extends HTMLElement>(
  ref: React.RefObject<T>,
  option?: IntersectionObserverInit,
) {
  const [isIntersecting, setIntersected] = useState(false);
  const io = new IntersectionObserver(([entry]) => {
    setIntersected(entry.isIntersecting);
  }, option);
  useEffect(() => {
    if (!ref.current) return;
    io.observe(ref.current);
    return () => {
      io.disconnect();
    };
  }, [ref.current]);

  return [isIntersecting];
}
