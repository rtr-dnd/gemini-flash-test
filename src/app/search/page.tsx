'use client';

import {useSearchParams} from 'next/navigation';
import Link from 'next/link';

import GoogLMLogo from '@/components/GoogLMLogo';
import SearchBox from '@/components/SearchBox';
import SearchResultItem from '@/components/SearchResultItem';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '紫陽花 時期';

  const searchResults = [
    {
      favicon: '/api/placeholder/16/16',
      url: 'https://weathernews.jp › ajisai',
      title: 'あじさい見頃・人気の名所情報【2025】',
      description:
        '今週末もまた日本へ一東日本の各地であじさいが見頃。梅雨を彩る紫陽花花を楽しめうです。今週は21日(土)頃まで、東日本を中心に白目しがにくといこうが美く、気温も高めです。...',
      image: '/api/placeholder/128/96',
      hasImage: true,
    },
    {
      favicon: '/api/placeholder/16/16',
      url: 'https://www.trip-kamakura.com › ...',
      title: '（6月19日更新）あじさいの開花状況について',
      description:
        '3 days ago — 例年の鎌倉市内のあじさい。5月下旬からヤマアジサイやガクアジサイが見頃め、その後6月上旬～下旬にかけて西洋アジサイが見ごろになります。...',
      hasImage: false,
    },
    {
      favicon: '/api/placeholder/16/16',
      url: 'https://travel.rakuten.co.jp › ajisai',
      title: '全国のあじさいの名所43選！2025年あじさい祭り開催',
      description:
        '紫陽花の花色は土の酸度によって変化し、アルカリ性では、酸性で青い色になります。5～7月に開花し6月上旬～7月上旬頃に見頃を迎えるため、ちょうど梅雨の時期と風情になるので...',
      image: '/api/placeholder/128/96',
      hasImage: true,
    },
    {
      favicon: '/api/placeholder/16/16',
      url: 'https://enokama.jp › 特集',
      title: '【2025年最新】鎌倉・江ノ島あじさいの名所10選！見頃や開花...',
      description:
        '本格的な夏を前に、江ノ島・鎌倉はあじさいの季節を迎えました。人気のあじさい寺から穴場や神社まで10のスポットをご紹介しまう。2025年6月9日に撮影した写真を更新...',
      image: '/api/placeholder/128/96',
      hasImage: true,
    },
    {
      favicon: '/api/placeholder/16/16',
      url: 'https://tabico.jp › ... › 配信一覧',
      title: '【2025年】あじさいの見頃はいつ？開花予想日や名言・旅色',
      description:
        'Apr 30, 2025 — 2025年における全国のあじさい開花予想日は、北海道が7月上旬から下旬頃、本州の東北地方で6月下旬、関東から九州にかけて6月初旬から中旬にかけて...',
      hasImage: false,
    },
  ];

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
        <div className="text-sm text-gray-600 mb-6">
          約 1,250,000 件（0.42 秒）
        </div>

        <div className="max-w-2xl">
          {searchResults.map((result, index) => (
            <SearchResultItem
              key={index}
              {...result}
              onClick={() => {
                // 実際のリンクに遷移する処理
                console.log('Clicked on:', result.title);
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
