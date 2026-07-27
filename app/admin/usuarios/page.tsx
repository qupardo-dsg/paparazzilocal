"use client";

import { useState, useEffect } from "react";
import Topbar from "@/components/admin/topbar";

const ROLES = ["admin", "driver", "reponedor"] as const;

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "reponedor" });
  const [error, setError] = useState("");

  const fetchUsers = () => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openModal = () => {
    setForm({ name: "", email: "", password: "", role: "reponedor" });
    setError("");
    setModal(true);
  };

  const createUser = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || data.errors?.[0]?.message || "Error al crear");
      return;
    }
    setModal(false);
    fetchUsers();
  };

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-purple-100 text-purple-800",
      driver: "bg-blue-100 text-blue-800",
      reponedor: "bg-green-100 text-green-800",
    };
    return colors[role] || "bg-slate-100 text-slate-800";
  };

  if (loading) return <Topbar title="Usuarios" />;

  return (
    <>
      <Topbar title="Usuarios" />
      <div className="p-6">
        <div className="bg-white border border-[var(--color-border-soft)] rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--color-border-soft)]">
            <h2 className="text-lg font-semibold">Usuarios</h2>
            <button onClick={openModal} className="bg-[var(--color-accent)] text-[var(--color-accent-on)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors">
              + Agregar usuario
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Nombre</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Email</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Rol</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Creado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--color-surface)]">
                  <td className="px-5 py-3 text-sm font-semibold">{u.name}</td>
                  <td className="px-5 py-3 text-sm text-[var(--color-muted)]">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleBadge(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-[var(--color-meta)]">{new Date(u.createdAt).toLocaleDateString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setModal(false)}>
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-[90%] p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold mb-5">Agregar usuario</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Nombre</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)]" placeholder="Nombre completo" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)]" placeholder="correo@ejemplo.com" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Contraseña (mín. 8 caracteres)</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)]" placeholder="********" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Rol</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)]">
                    {ROLES.map((r) => <option key={r} value={r}>{r === "admin" ? "Administrador" : r === "driver" ? "Driver (repartidor)" : "Reponedor (inventario)"}</option>)}
                  </select>
                </div>
                {error && <p className="text-sm text-[var(--color-danger)] bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}
              </div>
              <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-[var(--color-border-soft)]">
                <button onClick={() => setModal(false)} className="bg-[var(--color-surface-elevated)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-border-soft)]">Cancelar</button>
                <button onClick={createUser} className="bg-[var(--color-accent)] text-[var(--color-accent-on)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-accent-hover)]">Crear</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
