import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  return (
    <Link className="card" to={`/books/${book.id}`}>
      <span className="badge">{book.genre?.name}</span>
      <h3>{book.title}</h3>
      <p className="muted">by {book.author}</p>
      {book.publishedYear && <p className="muted small">{book.publishedYear}</p>}
    </Link>
  );
}