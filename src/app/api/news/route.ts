import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export async function GET() {
  try {
    // Feeds específicos de mercado financeiro e investimentos
    const feeds = [
      { url: 'https://www.infomoney.com.br/mercados/feed/', source: 'InfoMoney' },
      { url: 'https://www.infomoney.com.br/onde-investir/feed/', source: 'InfoMoney' },
      { url: 'https://valor.globo.com/financas/rss', source: 'Valor Econômico' },
    ];
    
    // Palavras-chave relevantes para filtrar notícias de investimentos
    const palavrasChaveRelevantes = [
      'bolsa', 'ações', 'ibovespa', 'investimento', 'fundos', 'fii', 'dividendo',
      'mercado', 'cotação', 'dólar', 'juros', 'selic', 'cdb', 'tesouro',
      'vale', 'petrobras', 'itaú', 'banco', 'bradesco', 'ambev', 'magazine luiza',
      'b3', 'bovespa', 'ipo', 'oferta', 'ação', 'título', 'renda fixa',
      'carteira', 'portfólio', 'analista', 'recomendação', 'balanço', 'lucro',
      'resultado', 'receita', 'copom', 'bacen', 'cvm', 'economia'
    ];
    
    // Palavras-chave irrelevantes (para excluir)
    const palavrasChaveExcluir = [
      'futebol', 'esporte', 'novela', 'celebridade', 'entretenimento',
      'crime', 'acidente', 'tempo', 'previsão', 'horóscopo'
    ];
    
    const allNews: NewsItem[] = [];
    
    // Buscar de cada feed
    for (const feed of feeds) {
      try {
        const feedData = await parser.parseURL(feed.url);
        
        feedData.items?.slice(0, 10).forEach(item => {
          const title = (item.title || '').toLowerCase();
          const content = (item.contentSnippet || item.content || '').toLowerCase();
          const fullText = `${title} ${content}`;
          
          // Verificar se contém palavras irrelevantes (excluir)
          const temPalavraIrrelevante = palavrasChaveExcluir.some(palavra => 
            fullText.includes(palavra)
          );
          
          if (temPalavraIrrelevante) {
            return; // Pular esta notícia
          }
          
          // Verificar se contém palavras relevantes
          const temPalavraRelevante = palavrasChaveRelevantes.some(palavra => 
            fullText.includes(palavra)
          );
          
          // Só adicionar se for relevante
          if (temPalavraRelevante) {
            allNews.push({
              title: item.title || '',
              link: item.link || '',
              pubDate: item.pubDate || new Date().toISOString(),
              source: feed.source
            });
          }
        });
      } catch (err) {
        console.error(`Erro ao buscar ${feed.source}:`, err);
      }
    }
    
    // Ordenar por data (mais recentes primeiro)
    allNews.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
    
    // Remover duplicatas pelo título
    const uniqueNews = allNews.filter((news, index, self) =>
      index === self.findIndex((n) => n.title === news.title)
    );
    
    return NextResponse.json({
      news: uniqueNews.slice(0, 10), // Máximo 10 notícias únicas
      lastUpdate: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return NextResponse.json({
      news: [],
      lastUpdate: new Date().toISOString(),
      error: 'Erro ao carregar notícias'
    });
  }
}

