const Pagination = ({ page, setPage, totalPages }) => {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
      <button
        className="btn btn-sm btn-outline"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => setPage(n)}
          className={`btn btn-sm ${n === page ? 'bg-teal-700 text-white hover:bg-teal-800 border-teal-700' : 'btn-outline'}`}
        >
          {n}
        </button>
      ))}
      <button
        className="btn btn-sm btn-outline"
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
