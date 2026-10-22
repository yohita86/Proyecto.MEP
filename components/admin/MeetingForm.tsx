"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Meeting = {
  id?: string;
  name: string;
  day_of_week: number;
  start_time: string;
  end_time: string | null;
  location: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

type MeetingFormProps = {
  meeting?: Meeting;
  mode: "create" | "edit";
};

const days = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
];

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-amber-400";

export default function MeetingForm({ meeting, mode }: MeetingFormProps) {
  const router = useRouter();

  const [name, setName] = useState(meeting?.name ?? "");
  const [dayOfWeek, setDayOfWeek] = useState(
    String(meeting?.day_of_week ?? 6)
  );
  const [startTime, setStartTime] = useState(
    meeting?.start_time?.slice(0, 5) ?? "18:00"
  );
  const [endTime, setEndTime] = useState(
    meeting?.end_time?.slice(0, 5) ?? ""
  );
  const [location, setLocation] = useState(meeting?.location ?? "");
  const [description, setDescription] = useState(
    meeting?.description ?? ""
  );
  const [sortOrder, setSortOrder] = useState(
    String(meeting?.sort_order ?? 0)
  );
  const [isActive, setIsActive] = useState(meeting?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: name.trim(),
      day_of_week: Number(dayOfWeek),
      start_time: startTime,
      end_time: endTime || null,
      location: location.trim() || null,
      description: description.trim() || null,
      sort_order: Number(sortOrder),
      is_active: isActive,
    };

    try {
      const response = await fetch(
        mode === "create"
          ? "/api/admin/reuniones"
          : `/api/admin/reuniones/${meeting?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No pudimos guardar la reunión.");
      }

      router.push("/admin/reuniones");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al guardar la reunión."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm text-neutral-300 sm:col-span-2">
          Nombre de la reunión *
          <input
            className={inputClass}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej.: Reunión General"
            required
            maxLength={120}
          />
        </label>

        <label className="text-sm text-neutral-300">
          Día de la semana *
          <select
            className={inputClass}
            value={dayOfWeek}
            onChange={(event) => setDayOfWeek(event.target.value)}
            required
          >
            {days.map((day) => (
              <option key={day.value} value={day.value} className="bg-neutral-900">
                {day.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-neutral-300">
          Orden de aparición
          <input
            className={inputClass}
            type="number"
            min="0"
            step="1"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            required
          />
          <span className="mt-1 block text-xs text-neutral-500">
            Los números más bajos aparecen primero.
          </span>
        </label>

        <label className="text-sm text-neutral-300">
          Hora de inicio *
          <input
            className={inputClass}
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            required
          />
        </label>

        <label className="text-sm text-neutral-300">
          Hora de finalización
          <input
            className={inputClass}
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
          />
          <span className="mt-1 block text-xs text-neutral-500">
            Dejala vacía si no querés indicar una hora de finalización.
          </span>
        </label>

        <label className="text-sm text-neutral-300 sm:col-span-2">
          Lugar
          <input
            className={inputClass}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Ej.: Bernardo de Irigoyen 1436, Paso del Rey"
            maxLength={200}
          />
        </label>

        <label className="text-sm text-neutral-300 sm:col-span-2">
          Descripción
          <textarea
            className={inputClass}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Información adicional sobre esta reunión..."
            rows={4}
            maxLength={1000}
          />
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-neutral-300 sm:col-span-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-4 w-4 accent-amber-400"
          />
          Reunión activa y visible en la página pública
        </label>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/reuniones")}
          disabled={saving}
          className="rounded-xl border border-white/10 px-5 py-3 text-sm text-neutral-300 transition hover:bg-white/5 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Guardando..."
            : mode === "create"
              ? "Crear reunión"
              : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
