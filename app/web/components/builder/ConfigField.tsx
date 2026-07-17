"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import KeyValueField from "./KeyValueField";
import type { ConfigField as ConfigFieldDef } from "./nodeConfigSchemas";

interface ConfigFieldProps {
  field: ConfigFieldDef;
  value: unknown;
  onChange: (value: string | Record<string, string>) => void;
  disabled?: boolean;
}

export default function ConfigFieldInput({ field, value, onChange, disabled }: ConfigFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={field.key} className="text-[12px] text-white/60">
        {field.label}
        {field.required && <span className="text-white/30">*</span>}
      </Label>

      {field.type === "keyvalue" ? (
        <KeyValueField
          value={(value as Record<string, string>) ?? {}}
          onChange={onChange}
          disabled={disabled}
          addLabel={field.key === "headers" ? "Add header" : "Add field"}
        />
      ) : field.type === "textarea" ? (
        <Textarea
          id={field.key}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="min-h-20 border-white/8 bg-white/2 text-[13px] text-[#f0eee9] placeholder:text-white/25"
        />
      ) : field.type === "select" ? (
        <select
          id={field.key}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-8 w-full rounded-lg border border-white/8 bg-white/2 px-2.5 text-[13px] text-[#f0eee9] outline-none focus-visible:border-white/20"
        >
          <option value="" disabled>
            Select {field.label.toLowerCase()}
          </option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#111114]">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          id={field.key}
          type={
            field.type === "password" ? "password" : field.type === "number" ? "number" : "text"
          }
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="border-white/8 bg-white/2 text-[13px] text-[#f0eee9] placeholder:text-white/25"
        />
      )}
    </div>
  );
}
