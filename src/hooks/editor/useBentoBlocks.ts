import type { Block, BlockData, SiteContent } from "@/types/editor";
import { BENTO_BLOCK_TYPES, BENTO_DEFAULTS } from "@/constants/bento-blocks";
import { createId } from "@/utils/id";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";

export function useBentoBlocks(
  content: SiteContent,
  updateContent: (updates: Partial<SiteContent>) => void,
) {
  const updateBentoBlock = (blockId: string, updates: Partial<Block>) => {
    const newBlocks = (content.blocks ?? []).map((b) =>
      b.id === blockId ? { ...b, ...updates } : b,
    );
    updateContent({ blocks: newBlocks });
  };

  const addBentoBlock = (type: string, customData?: BlockData) => {
    const blockMeta = BENTO_BLOCK_TYPES.find((b) => b.type === type);
    const newBlock: Block = {
      id: createId(),
      type,
      colSpan: blockMeta?.defaultColSpan ?? 1,
      rowSpan: blockMeta?.defaultRowSpan ?? 1,
      data: customData ?? BENTO_DEFAULTS[type] ?? {},
    };
    updateContent({ blocks: [...(content.blocks ?? []), newBlock] });
  };

  const deleteBentoBlock = (blockId: string) => {
    updateContent({
      blocks: (content.blocks ?? []).filter((b) => b.id !== blockId),
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const blocks = content.blocks ?? [];
      const oldIdx = blocks.findIndex((b) => b.id === active.id);
      const newIdx = blocks.findIndex((b) => b.id === over.id);
      updateContent({ blocks: arrayMove(blocks, oldIdx, newIdx) });
    }
  };

  return { updateBentoBlock, addBentoBlock, deleteBentoBlock, handleDragEnd };
}