"use client";

import { MapPin } from "lucide-react";
import type { Block } from "@/types/editor";

interface Props {
  block: Block;
  updateBentoBlock: (id: string, updates: Partial<Block>) => void;
}

export function LocationBlockEditor({ block, updateBentoBlock }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 bg-teal-500/5 border border-teal-500/20 rounded-xl">
        <MapPin size={14} className="text-teal-500 shrink-0" />
        <input
          value={block.data.label ?? ""}
          onChange={(e) => updateBentoBlock(block.id, { data: { ...block.data, label: e.target.value } })}
          placeholder="Cairo, Egypt"
          className="bg-transparent text-sm font-bold outline-none w-full text-teal-700 dark:text-teal-300 placeholder:text-teal-400/50"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <p className="text-[8px] font-black text-teal-500 uppercase ml-1">Latitude</p>
          <input
            type="number"
            value={block.data.lat ?? ""}
            onChange={(e) => updateBentoBlock(block.id, { data: { ...block.data, lat: parseFloat(e.target.value) } })}
            placeholder="29.95"
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-teal-500/20 rounded-xl px-3 py-2.5 text-xs outline-none"
          />
        </div>
        <div className="space-y-1">
          <p className="text-[8px] font-black text-teal-500 uppercase ml-1">Longitude</p>
          <input
            type="number"
            value={block.data.lng ?? ""}
            onChange={(e) => updateBentoBlock(block.id, { data: { ...block.data, lng: parseFloat(e.target.value) } })}
            placeholder="31.00"
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-teal-500/20 rounded-xl px-3 py-2.5 text-xs outline-none"
          />
        </div>
      </div>
      <p className="text-[9px] text-slate-400 font-bold ml-1">
        Find Lat/Lng on Google Maps → right click → copy coordinates.
      </p>
    </div>
  );
}