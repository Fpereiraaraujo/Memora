interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#ead6cb] bg-white px-4 text-sm font-bold text-[#201914] transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#fff8f3]"
      >
        Anterior
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={[
            'grid size-11 place-items-center rounded-[14px] text-sm font-bold transition',
            page === currentPage
              ? 'bg-[#ef7885] text-white shadow-[0_14px_34px_rgba(239,120,133,0.22)]'
              : 'border border-[#ead6cb] bg-white text-[#201914] hover:bg-[#fff8f3]',
          ].join(' ')}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#ead6cb] bg-white px-4 text-sm font-bold text-[#201914] transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#fff8f3]"
      >
        Próxima
      </button>
    </div>
  );
}
