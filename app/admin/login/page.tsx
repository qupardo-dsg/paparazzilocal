"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "Credenciales incorrectas");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-warm)]">
      <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-border-soft)] rounded-xl shadow-sm p-8 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-xl font-bold">Admin login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-md px-4 py-3 outline-none focus:border-[var(--color-accent)]"
          autoFocus
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-md px-4 py-3 outline-none focus:border-[var(--color-accent)]"
        />
        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
        <button type="submit" className="bg-[var(--color-accent)] text-[var(--color-accent-on)] rounded-full px-6 py-3 font-semibold hover:bg-[var(--color-accent-hover)] transition-colors">
          Ingresar
        </button>
        <Link href="/" className="text-sm text-center text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
          ← Volver a la tienda
        </Link>
      </form>
    </div>
  );
}
