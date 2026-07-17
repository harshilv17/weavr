"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueFieldProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
  addLabel?: string;
}

function isPlainObject(value: unknown): value is Record<string, string> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function toPairs(value: Record<string, string>): KeyValuePair[] {
  const entries = isPlainObject(value) ? Object.entries(value) : [];
  return entries.length > 0
    ? entries.map(([key, val]) => ({ key, value: val }))
    : [{ key: "", value: "" }];
}

function toRecord(pairs: KeyValuePair[]): Record<string, string> {
  const record: Record<string, string> = {};
  for (const pair of pairs) {
    if (pair.key.trim()) record[pair.key] = pair.value;
  }
  return record;
}

export default function KeyValueField({
  value,
  onChange,
  disabled,
  addLabel = "Add row",
}: KeyValueFieldProps) {
  const [pairs, setPairs] = useState<KeyValuePair[]>(() => toPairs(value));
  const [prevValue, setPrevValue] = useState(value);

  // Re-sync from props only when the incoming value doesn't match what we'd
  // produce from current local state — avoids clobbering in-progress blank
  // rows/keys on every parent re-render while still picking up external resets.
  // Adjusted directly during render (rather than in an effect) to avoid an
  // extra post-render commit; see https://react.dev/learn/you-might-not-need-an-effect
  if (value !== prevValue) {
    const incoming = JSON.stringify(isPlainObject(value) ? value : {});
    const current = JSON.stringify(toRecord(pairs));
    setPrevValue(value);
    if (incoming !== current) {
      setPairs(toPairs(value));
    }
  }

  function commit(next: KeyValuePair[]) {
    setPairs(next);
    onChange(toRecord(next));
  }

  function updatePair(index: number, patch: Partial<KeyValuePair>) {
    commit(pairs.map((pair, i) => (i === index ? { ...pair, ...patch } : pair)));
  }

  function addPair() {
    commit([...pairs, { key: "", value: "" }]);
  }

  function removePair(index: number) {
    const next = pairs.filter((_, i) => i !== index);
    commit(next.length > 0 ? next : [{ key: "", value: "" }]);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {pairs.map((pair, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <Input
            value={pair.key}
            placeholder="Key"
            onChange={(e) => updatePair(index, { key: e.target.value })}
            disabled={disabled}
            className="border-white/8 bg-white/2 text-[13px] text-[#f0eee9] placeholder:text-white/25"
          />
          <Input
            value={pair.value}
            placeholder="Value"
            onChange={(e) => updatePair(index, { value: e.target.value })}
            disabled={disabled}
            className="border-white/8 bg-white/2 text-[13px] text-[#f0eee9] placeholder:text-white/25"
          />
          <button
            type="button"
            onClick={() => removePair(index)}
            disabled={disabled}
            className="flex shrink-0 items-center justify-center rounded p-1.5 text-white/30 transition-colors hover:bg-white/6 hover:text-white/70"
          >
            <X size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addPair}
        disabled={disabled}
        className="flex items-center gap-1 self-start rounded-md px-1.5 py-1 text-[12px] text-white/40 transition-colors hover:bg-white/6 hover:text-white/70"
      >
        <Plus size={12} />
        {addLabel}
      </button>
    </div>
  );
}
