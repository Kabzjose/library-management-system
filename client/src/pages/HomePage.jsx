import { useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import GenreFilter from '../components/GenreFilter.jsx';
import BookGrid from '../components/BookGrid.jsx';

export default function HomePage() {
  // Shared filter state lives here so the controls and the grid stay in sync
  const [search, setSearch] = useState('');
  const [genreId, setGenreId] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [page, setPage] = useState(1);

  // Any filter change sends the user back to page 1
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };
  const handleGenre = (value) => {
    setGenreId(value);
    setPage(1);
  };
  const handleSort = (value) => {
    setSortBy(value);
    setPage(1);
  };

  return (
    <>
      <h1>Browse books</h1>
      <div className="controls">
        <SearchBar onSearch={handleSearch} />
        <GenreFilter value={genreId} onChange={handleGenre} />
        <label className="field">
          <span>Sort by</span>
          <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
        </label>
      </div>
      <BookGrid
        genreId={genreId}
        search={search}
        sortBy={sortBy}
        page={page}
        onPageChange={setPage}
      />
    </>
  );
}