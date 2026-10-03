import { useEffect, useState, useRef } from 'react';

/* One IntersectionObserver per rootMargin, shared by every caller. Each
   Reveal used to construct its own observer, so twelve components meant twelve
   observers each walking the same intersection candidates on every scroll
   frame. Observers with identical options can share one callback queue. */

const pools = new Map();

const subscribe = (el, margin, once, onChange) => {
  let pool = pools.get(margin);
  if (!pool) {
    const members = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const member = members.get(entry.target);
          if (!member) continue;
          if (entry.isIntersecting) {
            member.onChange(true);
            if (member.once) {
              observer.unobserve(entry.target);
              members.delete(entry.target);
            }
          } else if (!member.once) {
            member.onChange(false);
          }
        }
        // Drop the observer once nothing is watching it, so a page that
        // unmounts its reveals does not leave a live observer behind.
        if (!members.size) {
          observer.disconnect();
          pools.delete(margin);
        }
      },
      { rootMargin: margin }
    );
    pool = { observer, members };
    pools.set(margin, pool);
  }

  pool.members.set(el, { once, onChange });
  pool.observer.observe(el);

  return () => {
    pool.members.delete(el);
    pool.observer.unobserve(el);
  };
};

const useInView = ({ once = true, margin = "-100px" } = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return subscribe(el, margin, once, setIsInView);
  }, [margin, once]);

  return [ref, isInView];
};

export default useInView;