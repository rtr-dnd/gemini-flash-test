'use client';

import {useSearchParams} from 'next/navigation';
import {useState, useEffect} from 'react';
import Link from 'next/link';

import GoogLMLogo from '@/components/GoogLMLogo';
import SearchBox from '@/components/SearchBox';
import SearchResultItem from '@/components/SearchResultItem';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  hasImage: boolean;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '紫陽花 時期';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<string>('');
  const [searchTime, setSearchTime] = useState<string>('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);
      setResults([]);
      setTotalResults('');
      setSearchTime('');

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({query}),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        const decoder = new TextDecoder();
        let buffer = '';

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const {done, value} = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, {stream: true});
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              try {
                const data = JSON.parse(jsonStr);

                if (data.isComplete === false) {
                  // 検索開始のマーカー
                  continue;
                } else if (data.isComplete === true) {
                  // 検索完了のマーカー
                  setTotalResults(data.totalResults || '');
                  setSearchTime(data.time || '');
                  setLoading(false);
                } else if (data.title && data.url && data.description) {
                  // 検索結果
                  setResults(prev => [...prev, data]);
                }
              } catch (parseError) {
                console.error('Failed to parse streaming JSON:', parseError);
              }
            }
          }
        }
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    void fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="flex items-center px-6 py-3 max-w-none">
          <Link href="/" className="flex items-center cursor-pointer">
            <GoogLMLogo size="small" className="mr-8" />
          </Link>
          <div className="flex-1">
            <SearchBox
              variant="header"
              initialValue={query}
              className="max-w-[500px]"
            />
          </div>
          <div className="flex items-center ml-8 space-x-4">
            <button className="w-6 h-6 grid grid-cols-3 gap-0.5">
              {Array.from({length: 9}).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-gray-600 rounded-full" />
              ))}
            </button>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              R
            </div>
          </div>
        </div>

        {/* Search tabs */}
        <div className="px-6">
          <nav className="flex space-x-8 -mb-px">
            <button className="border-b-2 border-blue-600 text-blue-600 py-3 text-sm font-medium">
              すべて
            </button>
            <button className="text-gray-600 hover:text-gray-900 py-3 text-sm">
              画像
            </button>
            <button className="text-gray-600 hover:text-gray-900 py-3 text-sm">
              ショッピング
            </button>
            <button className="text-gray-600 hover:text-gray-900 py-3 text-sm">
              動画
            </button>
            <button className="text-gray-600 hover:text-gray-900 py-3 text-sm">
              ニュース
            </button>
            <button className="text-gray-600 hover:text-gray-900 py-3 text-sm">
              ショート動画
            </button>
            <button className="text-gray-600 hover:text-gray-900 py-3 text-sm">
              ウェブ
            </button>
            <button className="text-gray-600 hover:text-gray-900 py-3 text-sm flex items-center">
              その他
              <svg
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Search results */}
      <main className="px-6 py-6">
        {error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-600">エラー: {error}</div>
          </div>
        ) : results.length > 0 ? (
          <>
            {totalResults && searchTime && (
              <div className="text-sm text-gray-600 mb-6">
                {totalResults}（{searchTime}）
              </div>
            )}

            <div className="max-w-2xl">
              {results.map((result, index) => (
                <SearchResultItem
                  key={index}
                  favicon="domain-letter"
                  url={result.url}
                  title={result.title}
                  description={result.description}
                  hasImage={false}
                  onClick={() => {
                    console.log('Clicked on:', result.title);
                    // 実際のリンクに遷移する処理
                    window.open(result.url, '_blank');
                  }}
                />
              ))}

              {loading && (
                <div className="flex items-center justify-center py-4">
                  <div className="text-gray-600">結果を読み込み中...</div>
                </div>
              )}
            </div>
          </>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">検索中...</div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">検索結果が見つかりませんでした</div>
          </div>
        )}
      </main>
    </div>
  );
}
