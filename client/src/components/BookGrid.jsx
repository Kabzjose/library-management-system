import { useCallback, useEffect, useState } from 'react';
import BookCard from './BookCard.jsx';

const API = import.meta.env.VITE_API_URL;
const LIMIT = 8;

function SkeletonCard() {
  return (
    <div className="card skeleton" aria-hidden="true">
      <div className="sk-line sk-short" />
      <div className="sk-line sk-title" />
      <div className="sk-line" />
    </div>
  );
}

export default function BookGrid({ genreId, search, sortBy, page, onPageChange }) {
  const [books, setBooks] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page, limit: LIMIT, sortBy });
    if (genreId) params.set('genreId', genreId);
    if (search) params.set('search', search);

    setLoading(true);
    setError(null);

    fetch(`${API}/books?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setBooks(json.data);
        setMeta(json.meta);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return; // a newer request replaced this one
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });

    return () => controller.abort();
  }, [genreId, search, sortBy, page, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  if (loading) {
    return (
      <div className="grid" aria-busy="true" aria-label="Loading books">
        {Array.from({ length: LIMIT }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state error" role="alert">
        <h2>Couldn't load books</h2>
        <p>{error}</p>
        <button onClick={retry}>Try again</button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="state">
        <h2>No books found</h2>
        <p>Try a different search term or genre.</p>
      </div>
    );
  }

  return (
    <>
      <p className="muted small">{meta.total} book{meta.total === 1 ? '' : 's'}</p>
      <div className="grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {meta.totalPages > 1 && (
        <nav className="pager" aria-label="Pagination">
          <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            ← Previous
          </button>
          <span>
            Page {page} of {meta.totalPages}
          </span>
          <button disabled={page >= meta.totalPages} onClick={() => onPageChange(page + 1)}>
            Next →
          </button>
        </nav>
      )}
    </>
  );
}