import { RefObject, useCallback, useEffect } from 'react';

export const useChangeOrientationBlur = (ref: RefObject<HTMLElement>) => {
  const handleBlur = useCallback(() => {
    ref.current?.blur();
  }, [ref]);

  useEffect(() => {
    window.addEventListener('orientationchange', handleBlur);

    return () => window.removeEventListener('orientationchange', handleBlur);
  }, [handleBlur]);
};
