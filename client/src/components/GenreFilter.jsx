import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL;

export default function GenreFilter({ value, onChange }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API}/genres`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : []))
      .then(setGenres)
      .catch(() => {}); // the filter just stays on "All genres" if this fails
    return () => controller.abort();
  }, []);

  return (
    <label className="field">
      <span>Genre</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All genres</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </label>
  );
}