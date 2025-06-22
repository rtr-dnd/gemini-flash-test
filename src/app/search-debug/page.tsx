'use client';

import {useSearchParams} from 'next/navigation';
import {useState, useEffect} from 'react';

export default function SearchDebug() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'デバッグテスト';

  const [streamData, setStreamData] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreamingData = async () => {
      if (!query) return;

      setIsStreaming(true);
      setError(null);
      setStreamData('');

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({query}),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch streaming data');
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        const decoder = new TextDecoder();

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const {done, value} = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, {stream: true});
          setStreamData(prev => prev + chunk);
        }
      } catch (err) {
        console.error('Streaming error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsStreaming(false);
      }
    };

    void fetchStreamingData();
  }, [query]);

  return (
    <div style={{fontFamily: 'monospace', padding: '20px'}}>
      <h1>Search Debug Page</h1>
      <p>
        <strong>Query:</strong> {query}
      </p>
      <p>
        <strong>Status:</strong>{' '}
        {isStreaming ? 'Streaming...' : error ? 'Error' : 'Complete'}
      </p>

      {error && (
        <div style={{color: 'red', marginBottom: '20px'}}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <h2>Raw Streaming Response:</h2>
      <pre
        style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        {streamData || 'Waiting for data...'}
      </pre>

      {isStreaming && (
        <div style={{marginTop: '10px', color: '#666'}}>
          ● Streaming in progress...
        </div>
      )}
    </div>
  );
}
