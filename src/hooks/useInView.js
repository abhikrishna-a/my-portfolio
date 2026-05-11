import { useEffect, useState, useRef, useMemo } from 'react';

const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  const { once = true, margin = "-100px", ...observerOptions } = options;
  const memoizedOptions = useMemo(() => observerOptions, [observerOptions.root, observerOptions.threshold]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (once) {
          observer.unobserve(entry.target);
        }
      } else {
        if (!once) {
          setIsInView(false);
        }
      }
    }, { margin, ...memoizedOptions });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [margin, once, memoizedOptions]);

  return [ref, isInView];
};

export default useInView;
