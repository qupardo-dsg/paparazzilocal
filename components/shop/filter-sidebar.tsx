"use client";

import { useState } from "react";

type FilterGroup = {
  id: string;
  label: string;
  options: { value: string; label: string; count: number }[];
};

type Props = {
  groups: FilterGroup[];
  selected: Record<string, string[]>;
  onChange: (groupId: string, value: string) => void;
};

export default function FilterSidebar({ groups, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 text-sm border border-[var(--color-border-soft)] rounded-md px-3 py-2 hover:bg-[var(--color-surface-elevated)] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="6" y1="18" x2="18" y2="18" />
        </svg>
        Filtro
      </button>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-soft)]">
              <span className="text-lg font-semibold">Filtros</span>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-[var(--color-surface)] rounded">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {groups.map((g) => (
                <FilterGroupPanel key={g.id} group={g} selected={selected[g.id] || []} collapsed={collapsed[g.id]} onToggle={() => toggleGroup(g.id)} onChange={(v) => onChange(g.id, v)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="sticky top-32 space-y-px">
          {groups.map((g) => (
            <FilterGroupPanel key={g.id} group={g} selected={selected[g.id] || []} collapsed={collapsed[g.id]} onToggle={() => toggleGroup(g.id)} onChange={(v) => onChange(g.id, v)} />
          ))}
        </div>
      </aside>
    </>
  );
}

function FilterGroupPanel({
  group,
  selected,
  collapsed,
  onToggle,
  onChange,
}: {
  group: FilterGroup;
  selected: string[];
  collapsed: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className="border-b border-[var(--color-border-soft)] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-0 py-3 text-sm font-semibold hover:text-[var(--color-fg)] transition-colors"
      >
        {group.label}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform duration-200 ${collapsed ? "-rotate-90" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {!collapsed && (
        <div className="pb-3 space-y-2">
          {group.options.map((opt) => (
            <label key={opt.value} className="flex items-center justify-between text-sm cursor-pointer py-1 hover:text-[var(--color-fg)] transition-colors">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => onChange(opt.value)}
                  className="accent-[var(--color-accent)]"
                />
                {opt.label}
              </span>
              <span className="text-xs text-[var(--color-muted)]">({opt.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
