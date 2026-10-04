"use client";

type DeleteMessageButtonProps = {
  id: string;
};

export default function DeleteMessageButton({
  id,
}: DeleteMessageButtonProps) {
  async function handleDelete() {
    const confirmed = window.confirm(
      "¿Seguro que querés eliminar este mensaje? Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    const response = await fetch(`/api/admin/mensajes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("No se pudo eliminar el mensaje.");
      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-sm font-medium text-red-400 transition hover:text-red-300"
    >
     🗑️
    </button>
  );
}