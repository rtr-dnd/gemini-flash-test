interface SearchResultItemProps {
  favicon?: string;
  url: string;
  title: string;
  description: string;
  image?: string;
  hasImage?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function SearchResultItem({
  favicon,
  url,
  title,
  description,
  image,
  hasImage = false,
  className = '',
  onClick,
}: SearchResultItemProps) {
  const defaultFavicon = '/api/placeholder/16/16';
  const defaultImage = '/api/placeholder/128/96';

  // ドメインから最初の文字を取得する関数
  const getDomainLetter = (url: string): string => {
    try {
      // URLからドメイン部分を抽出
      const domain = url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]
        .split(' ')[0];
      return domain.charAt(0).toUpperCase();
    } catch {
      return 'W'; // フォールバック
    }
  };

  // ドメイン文字に基づいた色を生成する関数
  const getDomainColor = (letter: string): string => {
    const colors = [
      '#3B82F6', // blue
      '#EF4444', // red
      '#10B981', // green
      '#F59E0B', // yellow
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#6B7280', // gray
      '#14B8A6', // teal
      '#F97316', // orange
      '#84CC16', // lime
    ];
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const domainLetter = getDomainLetter(url);
  const domainColor = getDomainColor(domainLetter);

  return (
    <div className={`mb-8 max-w-2xl ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {/* URL and favicon */}
          <div className="flex items-center mb-1 text-sm">
            {favicon === 'domain-letter' ? (
              <div
                className="w-4 h-4 mr-2 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                style={{backgroundColor: domainColor}}
              >
                {domainLetter}
              </div>
            ) : (
              <img
                src={favicon || defaultFavicon}
                alt=""
                className="w-4 h-4 mr-2 rounded-sm"
              />
            )}
            <span className="text-gray-700">{url}</span>
            <button className="ml-2 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>

          {/* Title */}
          <h3
            className="text-xl text-blue-800 hover:underline cursor-pointer mb-2 font-normal"
            onClick={onClick}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-6">{description}</p>
        </div>

        {/* Optional image */}
        {hasImage && (
          <div className="ml-4 flex-shrink-0">
            <img
              src={image || defaultImage}
              alt=""
              className="w-32 h-24 object-cover rounded hover:opacity-90 transition-opacity cursor-pointer"
              onClick={onClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
