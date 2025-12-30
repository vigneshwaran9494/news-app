export type SourcesResponse = {
    status: string; // e.g., "ok"
    sources: Source[];
}

export type Source = {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}