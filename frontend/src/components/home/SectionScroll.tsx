"use client";

import { useRef, useEffect, useCallback } from "react";

const SCROLL_DURATION = 1000;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function SectionScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);

  const scrollToSection = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container || isAnimating.current) return;

    const sections = Array.from(container.children) as HTMLElement[];
    if (index < 0 || index >= sections.length) return;

    isAnimating.current = true;
    currentIndex.current = index;

    const start = container.scrollTop;
    const end = sections[index].offsetTop;
    const distance = end - start;

    if (distance === 0) {
      isAnimating.current = false;
      return;
    }

    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);

      container.scrollTop = start + distance * easeInOutCubic(progress);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          isAnimating.current = false;
        }, 50);
      }
    };

    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;

      if (e.deltaY > 0) {
        scrollToSection(currentIndex.current + 1);
      } else if (e.deltaY < 0) {
        scrollToSection(currentIndex.current - 1);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) {
        scrollToSection(currentIndex.current + (delta > 0 ? 1 : -1));
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isAnimating.current) return;

      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " "
      ) {
        e.preventDefault();
        scrollToSection(currentIndex.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToSection(currentIndex.current - 1);
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [scrollToSection]);

  return (
    <div ref={containerRef} className="h-screen overflow-y-auto no-scrollbar">
      {children}
    </div>
  );
}
