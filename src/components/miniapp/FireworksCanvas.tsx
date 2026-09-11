"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export interface FireworksHandle {
  burstAt: (nx: number, ny: number, scale?: number) => void;
  finale: () => void;
}

interface Props {
  auto?: boolean;
  interactive?: boolean;
  density?: number;
  className?: string;
  onInteract?: () => void;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  top: number;
  scale: number;
}

interface Spark {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  flicker: boolean;
}

const PALETTE = [
  "#e8ffd4",
  "#d4ffa3",
  "#aef75e",
  "#8ce02e",
  "#c9ff8a",
  "#7cc926",
  "#f4ffe3",
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const FireworksCanvas = forwardRef<FireworksHandle, Props>(
  function FireworksCanvas(
    { auto = false, interactive = true, density = 1, className, onInteract },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rocketsRef = useRef<Rocket[]>([]);
    const sparksRef = useRef<Spark[]>([]);
    const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
    const nextLaunchRef = useRef(0);
    const autoRef = useRef(auto);
    autoRef.current = auto;

    const explode = useCallback((x: number, y: number, scale = 1) => {
      const count = Math.floor(rand(54, 92) * scale);
      const base = pick(PALETTE);
      const shape = Math.random();
      for (let i = 0; i < count; i++) {
        let angle: number;
        let speed: number;
        if (shape < 0.25) {
          // ива — длинные нисходящие нити
          angle = rand(Math.PI * 0.9, Math.PI * 2.1);
          speed = rand(1.2, 3.4) * scale;
        } else if (shape < 0.55) {
          // кольцо
          angle = (i / count) * Math.PI * 2;
          speed = rand(2.6, 3.4) * scale;
        } else {
          // шар
          angle = rand(0, Math.PI * 2);
          speed = rand(0.6, 4.4) * scale;
        }
        const life = rand(52, 110) * (shape < 0.25 ? 1.35 : 1);
        sparksRef.current.push({
          x,
          y,
          px: x,
          py: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          color: Math.random() < 0.72 ? base : pick(PALETTE),
          size: rand(1.1, 2.3) * Math.min(scale, 1.6),
          flicker: Math.random() < 0.5,
        });
      }
      if (sparksRef.current.length > 1400) {
        sparksRef.current.splice(0, sparksRef.current.length - 1400);
      }
    }, []);

    const launch = useCallback(
      (targetX?: number, targetY?: number) => {
        const { w, h } = sizeRef.current;
        if (!w || !h) return;
        const x = targetX !== undefined ? targetX : rand(w * 0.12, w * 0.88);
        const top =
          targetY !== undefined ? targetY : rand(h * 0.14, h * 0.45);
        rocketsRef.current.push({
          x,
          y: h + 8,
          vx: rand(-0.35, 0.35),
          vy: rand(-9.2, -7.1) * Math.max(0.72, h / 520),
          color: pick(PALETTE),
          top,
          scale: rand(0.8, 1.25),
        });
      },
      [],
    );

    useImperativeHandle(
      ref,
      () => ({
        burstAt: (nx, ny, scale = 1) => {
          const { w, h } = sizeRef.current;
          explode(nx * w, ny * h, scale);
        },
        finale: () => {
          for (let i = 0; i < 6; i++) {
            setTimeout(() => launch(), i * 260);
          }
        },
      }),
      [explode, launch],
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

      const resize = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        sizeRef.current = { w, h, dpr };
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      const ro = new ResizeObserver(resize);
      if (canvas.parentElement) ro.observe(canvas.parentElement);

      let raf = 0;
      let last = performance.now();

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(33, now - last); // мс
        last = now;
        const { w, h } = sizeRef.current;
        if (!w || !h) return;

        const step = dt / 16.7;

        // затухание предыдущего кадра → шлейфы
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(3, 5, 3, 0.2)";
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";

        // авто-залпы
        const want =
          autoRef.current &&
          !reduced.matches &&
          typeof document !== "undefined" &&
          !document.hidden;
        if (want && now >= nextLaunchRef.current) {
          launch();
          nextLaunchRef.current = now + rand(650, 1700) / density;
        }

        // ракеты
        const rockets = rocketsRef.current;
        for (let i = rockets.length - 1; i >= 0; i--) {
          const r = rockets[i];
          r.x += r.vx * step;
          r.y += r.vy * step;
          r.vy += 0.09 * step;
          // искры от фитиля
          if (Math.random() < 0.6) {
            sparksRef.current.push({
              x: r.x,
              y: r.y,
              px: r.x,
              py: r.y,
              vx: rand(-0.5, 0.5),
              vy: rand(0.4, 1.4),
              life: 18,
              maxLife: 18,
              color: "#d4ffa3",
              size: 1,
              flicker: true,
            });
          }
          ctx.strokeStyle = r.color;
          ctx.globalAlpha = 0.9;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(r.x - r.vx * 3, r.y - r.vy * 3);
          ctx.lineTo(r.x, r.y);
          ctx.stroke();
          if (r.y <= r.top || r.vy >= -1.6) {
            rockets.splice(i, 1);
            explode(r.x, Math.max(r.y, h * 0.1), r.scale);
          }
        }

        // частицы
        const sparks = sparksRef.current;
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.px = s.x;
          s.py = s.y;
          s.x += s.vx * step;
          s.y += s.vy * step;
          s.vx *= 0.985;
          s.vy = s.vy * 0.985 + 0.035 * step;
          s.life -= step;
          if (s.life <= 0 || s.y > h + 20) {
            sparks.splice(i, 1);
            continue;
          }
          const t = s.life / s.maxLife;
          const alpha = s.flicker ? t * (0.55 + 0.45 * Math.sin(now / 30 + i)) : t;
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.strokeStyle = s.color;
          ctx.lineWidth = s.size;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(s.px, s.py);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      };
      raf = requestAnimationFrame(frame);

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
      };
    }, [explode, launch, density]);

    return (
      <canvas
        ref={canvasRef}
        className={className}
        aria-hidden
        onPointerDown={
          interactive
            ? (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                explode(
                  e.clientX - rect.left,
                  e.clientY - rect.top,
                  1.1,
                );
                onInteract?.();
              }
            : undefined
        }
        style={{ touchAction: "manipulation" }}
      />
    );
  },
);
