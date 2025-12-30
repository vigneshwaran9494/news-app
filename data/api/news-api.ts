import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EverythingResponse } from '../types/everything-news.type';
import { SourcesResponse } from '../types/sources.type';
import { TopHeadlinesResponse } from '../types/top-headlines.type';

/**
 * Base query for the news API with API key automatically added to all requests
 */
const baseQueryWithApiKey: BaseQueryFn = async (args, api, extraOptions) => {
  const apiKey = process.env.EXPO_PUBLIC_NEWS_API_KEY;

  // Add API key to all requests
  const modifiedArgs = typeof args === 'string'
    ? `${args}${args.includes('?') ? '&' : '?'}apiKey=${apiKey}`
    : {
      ...args,
      url: args.url
        ? `${args.url}${args.url.includes('?') ? '&' : '?'}apiKey=${apiKey}`
        : args.url,
    };

  return fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_NEWS_API_URL,
  })(modifiedArgs, api, extraOptions);
};

export const baseQuery = baseQueryWithApiKey;

// Create the API service for the news API
export const newsApi = createApi({
  reducerPath: 'news_api',
  baseQuery,  
  endpoints: (builder) => ({
    // Get sources
    getSources: builder.query<SourcesResponse, void>({
      query: () => ({
        url: `${API_ENDPOINTS.SOURCES}`,
        method: 'GET',
      }),
      transformResponse: (response: SourcesResponse) => response,
    }),
    // Get top headlines
    getTopHeadlines: builder.query<TopHeadlinesResponse, { country: string }>({
      query: ({ country }: { country: string }) => ({
        url: `${API_ENDPOINTS.TOP_HEADLINES}?country=${country}`,
        method: 'GET',
      }),
      transformResponse: (response: TopHeadlinesResponse) => response,
    }),
    // Get everything
    getEverything: builder.query<EverythingResponse, { q: string, from: string, to: string, sortBy: string, language: string, page: number, pageSize: number }>({
      query: ({ q, from, to, sortBy, language, page, pageSize }: { q: string, from: string, to: string, sortBy: string, language: string, page: number, pageSize: number }) => ({
        url: `${API_ENDPOINTS.EVERYTHING}?q=${q}&from=${from}&to=${to}&sortBy=${sortBy}&language=${language}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
      }),
      transformResponse: (response: EverythingResponse) => response,
    }),
  }),
});

// Export hooks for the news API
export const { useGetSourcesQuery, useGetTopHeadlinesQuery, useGetEverythingQuery } = newsApi;
