import { Blog } from './components/Blog/Blog';
import { FAQ } from './components/FAQ/FAQ';
import { Engine } from './components/Engine/Engine';
import { Features } from './components/Features/Features';
import { TopBlock } from './components/TopBlock/TopBlock';
import { WhyDroms } from './components/WhyDroms/WhyDroms';
import ReactLenis, { LenisRef, useLenis } from 'lenis/react';
import { Header } from '../../components/Header';
import { MouseEvent, useEffect, useRef } from 'react';

export const LendingScreen = () => {
  const lenis = useLenis();
  const lenisRef = useRef<LenisRef>(null);

  const handleScroll = (e: MouseEvent, targetId: string) => {
    e.preventDefault();
    lenis?.scrollTo(targetId, {
      duration: 2,
    });
  };

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time);
    }

    const rafId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="scrollbar-hidden">
      <ReactLenis
        ref={lenisRef}
        className="min-h-screen max-h-screen bg-nav-bg text-nav-text font-medium font-body transition-colors duration-500 overflow-auto"
        props={{
          id: 'viewport',
        }}
        root
        options={{
          smoothWheel: true,
          syncTouch: false,
          lerp: 0.05,
        }}
      >
        <Header handleScroll={handleScroll} />{' '}
        {/* Pass handleScroll to Header */}
        <div className="mx-auto">
          <TopBlock />
          <div className="relative mx-auto">
            <Features id="features" />
            <WhyDroms id="why-aerodrome" />
            <Engine id="engine" />
            <Blog id="blog" />
            <FAQ />
          </div>
        </div>
      </ReactLenis>
    </div>
  );
};
