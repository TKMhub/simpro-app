"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src?: string;
  alt?: string;
  fallbackSrc: string;
};

export default function ImageWithFallback({ src, alt = "image", fallbackSrc, ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  const actualSrc = !src || failed ? fallbackSrc : src;
  return (
    <Image
      {...rest}
      src={actualSrc}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}

