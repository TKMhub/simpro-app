"use client";

import * as React from "react";

type Props = React.PropsWithChildren<{
  className?: string;
  once?: boolean;
  rootMargin?: string;
}>;

export default function Reveal({ children, className, once = true, rootMargin = "0px 0px -10% 0px" }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShow(true);
            if (once) io.unobserve(el);
          } else if (!once) {
            setShow(false);
          }
        }
      },
      { root: null, rootMargin, threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin]);

  return (
    <div ref={ref} className={["reveal", show ? "in" : "", className ?? ""].join(" ")}>{children}</div>
  );
}

