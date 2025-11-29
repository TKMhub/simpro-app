'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryQuantityStepper } from './inventory-quantity-stepper';
import { ZAIKO_CATEGORIES, ZAIKO_LOCATIONS } from '../../_lib/zaiko-constants';
import { cn } from '@/lib/utils';

// Schema
const formSchema = z.object({
  name: z.string().min(1, 'アイテム名は必須です'),
  iconName: z.string().min(1),
  categoryId: z.string().min(1, 'カテゴリを選択してください'),
  locationId: z.string().optional(),
  quantity: z.number().min(0),
  threshold: z.number().min(0),
  memo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InventoryDetailFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  isEdit?: boolean;
}

const EMOJI_PRESETS = ['📦', '🧻', '🧼', '🧴', '💄', '💊', '🍱', '🍙', '🥦', '🥩', '🥚', '🥛', '☕️', '🍺', '🧊', '🍳', '🍽️', '🥢', '🧹', '🪣', '👕', '🔋', '💡', '🩹'];

export function InventoryDetailForm({ defaultValues, onSubmit, isEdit = false }: InventoryDetailFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      iconName: '📦',
      categoryId: '',
      quantity: 1,
      threshold: 1,
      memo: '',
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-24">
        
        {/* Icon & Name Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 space-y-4 shadow-sm">
           <FormField
            control={form.control}
            name="iconName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>アイコン</FormLabel>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                   {EMOJI_PRESETS.map(emoji => (
                     <button
                       key={emoji}
                       type="button"
                       onClick={() => field.onChange(emoji)}
                       className={cn(
                         "flex-shrink-0 h-10 w-10 rounded-full text-xl flex items-center justify-center transition-all",
                         field.value === emoji 
                           ? "bg-green-100 dark:bg-green-900 ring-2 ring-green-500 transform scale-110" 
                           : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200"
                       )}
                     >
                       {emoji}
                     </button>
                   ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>アイテム名</FormLabel>
                <FormControl>
                  <Input placeholder="例：トイレットペーパー" className="text-lg font-bold" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Quantity Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm flex flex-col items-center">
          <FormLabel className="mb-4 text-zinc-500">現在の在庫数</FormLabel>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <InventoryQuantityStepper
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Details Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 space-y-4 shadow-sm">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>カテゴリ</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ZAIKO_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="mr-2">{cat.icon}</span>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="locationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>保管場所</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="場所を選択（任意）" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ZAIKO_LOCATIONS.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="threshold"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>通知する基準（閾値）</FormLabel>
                  <span className="text-sm font-bold">{field.value} 個以下</span>
                </div>
                <div className="flex items-center gap-4 pt-2">
                   <Button 
                     type="button" 
                     variant="outline" 
                     size="sm" 
                     onClick={() => field.onChange(Math.max(0, field.value - 1))}
                   >
                     -
                   </Button>
                   <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${Math.min(100, (field.value / 10) * 100)}%` }} />
                   </div>
                   <Button 
                     type="button" 
                     variant="outline" 
                     size="sm" 
                     onClick={() => field.onChange(field.value + 1)}
                   >
                     +
                   </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Memo */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
           <FormField
            control={form.control}
            name="memo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メモ</FormLabel>
                <FormControl>
                  <Textarea placeholder="メーカーや購入店など" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-black/90 backdrop-blur border-t border-zinc-200 dark:border-zinc-800 flex justify-center">
           <div className="w-full max-w-[430px]">
             <Button type="submit" size="lg" className="w-full h-12 text-base font-bold shadow-lg">
              {isEdit ? '変更を保存' : '追加する'}
             </Button>
           </div>
        </div>

      </form>
    </Form>
  );
}

