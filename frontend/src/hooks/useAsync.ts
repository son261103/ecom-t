import { useState, useEffect, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
}

function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseAsyncOptions = { immediate: true }
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const err = error as any;
      setState({ data: null, loading: false, error: err });

      // Don't throw error for 403 on user endpoints to avoid console spam
      if (err.response?.status === 403 && err.config?.url?.includes('/user/')) {
        console.log('User endpoint access denied - likely new user or missing data');
        return null;
      }

      throw error;
    }
  }, dependencies);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, loading: false, error: null }),
  };
}

export default useAsync;
