import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zaiko - 在庫管理アプリ',
  description:
    '家庭の在庫管理を考える手間ゼロへ。スマホで簡単に在庫を管理し、家族と共有できるアプリ。',
};

export default function ZaikoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="zaiko-app min-h-screen">
      {children}
    </div>
  );
}

