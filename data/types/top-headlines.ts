export type TopHeadlinesResponse = {
    status: "ok";
    totalResults: number;
    articles: TopHeadlineArticle[];
}

export type TopHeadlineArticle = {
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
};

export type Article = {
    source: {
        id: string;
        name: string;
    };
    author: string;
    title: string;
    description: string;
}