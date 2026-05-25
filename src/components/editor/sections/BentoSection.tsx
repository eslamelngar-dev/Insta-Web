"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BlockTypeSelector } from "../blocks/BlockTypeSelector";
import { SortableBlockItem } from "../blocks/SortableBlockItem";
import { useBentoBlocks } from "@/hooks/editor/useBentoBlocks";
import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target?: string,
  ) => void;
  uploadingId: string | null;
  onOpenMediaLibrary: (onSelect: (url: string) => void) => void;
  onMediaSelect: (url: string, target?: string) => void;
}

export function BentoSection({
  content,
  updateContent,
  handleImageUpload,
  uploadingId,
  onOpenMediaLibrary,
  onMediaSelect,
}: Props) {
  const { updateBentoBlock, addBentoBlock, deleteBentoBlock, handleDragEnd } =
    useBentoBlocks(content, updateContent);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className="space-y-6 sm:space-y-10 pb-32">
      <BlockTypeSelector onAdd={addBentoBlock} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(content.blocks ?? []).map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4 sm:space-y-6">
            {(content.blocks ?? []).map((block) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                updateBentoBlock={updateBentoBlock}
                deleteBlock={deleteBentoBlock}
                handleImageUpload={handleImageUpload}
                uploadingId={uploadingId}
                onOpenMediaLibrary={onOpenMediaLibrary}
                onMediaSelect={onMediaSelect}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
