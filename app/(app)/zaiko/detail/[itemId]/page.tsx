'use client';

import { use, useState } from 'react';
import { ZaikoHeader } from '../../_components/layout/zaiko-header';
import { ZaikoShell, ZaikoContent } from '../../_components/layout/zaiko-shell';
import { InventoryDetailForm } from '../../_components/inventory/inventory-detail-form';
import { InventoryCreateInput } from '../../_lib/inventory-schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

// モックデータ（本来はAPIから取得）
const mockData: Record<string, InventoryCreateInput> = {
  '1': {
    name: 'トイレットペーパー',
    icon: '🧻',
    category: 'toiletries',
    location: 'トイレ棚',
    quantity: 3,
    threshold: 3,
    memo: '12ロールパック',
  },
  '2': {
    name: '食器用洗剤',
    icon: '🧼',
    category: 'detergent',
    location: 'キッチン',
    quantity: 1,
    threshold: 2,
    memo: '',
  },
};

export default function ZaikoDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const router = useRouter();
  const { itemId } = use(params);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemData = mockData[itemId];

  const handleSubmit = (data: InventoryCreateInput) => {
    console.log('更新:', { itemId, ...data });
    // TODO: Phase 3でAPI連携実装
    toast.success('在庫を更新しました！');
    router.push('/zaiko/dashboard');
  };

  const handleDelete = () => {
    setIsDeleting(true);
    console.log('削除:', itemId);
    // TODO: Phase 3でAPI連携実装
    setTimeout(() => {
      toast.success('在庫を削除しました');
      router.push('/zaiko/dashboard');
    }, 500);
  };

  const handleCancel = () => {
    router.back();
  };

  if (!itemData) {
    return (
      <>
        <ZaikoHeader showBack onBack={handleCancel} />
        <ZaikoShell>
          <ZaikoContent>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center">
              <div className="mb-4 text-6xl">😵</div>
              <h3 className="mb-2 text-lg font-bold">在庫が見つかりません</h3>
              <p className="text-sm text-muted-foreground">
                指定された在庫は存在しません
              </p>
            </div>
          </ZaikoContent>
        </ZaikoShell>
      </>
    );
  }

  return (
    <>
      <ZaikoHeader
        title="在庫の詳細"
        showBack
        onBack={handleCancel}
        rightAction={
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>在庫を削除しますか？</AlertDialogTitle>
                <AlertDialogDescription className="text-base leading-relaxed">
                  この操作は取り消せません。
                  <br />
                  本当に削除してもよろしいですか？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-base">
                  キャンセル
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-base text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? '削除中...' : '削除'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }
      />
      <ZaikoShell>
        <ZaikoContent>
          <InventoryDetailForm
            defaultValues={itemData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="更新"
          />
        </ZaikoContent>
      </ZaikoShell>
    </>
  );
}

