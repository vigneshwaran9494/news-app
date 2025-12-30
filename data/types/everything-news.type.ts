export type EverythingResponse = {
    status: string; // e.g., "ok"
    totalResults: number;
    articles: EverythingArticle[];
}

export type EverythingArticle = {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string | null; 
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string | null;
}