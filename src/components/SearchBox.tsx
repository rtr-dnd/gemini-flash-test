'use client';

import {useState, useEffect, useRef} from 'react';
import {useRouter} from 'next/navigation';

interface SearchBoxProps {
  variant?: 'homepage' | 'header';
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchBox({
  variant = 'homepage',
  initialValue = '',
  onSearch,
  className = '',
}: SearchBoxProps) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Update search value when initialValue changes
  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  // Fetch suggestions from Gemini API
  const fetchSuggestions = async (query: string): Promise<string[]> => {
    if (!query.trim()) return [];

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query}),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);

      // Fallback to mock suggestions
      const mockData = [
        `${query} とは`,
        `${query} 意味`,
        `${query} 使い方`,
        `${query} 例文`,
      ];
      return mockData.slice(0, 4);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (searchValue.trim() && isInputFocused) {
        const apiSuggestions = await fetchSuggestions(searchValue);
        setSuggestions(apiSuggestions);
        setShowSuggestions(apiSuggestions.length > 0);
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue, isInputFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (searchValue.trim()) {
      setShowSuggestions(suggestions.length > 0);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      setIsInputFocused(false);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 150);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions.length > 0) {
        handleSearch(suggestions[selectedIndex]);
      } else {
        handleSearch(searchValue);
      }
      return;
    }

    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const containerClass =
    variant === 'homepage'
      ? 'w-full max-w-[584px] mx-auto'
      : 'flex-1 max-w-2xl';

  const inputHeight = variant === 'homepage' ? 'h-12' : 'h-auto';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="relative">
        <div
          className={`flex items-center w-full ${inputHeight} px-4 border border-gray-300 rounded-full shadow-sm hover:shadow-md focus-within:shadow-md transition-shadow ${variant === 'header' ? 'py-2' : ''}`}
        >
          <svg
            className="w-4 h-4 mr-3 text-gray-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className={`flex-1 bg-transparent border-none outline-none text-base ${variant === 'homepage' ? 'h-full' : ''}`}
            autoComplete="off"
            maxLength={2048}
          />
          <div className="flex items-center ml-3 space-x-3">
            <button className="w-6 h-6 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
              </svg>
            </button>
            <button className="w-6 h-6 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14.2 11L12 8.8 9.8 11H7l5-5 5 5h-2.8zM7 13h2.8L12 15.2 14.2 13H17l-5 5-5-5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 flex items-center ${
                  index === selectedIndex ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <svg
                  className="w-4 h-4 mr-3 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <span className="text-gray-700">{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search buttons - only show on homepage */}
      {variant === 'homepage' && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => handleSearch(searchValue)}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-100 rounded hover:shadow-sm hover:border-gray-300 focus:outline-none"
          >
            GoogLM 検索
          </button>
          <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-100 rounded hover:shadow-sm hover:border-gray-300 focus:outline-none">
            I&apos;m Feeling Lucky
          </button>
        </div>
      )}
    </div>
  );
}
