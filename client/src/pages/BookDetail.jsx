import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setBook(null);

    fetch(`${API}/books/${id}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) throw new Error('This book does not exist.');
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  return (
    <>
      <Link to="/" className="back">← Back to catalog</Link>

      {loading && (
        <div className="detail skeleton" aria-busy="true">
          <div className="sk-line sk-short" />
          <div className="sk-line sk-title" />
          <div className="sk-line" />
          <div className="sk-line" />
        </div>
      )}

      {error && (
        <div className="state error" role="alert">
          <h2>Couldn't load this book</h2>
          <p>{error}</p>
        </div>
      )}

      {book && (
        <article className="detail">
          <span className="badge">{book.genre?.name}</span>
          <h1>{book.title}</h1>
          <p className="muted">by {book.author}</p>
          {book.description && <p>{book.description}</p>}
          <dl>
            <dt>ISBN</dt>
            <dd>{book.isbn}</dd>
            {book.publishedYear && (
              <>
                <dt>Published</dt>
                <dd>{book.publishedYear}</dd>
              </>
            )}
            <dt>Copies</dt>
            <dd>{book.totalCopies}</dd>
          </dl>
        </article>
      )}
    </>
  );
}