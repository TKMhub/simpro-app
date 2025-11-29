"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ZaikoHeader } from "../_components/layout/zaiko-header";
import { AlertBanner } from "../_components/common/alert-banner";
import { InventoryFilterChips } from "../_components/inventory/inventory-filter-chips";
import { InventoryList } from "../_components/inventory/inventory-list";
import { FabAddButton } from "../_components/layout/fab-add-button";
import { ZaikoBottomSheet } from "../_components/layout/zaiko-bottom-sheet";
import { Button } from "@/components/ui/button";
import { InventoryQuantityStepper } from "../_components/inventory/inventory-quantity-stepper";
import {
  CATEGORIES,
  getInventoryStatus,
  type MockInventoryItem,
} from "../_lib/zaiko-constants";
import { Trash2, Edit } from "lucide-react";

// モックデータ
const mockInventoryItems: MockInventoryItem[] = [
  {
    id: "1",
    name: "トイレットペーパー",
    icon: "Package",
    category: "toilet",
    quantity: 3,
    threshold: 2,
    location: "トイレ",
    status: "low",
  },
  {
    id: "2",
    name: "洗剤",
    icon: "Container",
    category: "detergent",
    quantity: 5,
    threshold: 3,
    location: "洗面所",
    status: "enough",
  },
  {
    id: "3",
    name: "ティッシュペーパー",
    icon: "Box",
    category: "tissue",
    quantity: 0,
    threshold: 2,
    location: "リビング",
    status: "empty",
  },
  {
    id: "4",
    name: "ラップ",
    icon: "Archive",
    category: "kitchen",
    quantity: 2,
    threshold: 1,
    location: "キッチン",
    status: "low",
  },
];

export default function ZaikoDashboardPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MockInventoryItem | null>(
    null
  );
  const [items, setItems] = useState(mockInventoryItems);

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const alertCount = items.filter(
    (item) => item.status === "low" || item.status === "empty"
  ).length;

  const handleQuickEdit = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setSelectedItem(item);
      setBottomSheetOpen(true);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (selectedItem) {
      const updatedItems = items.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              quantity: newQuantity,
              status: getInventoryStatus(newQuantity, item.threshold),
            }
          : item
      );
      setItems(updatedItems);
      setSelectedItem({
        ...selectedItem,
        quantity: newQuantity,
        status: getInventoryStatus(newQuantity, selectedItem.threshold),
      });
    }
  };

  return (
    <>
      <ZaikoHeader
        title="マイ在庫"
        leftIcon="menu"
        onLeftClick={() => {
          // TODO: メニュー実装
          console.log("メニューを開く");
        }}
      />

      <AlertBanner
        count={alertCount}
        onClick={() => router.push("/zaiko/tobuy")}
      />

      <InventoryFilterChips
        filters={CATEGORIES}
        activeId={selectedCategory}
        onChange={setSelectedCategory}
      />

      <div className="px-4 py-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          在庫一覧
        </h2>
      </div>

      <InventoryList
        items={filteredItems}
        onItemClick={(id) => router.push(`/zaiko/detail/${id}`)}
        onQuickEdit={handleQuickEdit}
      />

      <FabAddButton
        onClick={() => router.push("/zaiko/input")}
        aria-label="在庫を追加"
      />

      <ZaikoBottomSheet
        open={bottomSheetOpen}
        onOpenChange={setBottomSheetOpen}
        title={selectedItem?.name}
      >
        {selectedItem && (
          <div className="space-y-6">
            <InventoryQuantityStepper
              value={selectedItem.quantity}
              min={0}
              onChange={handleQuantityChange}
              label="在庫数量"
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  router.push(`/zaiko/detail/${selectedItem.id}`);
                  setBottomSheetOpen(false);
                }}
              >
                <Edit className="size-4 mr-2" />
                詳細を編集
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  setItems(items.filter((i) => i.id !== selectedItem.id));
                  setBottomSheetOpen(false);
                }}
              >
                <Trash2 className="size-4 mr-2" />
                削除
              </Button>
            </div>
          </div>
        )}
      </ZaikoBottomSheet>
    </>
  );
}

