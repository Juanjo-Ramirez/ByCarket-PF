interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > maxPagesToShow - 2) {
        pageNumbers.push("...");
      }

      let start = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2) + 1);
      let end = Math.min(
        totalPages - 1,
        currentPage + Math.floor(maxPagesToShow / 2) - 1
      );

      if (currentPage <= maxPagesToShow - 2) {
        end = maxPagesToShow - 1;
      } else if (currentPage > totalPages - (maxPagesToShow - 2)) {
        start = totalPages - (maxPagesToShow - 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - (maxPagesToShow - 2)) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 py-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full bg-[#0d2e55] text-white hover:bg-principal-blue transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              currentPage === page
                ? "bg-[#facc15] text-[#0d2e55]"
                : "bg-[#0d2e55] text-white hover:bg-principal-blue"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-2 text-white/70 text-sm select-none">
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full bg-[#0d2e55] text-white hover:bg-principal-blue transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}
