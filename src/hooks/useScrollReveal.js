import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        } else {
          // Re-animate when scrolling far past
          const bounding = entry.target.getBoundingClientRect();
          if (bounding.top > window.innerHeight * 1.5 || bounding.bottom < -window.innerHeight * 0.5) {
            entry.target.classList.remove('is-revealed');
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      threshold: 0.05,
      rootMargin: '50px 0px 50px 0px',
    });

    const observeAll = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => {
        // If element is already within viewport on mount/filter, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-revealed');
        }
        observer.observe(el);
      });
    };

    observeAll();

    // Re-observe when DOM mutations occur (e.g. tab switches, filters)
    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
