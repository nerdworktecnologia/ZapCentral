import { useEffect, useRef, useState } from "react";

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (inView) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, optionsRef.current);

    obs.observe(el);

    return () => obs.disconnect();
  }, [inView]);

  return { ref, inView };
}
