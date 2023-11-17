import { Suspense, useState, useEffect, useRef, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function Project01() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const inpRef = useRef(null);

  useEffect(() => {
    inpRef.current.focus();
  }, []);

  return (
    <div>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} ref={inpRef}  style={{caretColor: 'red'}} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </div>
  );
}