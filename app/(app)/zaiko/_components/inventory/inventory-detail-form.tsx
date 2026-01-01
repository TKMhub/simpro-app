'use client';

import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { InventoryQuantityStepper } from './inventory-quantity-stepper';
import { ZAIKO_CATEGORIES, ZAIKO_LOCATIONS } from '../../_lib/zaiko-constants';
import { cn } from '@/lib/utils';

// Schema
const formSchema = z.object({
  name: z.string().min(1, 'アイテム名は必須です'),
  icon: z.string().min(1),
  category: z.string().min(1, 'カテゴリを選択してください'),
  location: z.string().optional(),
  quantity: z.number().min(0),
  threshold: z.number().min(0),
  memo: z.string().optional(),
  
  // Auto-consume
  autoConsume: z.boolean().default(false),
  consumeQuantity: z.number().min(1).default(1),
  consumeInterval: z.number().min(1).default(1),
});

type FormValues = z.infer<typeof formSchema>;

interface InventoryDetailFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  isEdit?: boolean;
  categories?: any[];
  locations?: any[];
}

const EMOJI_PRESETS = ['📦', '🧻', '🧼', '🧴', '💄', '💊', '🍱', '🍙', '🥦', '🥩', '🥚', '🥛', '☕️', '🍺', '🧊', '🍳', '🍽️', '🥢', '🧹', '🪣', '👕', '🔋', '💡', '🩹'];

export function InventoryDetailForm({ 
  defaultValues, 
  onSubmit, 
  isEdit = false, 
  categories = [], 
  locations = [] 
}: InventoryDetailFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      icon: '📦',
      category: '',
      quantity: 1,
      threshold: 1,
      memo: '',
      autoConsume: false,
      consumeQuantity: 1,
      consumeInterval: 1,
      ...defaultValues,
    },
  });

  const categoryOptions = useMemo(() => {
    if (categories && categories.length > 0) {
        return categories.map((cat: any) => {
            const constant = ZAIKO_CATEGORIES.find(c => c.label === cat.name);
            return {
                id: cat.id,
                label: cat.name,
                icon: constant?.icon || '📦'
            };
        });
    }
    return ZAIKO_CATEGORIES;
  }, [categories]);

  const locationOptions = useMemo(() => {
    if (locations && locations.length > 0) {
        return locations.map((loc: any) => ({
            id: loc.id,
            label: loc.name
        }));
    }
    return ZAIKO_LOCATIONS;
  }, [locations]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-32">
        
        {/* Icon & Name Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 space-y-4">
           <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>アイコン</FormLabel>
                <div className="-mx-4 px-4 flex gap-2 overflow-x-auto no-scrollbar py-2">
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
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 flex flex-col items-center">
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

        {/* Auto Consume Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 space-y-4">
            <FormField
              control={form.control}
              name="autoConsume"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>自動在庫減少</FormLabel>
                    <FormDescription>
                      日用品などを自動で減らします
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch('autoConsume') && (
                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg">
                    <FormField
                      control={form.control}
                      name="consumeInterval"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-xs">何日ごとに</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                                <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                <span className="text-sm text-zinc-500 whitespace-nowrap">日</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="consumeQuantity"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-xs">いくつ減らす</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                                <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                <span className="text-sm text-zinc-500 whitespace-nowrap">個</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            )}
        </div>

        {/* Details Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 space-y-4">
          <FormField
            control={form.control}
            name="category"
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
                    {categoryOptions.map((cat: any) => (
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
            name="location"
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
                    {locationOptions.map((loc: any) => (
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
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4">
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
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-black/90 backdrop-blur border-t border-zinc-200 dark:border-zinc-800 flex justify-center z-10">
           <div className="w-full max-w-[430px]">
             <Button type="submit" size="lg" className="w-full h-12 text-base font-bold shadow-lg bg-green-600 hover:bg-green-700 text-white">
              {isEdit ? '変更を保存' : '追加する'}
             </Button>
           </div>
        </div>

      </form>
    </Form>
  );
}
