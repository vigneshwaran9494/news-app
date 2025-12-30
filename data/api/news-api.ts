import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TopHeadlinesResponse } from '../types/top-headlines';

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
    getTopHeadlines: builder.query<TopHeadlinesResponse, { country: string }>({
      query: ({ country }: { country: string }) => ({
        url: `${API_ENDPOINTS.TOP_HEADLINES}?country=${country}`,
        method: 'GET',
      }),
      transformResponse: (response: TopHeadlinesResponse) => response,
    }),
  }),
});

// Export hooks for the news API
export const { useGetTopHeadlinesQuery } = newsApi;
