'use client';

import { use } from 'react';
import { ZaikoHeader } from '../../_components/layout/zaiko-header';
import { ZaikoShell, ZaikoContent } from '../../_components/layout/zaiko-shell';
import { InventoryDetailForm } from '../../_components/inventory/inventory-detail-form';
import { InventoryCreateInput } from '../../_lib/inventory-schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function ZaikoFamilyInputPage({
  params,
}: {
  params: Promise<{ familyName: string }>;
}) {
  const router = useRouter();
  const { familyName } = use(params);

  const handleSubmit = (data: InventoryCreateInput) => {
    console.log('家族用新規登録:', { familyName, ...data });
    // TODO: Phase 3でAPI連携実装
    toast.success(`${familyName}の在庫を登録しました！`);
    router.push('/zaiko/dashboard');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <ZaikoHeader
        title="新しい在庫を追加"
        showBack
        onBack={handleCancel}
      />
      <ZaikoShell>
        <ZaikoContent>
          {/* 家族名表示 */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-base font-bold"
            >
              {decodeURIComponent(familyName)}
            </Badge>
          </div>

          <InventoryDetailForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="追加"
          />
        </ZaikoContent>
      </ZaikoShell>
    </>
  );
}

