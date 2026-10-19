
type SocialLink = {
  id: string;
  ministry_id: string;
  platform: string;
  label: string | null;
  url: string;
  sort_order: number;
};

type SocialLinkAction = (
  formData: FormData
) => Promise<void>;

type Props = {
  ministryId: string;
  initialLinks: SocialLink[];
  addAction: SocialLinkAction;
  updateAction: SocialLinkAction;
  deleteAction: SocialLinkAction;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50";

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "website", label: "Sitio web" },
  { value: "other", label: "Otro" },
];

export default function MinistrySocialLinksManager({
  ministryId,
  initialLinks,
  addAction,
  updateAction,
  deleteAction,
}: Props) {
  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
          Comunidad digital
        </p>

        <h2 className="mt-2 text-xl font-semibold">
          Redes sociales
        </h2>

        <p className="mt-2 text-sm text-neutral-400">
          Administrá los enlaces públicos de este ministerio.
        </p>
      </div>

      <form
        action={addAction}
        className="mb-8 rounded-2xl border border-white/10 bg-neutral-900/60 p-5"
      >
        <input
          type="hidden"
          name="ministry_id"
          value={ministryId}
        />

        <h3 className="font-semibold">
          Agregar enlace
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Plataforma
            </label>

            <select
              name="platform"
              defaultValue="instagram"
              required
              className={inputClass}
            >
              {platforms.map((platform) => (
                <option
                  key={platform.value}
                  value={platform.value}
                  className="bg-neutral-900"
                >
                  {platform.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Nombre visible (opcional)
            </label>

            <input
              name="label"
              placeholder="Ej: Instagram de Jóvenes"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-neutral-300">
              URL del enlace
            </label>

            <input
              name="url"
              type="url"
              required
              placeholder="https://..."
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
        >
          + Agregar enlace
        </button>
      </form>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">
          Enlaces cargados
        </h3>

        <span className="text-xs text-neutral-500">
          {initialLinks.length} enlaces
        </span>
      </div>

      {initialLinks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
          <p className="text-sm text-neutral-400">
            Todavía no hay redes sociales cargadas.
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            Usá el formulario anterior para agregar la primera.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {initialLinks.map((link) => (
            <div
              key={link.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <form action={updateAction}>
                <input
                  type="hidden"
                  name="social_link_id"
                  value={link.id}
                />

                <input
                  type="hidden"
                  name="ministry_id"
                  value={ministryId}
                />

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-amber-400">
                    {platforms.find(
                      (p) => p.value === link.platform
                    )?.label ?? link.platform}
                  </span>

                  <span className="text-xs text-neutral-500">
                    ID: {link.id.slice(0, 8)}
                  </span>
                </div>

                <label className="mb-2 block text-sm text-neutral-300">
                  Plataforma
                </label>

                <select
                  name="platform"
                  defaultValue={link.platform}
                  required
                  className={inputClass}
                >
                  {platforms.map((platform) => (
                    <option
                      key={platform.value}
                      value={platform.value}
                      className="bg-neutral-900"
                    >
                      {platform.label}
                    </option>
                  ))}
                </select>

                <label className="mb-2 mt-4 block text-sm text-neutral-300">
                  Nombre visible
                </label>

                <input
                  name="label"
                  defaultValue={link.label ?? ""}
                  placeholder="Ej: Seguinos en Instagram"
                  className={inputClass}
                />

                <label className="mb-2 mt-4 block text-sm text-neutral-300">
                  URL
                </label>

                <input
                  name="url"
                  type="url"
                  required
                  defaultValue={link.url}
                  className={inputClass}
                />

                <label className="mb-2 mt-4 block text-sm text-neutral-300">
                  Orden de aparición
                </label>

                <input
                  name="sort_order"
                  type="number"
                  min="0"
                  required
                  defaultValue={link.sort_order}
                  className={inputClass}
                />

                <button
                  type="submit"
                  className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
                >
                  Guardar cambios
                </button>
              </form>

              <form action={deleteAction} className="mt-3">
                <input
                  type="hidden"
                  name="social_link_id"
                  value={link.id}
                />

                <input
                  type="hidden"
                  name="ministry_id"
                  value={ministryId}
                />

                <button
                  type="submit"
                  className="rounded-xl border border-red-400/20 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-400/10"
                >
                  Eliminar enlace
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
