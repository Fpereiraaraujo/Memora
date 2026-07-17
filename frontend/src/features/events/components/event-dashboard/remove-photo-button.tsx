import { useState } from 'react';

interface RemovePhotoButtonProps {
  photoId: string;
  onRemove: (photoId: string) => Promise<void>;
  onRemoved?: () => void;
  compact?: boolean;
}

export function RemovePhotoButton({
  photoId,
  onRemove,
  onRemoved,
  compact = false,
}: RemovePhotoButtonProps) {
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    const confirmed = window.confirm(
      'Excluir esta foto? Ela será removida do seu álbum e também da galeria pública do evento.',
    );

    if (!confirmed) {
      return;
    }

    setRemoving(true);

    try {
      await onRemove(photoId);
      onRemoved?.();
    } catch (exception) {
      window.alert(
        exception instanceof Error
          ? exception.message
          : 'Não foi possível excluir a foto agora. Tente novamente.',
      );
    } finally {
      setRemoving(false);
    }
  }

  return (
    <button
      type="button"
      disabled={removing}
      onClick={(event) => {
        event.stopPropagation();
        void handleRemove();
      }}
      className={[
        'inline-flex items-center justify-center rounded-[12px] border border-rose-200 bg-rose-50 text-xs font-bold text-rose-600 transition hover:-translate-y-0.5 hover:bg-rose-100 disabled:cursor-wait disabled:opacity-60',
        compact ? 'h-10 px-3' : 'h-11 px-4',
      ].join(' ')}
    >
      {removing ? 'Excluindo...' : 'Excluir'}
    </button>
  );
}
