'use client';

import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { ZaikoShell, ZaikoContent } from '../_components/layout/zaiko-shell';
import { InventoryDetailForm } from '../_components/inventory/inventory-detail-form';
import { InventoryCreateInput } from '../_lib/inventory-schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ZaikoInputPage() {
  const router = useRouter();

  const handleSubmit = (data: InventoryCreateInput) => {
    console.log('新規登録:', data);
    // TODO: Phase 3でAPI連携実装
    toast.success('在庫を登録しました！');
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

