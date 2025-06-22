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

interface SearchResponse {
  results: SearchResult[];
  query: string;
  totalResults: string;
  time: string;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '紫陽花 時期';

  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);

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

        const data: SearchResponse = await response.json();
        setSearchData(data);
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
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
          <SearchBox variant="header" initialValue={query} />
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">検索中...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-600">エラー: {error}</div>
          </div>
        ) : searchData ? (
          <>
            <div className="text-sm text-gray-600 mb-6">
              {searchData.totalResults}（{searchData.time}）
            </div>

            <div className="max-w-2xl">
              {searchData.results.map((result, index) => (
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
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">検索結果が見つかりませんでした</div>
          </div>
        )}
      </main>
    </div>
  );
}
