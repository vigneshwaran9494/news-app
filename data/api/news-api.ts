import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EverythingResponse } from '../types/everything-news.type';
import { SourcesResponse } from '../types/sources.type';
import { TopHeadlinesResponse } from '../types/top-headlines.type';

type EverythingQueryParams = {
  q: string;
  sources?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  language?: string;
  page?: number;
  pageSize?: number;
};

type TopHeadlinesQueryParams = {
  country?: string;
  sources?: string;
};

// construct query params from an object
const buildQueryParams = (params: Record<string, string | number | undefined>): URLSearchParams => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams;
};

// base query for the news API with API key automatically added to all requests
const baseQueryWithApiKey: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const apiKey = process.env.EXPO_PUBLIC_NEWS_API_KEY;

  // Add API key to all requests
  const modifiedArgs = typeof args === 'string'
    ? `${args}${args.includes('?') ? '&' : '?'}apiKey=${apiKey}`
    : {
        ...args,
        url: args.url ? `${args.url}${args.url.includes('?') ? '&' : '?'}apiKey=${apiKey}` : args.url,
      };

  return fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_NEWS_API_URL,
  })(modifiedArgs, api, extraOptions);
};

export const newsApi = createApi({
  reducerPath: 'news_api',
  baseQuery: baseQueryWithApiKey,
  endpoints: (builder) => ({
    getSources: builder.query<SourcesResponse, void>({
      query: () => API_ENDPOINTS.SOURCES,
    }),
    getTopHeadlines: builder.query<TopHeadlinesResponse, TopHeadlinesQueryParams>({
      query: (params) => {
        const queryString = buildQueryParams(params).toString();
        return `${API_ENDPOINTS.TOP_HEADLINES}${queryString ? `?${queryString}` : ''}`;
      },
    }),
    getEverything: builder.query<EverythingResponse, EverythingQueryParams>({
      query: (params) => {
        const queryString = buildQueryParams(params).toString();
        return `${API_ENDPOINTS.EVERYTHING}?${queryString}`;
      },
    }),
  }),
});

export const { useGetSourcesQuery, useGetTopHeadlinesQuery, useGetEverythingQuery } = newsApi;
