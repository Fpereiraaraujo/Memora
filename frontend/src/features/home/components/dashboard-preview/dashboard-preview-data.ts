import { marketingWeddingAssets } from '@/lib/public-assets';

export type DashboardPreviewTab =
  | 'overview'
  | 'gallery'
  | 'favorites'
  | 'downloads'
  | 'messages';

export const dashboardPreviewPhotos = [...marketingWeddingAssets.gallery].slice(0, 5);

export const dashboardPreviewTabs: Array<{
  id: DashboardPreviewTab;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    id: 'overview',
    label: 'Visão geral',
    shortLabel: 'Resumo',
    description: 'Acompanhe o movimento do evento em tempo real.',
  },
  {
    id: 'gallery',
    label: 'Galeria',
    shortLabel: 'Fotos',
    description: 'Veja as fotos mais recentes enviadas pelos convidados.',
  },
  {
    id: 'favorites',
    label: 'Favoritos',
    shortLabel: 'Curtidas',
    description: 'Separe as melhores lembranças em poucos cliques.',
  },
  {
    id: 'downloads',
    label: 'Downloads',
    shortLabel: 'Baixar',
    description: 'Organize os arquivos que os anfitriões vão guardar depois.',
  },
  {
    id: 'messages',
    label: 'Recados',
    shortLabel: 'Recados',
    description: 'Mensagens privadas deixadas pelos convidados.',
  },
];

export const dashboardPreviewStats: Record<
  DashboardPreviewTab,
  Array<{ label: string; value: string; icon: string }>
> = {
  overview: [
    { label: 'Fotos enviadas', value: '1.248', icon: '◫' },
    { label: 'Convidados', value: '356', icon: '△' },
    { label: 'Favoritas', value: '142', icon: '♡' },
    { label: 'Recados', value: '18', icon: '✉' },
  ],
  gallery: [
    { label: 'Hoje', value: '324', icon: '◫' },
    { label: 'Última hora', value: '48', icon: '◎' },
    { label: 'Aprovadas', value: '1.106', icon: '✓' },
    { label: 'Ocultas', value: '12', icon: '—' },
  ],
  favorites: [
    { label: 'Favoritas', value: '142', icon: '♡' },
    { label: 'Top 10', value: '10', icon: '★' },
    { label: 'Para álbum', value: '64', icon: '◇' },
    { label: 'Novas', value: '9', icon: '+' },
  ],
  downloads: [
    { label: 'Disponíveis', value: '1.248', icon: '↓' },
    { label: 'Alta qualidade', value: '100%', icon: '✓' },
    { label: 'Favoritas', value: '142', icon: '♡' },
    { label: 'Pacotes', value: '3', icon: '◱' },
  ],
  messages: [
    { label: 'Recados', value: '18', icon: '✉' },
    { label: 'Com foto', value: '14', icon: '◫' },
    { label: 'Hoje', value: '6', icon: '◎' },
    { label: 'Lidos', value: '12', icon: '✓' },
  ],
};
