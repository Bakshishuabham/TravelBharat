import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="p-2 rounded-lg bg-white/10 hover:bg-saffron-500 disabled:opacity-30
                   disabled:cursor-not-allowed transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={i} className="text-white/40 px-2">...</span>
        ) : (
          <button key={p} onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-lg font-medium transition-all ${
              p === page
                ? 'bg-saffron-500 text-white shadow-lg shadow-saffron-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
        className="p-2 rounded-lg bg-white/10 hover:bg-saffron-500 disabled:opacity-30
                   disabled:cursor-not-allowed transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
