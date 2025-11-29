"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  inventoryCreateSchema,
  type InventoryCreateInput,
} from "../../_lib/inventory-schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InventoryQuantityStepper } from "./inventory-quantity-stepper";
import { CATEGORIES, LOCATIONS, INVENTORY_ICONS } from "../../_lib/zaiko-constants";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

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
  submitLabel = "保存",
}: InventoryDetailFormProps) {
  const [selectedIcon, setSelectedIcon] = useState<string>(
    defaultValues?.icon || INVENTORY_ICONS[0]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InventoryCreateInput>({
    resolver: zodResolver(inventoryCreateSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      icon: defaultValues?.icon || INVENTORY_ICONS[0],
      category: defaultValues?.category || CATEGORIES[1].id,
      location: defaultValues?.location || "",
      quantity: defaultValues?.quantity || 0,
      threshold: defaultValues?.threshold || 1,
      memo: defaultValues?.memo || "",
    },
  });

  const quantity = watch("quantity");
  const threshold = watch("threshold");

  const handleFormSubmit = (data: InventoryCreateInput) => {
    onSubmit({ ...data, icon: selectedIcon });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 px-4 pb-24">
      {/* アイコン選択 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          アイコン
        </Label>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {INVENTORY_ICONS.map((iconName) => {
            const IconComponent =
              (LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{
                className?: string;
              }>) || LucideIcons.Package;
            const isSelected = selectedIcon === iconName;

            return (
              <button
                key={iconName}
                type="button"
                onClick={() => {
                  setSelectedIcon(iconName);
                  setValue("icon", iconName);
                }}
                className={cn(
                  "flex-shrink-0 size-16 rounded-2xl border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "border-[#32D17D] bg-[#32D17D]/10 dark:bg-[#32D17D]/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <IconComponent
                  className={cn(
                    "size-8",
                    isSelected
                      ? "text-[#32D17D]"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* アイテム名 */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          アイテム名 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="例: トイレットペーパー"
          className="h-12 text-base"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* カテゴリ */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          カテゴリ <span className="text-red-500">*</span>
        </Label>
        <Select
          value={watch("category")}
          onValueChange={(value) => setValue("category", value)}
        >
          <SelectTrigger id="category" className="h-12 text-base">
            <SelectValue placeholder="カテゴリを選択" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.filter((c) => c.id !== "all").map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* 保管場所 */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          保管場所
        </Label>
        <Select
          value={watch("location") || ""}
          onValueChange={(value) => setValue("location", value)}
        >
          <SelectTrigger id="location" className="h-12 text-base">
            <SelectValue placeholder="保管場所を選択（任意）" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">選択しない</SelectItem>
            {LOCATIONS.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 数量 */}
      <InventoryQuantityStepper
        value={quantity}
        min={0}
        onChange={(value) => setValue("quantity", value)}
        label="現在の在庫"
      />

      {/* 閾値 */}
      <InventoryQuantityStepper
        value={threshold}
        min={0}
        onChange={(value) => setValue("threshold", value)}
        label="アラート閾値（この数量以下で通知）"
      />

      {/* メモ */}
      <div className="space-y-2">
        <Label htmlFor="memo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          メモ
        </Label>
        <Textarea
          id="memo"
          {...register("memo")}
          placeholder="メモを入力（任意）"
          className="min-h-[100px] text-base"
        />
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 h-12 text-base"
          >
            キャンセル
          </Button>
        )}
        <Button
          type="submit"
          className="flex-1 h-12 text-base bg-[#32D17D] hover:bg-[#22C55E] text-white"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

