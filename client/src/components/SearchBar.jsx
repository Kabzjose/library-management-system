import { useEffect, useState } from 'react';

export default function SearchBar({ onSearch, delay = 400 }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    // Wait until the user stops typing, then notify the parent
    const timer = setTimeout(() => onSearch(value.trim()), delay);
    // Cleanup cancels the pending call if the user types again
    return () => clearTimeout(timer);
  }, [value, delay, onSearch]);

  return (
    <label className="field grow">
      <span>Search</span>
      <input
        type="search"
        placeholder="Title or author…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
}