'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { InventoryQuantityStepper } from './inventory-quantity-stepper';
import {
  inventoryCreateSchema,
  InventoryCreateInput,
} from '../../_lib/inventory-schema';
import {
  INVENTORY_CATEGORIES,
  INVENTORY_LOCATIONS,
  INVENTORY_ICONS,
} from '../../_lib/zaiko-constants';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem } from '../../_lib/motion-presets';

interface InventoryDetailFormProps {
  defaultValues?: Partial<InventoryCreateInput>;
  onSubmit: (data: InventoryCreateInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function InventoryDetailForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = '保存',
}: InventoryDetailFormProps) {
  const form = useForm<InventoryCreateInput>({
    resolver: zodResolver(inventoryCreateSchema),
    defaultValues: {
      name: '',
      icon: '📦',
      category: '',
      location: '',
      quantity: 0,
      threshold: 3,
      memo: '',
      ...defaultValues,
    },
  });

  const selectedIcon = form.watch('icon');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* アイコン選択 */}
          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold">アイコン</FormLabel>
                  <FormDescription>アイテムを表すアイコンを選択</FormDescription>
                  <FormControl>
                    <ScrollArea className="w-full whitespace-nowrap rounded-xl border-2 p-4">
                      <div className="flex gap-2">
                        {INVENTORY_ICONS.map((icon) => (
                          <motion.button
                            key={icon}
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => field.onChange(icon)}
                            className={cn(
                              'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 text-2xl transition-all',
                              selectedIcon === icon
                                ? 'border-[#32D17D] bg-[#32D17D]/10 scale-110'
                                : 'border-muted hover:border-muted-foreground/50'
                            )}
                          >
                            {icon}
                          </motion.button>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* アイテム名 */}
          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold">アイテム名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例: トイレットペーパー"
                      className="h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* カテゴリ */}
          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold">カテゴリ</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INVENTORY_CATEGORIES.filter((cat) => cat.id !== 'all').map(
                        (category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="text-base"
                          >
                            <span className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              <span>{category.label}</span>
                            </span>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* 保管場所 */}
          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold">
                    保管場所 <span className="text-muted-foreground">(任意)</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="保管場所を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INVENTORY_LOCATIONS.map((location) => (
                        <SelectItem
                          key={location.id}
                          value={location.label}
                          className="text-base"
                        >
                          <span className="flex items-center gap-2">
                            <span>{location.icon}</span>
                            <span>{location.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* 在庫数量 */}
          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold">現在の在庫</FormLabel>
                  <FormDescription>初期の在庫数を設定</FormDescription>
                  <FormControl>
                    <div className="flex justify-center rounded-xl border-2 bg-muted/30 py-6">
                      <InventoryQuantityStepper
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* 閾値 */}
          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold">
                    アラート閾値
                  </FormLabel>
                  <FormDescription>
                    この個数以下になったらアラートを表示
                  </FormDescription>
                  <FormControl>
                    <div className="flex justify-center rounded-xl border-2 bg-muted/30 py-6">
                      <InventoryQuantityStepper
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* メモ */}
          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold">
                    メモ <span className="text-muted-foreground">(任意)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="メモや備考を記入"
                      className="min-h-24 resize-none text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* ボタン */}
          <motion.div variants={staggerItem} className="flex gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 text-base font-semibold"
                onClick={onCancel}
              >
                キャンセル
              </Button>
            )}
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-[#32D17D] text-base font-bold text-white hover:bg-[#2BB870]"
            >
              {submitLabel}
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </Form>
  );
}

