import { dashboardPreviewPhotos, DashboardPreviewTab } from "./dashboard-preview-data";

function ImageTile({ photo, index }: { photo: string; index: number }) {
  return (
    <div className="group relative h-24 overflow-hidden rounded-[1rem] bg-[linear-gradient(135deg,#fff1f2,#f4d7c4_48%,#d8a84f)] shadow-[0_10px_22px_rgba(96,60,36,0.06)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_18px_38px_rgba(96,60,36,0.13)] active:scale-[0.99]">
      <img
        src={photo}
        alt={`Momento do casamento ${index + 1}`}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(34,20,12,0.22)_100%)]" />

      <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-white/86 text-[10px] text-[#ef7885] shadow transition group-hover:scale-110">
        ♡
      </span>
    </div>
  );
}

export function DashboardPreviewContent({
  selectedTab,
}: {
  selectedTab: DashboardPreviewTab;
}) {
  if (selectedTab === 'messages') {
    return (
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          ['Mariana Silva', 'Que momento lindo. Vocês merecem toda felicidade!'],
          ['Carlos Eduardo', 'A cerimônia foi emocionante do começo ao fim.'],
          ['Juliana Mendes', 'Já enviei minhas fotos preferidas para vocês guardarem.'],
        ].map(([name, message]) => (
          <div
            key={name}
            className="rounded-[1rem] bg-white p-4 shadow-[0_10px_24px_rgba(96,60,36,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(96,60,36,0.09)]"
          >
            <p className="text-sm font-black text-ink-900">
              {name}
            </p>

            <p className="mt-2 text-xs leading-5 text-ink-800/62">
              {message}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (selectedTab === 'downloads') {
    return (
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          ['Todas as fotos', '1.248 arquivos prontos para baixar'],
          ['Favoritas', '142 imagens separadas pelos noivos'],
          ['Recados', '18 mensagens exportáveis para guardar'],
        ].map(([title, description]) => (
          <div
            key={title}
            className="rounded-[1rem] bg-white p-4 shadow-[0_10px_24px_rgba(96,60,36,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(96,60,36,0.09)]"
          >
            <p className="text-sm font-black text-ink-900">
              {title}
            </p>

            <p className="mt-2 text-xs leading-5 text-ink-800/62">
              {description}
            </p>

            <button
              type="button"
              className="mt-4 rounded-full bg-[#fff4ee] px-4 py-2 text-xs font-bold text-ink-800/72 transition hover:bg-[#ffe9e2]"
            >
              Preparar download
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
      {dashboardPreviewPhotos.map((photo, index) => (
        <ImageTile key={`${selectedTab}-${photo}`} photo={photo} index={index} />
      ))}
    </div>
  );
}