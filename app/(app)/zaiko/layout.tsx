import { ReactNode } from "react";
import { ZaikoShell } from "./_components/layout/zaiko-shell";

export default function ZaikoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ZaikoShell>{children}</ZaikoShell>;
}

