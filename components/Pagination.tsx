interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1 text-[10px] text-slate-500">
      <PagerButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </PagerButton>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`${page}-${index}`} className="px-2 py-1">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`rounded border px-2 py-1 ${
              page === currentPage
                ? 'border-[#4a7ee9] bg-[#4a7ee9] text-white'
                : 'border-transparent bg-transparent hover:border-slate-200'
            }`}
            onClick={() => onPageChange(page)}
            type="button"
          >
            {String(page).padStart(2, '0')}
          </button>
        ),
      )}

      <PagerButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </PagerButton>
    </nav>
  );
}

function PagerButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded border px-2 py-1 ${
        disabled
          ? 'cursor-not-allowed border-slate-200 text-slate-300'
          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const visiblePages: Array<number | '...'> = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  if (start > 1) {
    visiblePages.push(1);
  }

  if (start > 2) {
    visiblePages.push('...');
  }

  for (let page = start; page <= end; page += 1) {
    visiblePages.push(page);
  }

  if (end < totalPages - 1) {
    visiblePages.push('...');
  }

  if (end < totalPages) {
    visiblePages.push(totalPages);
  }

  return visiblePages;
}
