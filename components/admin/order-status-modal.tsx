"use client";

import { useState } from "react";
import { Order, STATUS_NEXT } from "@/types";

type Props = {
  order: Order;
  onClose: () => void;
  onConfirm: (id: string, note?: string) => void;
};

export default function OrderStatusModal({ order, onClose, onConfirm }: Props) {
  const [note, setNote] = useState("");
  const nextStatus = STATUS_NEXT[order.status];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-[420px] w-[90%] p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-5">Actualizar estado del pedido</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Pedido</label>
            <input
              type="text"
              value={order.id}
              disabled
              className="w-full border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none bg-[var(--color-surface-warm)] text-[var(--color-muted)] font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold block mb-1">Estado actual</label>
              <input
                type="text"
                value={order.status}
                disabled
                className="w-full border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none bg-[var(--color-surface-warm)] text-[var(--color-muted)] text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Nuevo estado</label>
              <input
                type="text"
                value={nextStatus}
                disabled
                className="w-full border border-[var(--color-accent)] rounded-md px-3 py-2 outline-none bg-amber-50 text-[var(--color-fg)] text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">
              Nota <span className="text-[var(--color-muted)] font-normal">(opcional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: Enviado por Starken, tracking #12345..."
              rows={2}
              className="w-full border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)] resize-y min-h-[56px] text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-[var(--color-border-soft)]">
          <button
            onClick={onClose}
            className="bg-[var(--color-surface-elevated)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-border-soft)] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(order.id, note.trim() || undefined)}
            className="bg-[var(--color-accent)] text-[var(--color-accent-on)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}
