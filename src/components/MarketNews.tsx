'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { ExternalLink, Newspaper } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export default function MarketNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news');
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loading size="md" />
          </div>
        ) : news.length > 0 ? (
          <div className="space-y-4">
            {news.map((item: NewsItem, index: number) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200 hover:border-orange-300 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 group-hover:text-orange-600 mb-2 line-clamp-2">
                      {item.title}
                    </h4>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                        {item.source}
                      </Badge>
                      <span className="text-slate-500 flex items-center gap-1">
                        {new Date(item.pubDate).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-orange-500 shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Newspaper className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600">
              Nenhuma notícia disponível no momento
            </p>
          </div>
        )}
   
    </>
  );
}

