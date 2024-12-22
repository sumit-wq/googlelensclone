import { useState, useCallback } from 'react';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface RequestConfig {
  url: string;
  method: Method;
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

interface UseApiReturn<T> extends ApiResponse<T> {
  makeRequest: (config: RequestConfig) => Promise<T | null>;
  reset: () => void;
}

const useApi = <T>(): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  const makeRequest = useCallback(async ({
    url,
    method,
    body,
    headers = {},
    isFormData = false
  }: RequestConfig): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const requestHeaders: Record<string, string> = {
        ...headers
      };

      // Only set Content-Type if not FormData
      if (!isFormData) {
        requestHeaders['Content-Type'] = 'application/json';
      }

      const options: RequestInit = {
        method,
        headers: requestHeaders
      };

      // Add body for non-GET requests
      if (method !== 'GET' && body) {
        options.body = isFormData ? body : JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    error,
    loading,
    makeRequest,
    reset
  };
};

export default useApi;
 