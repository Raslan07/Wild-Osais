import { useEffect, useRef } from 'react';

export function useOutSideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        handler(e);
      }
    }

    document.addEventListener('click', handleClick, listenCapturing);
    // Clean up Function
    return () =>
      document.removeEventListener('click', handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}
