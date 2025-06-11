import useSWR from 'swr';

interface SlarkConfig {
  SLARK_PATH_PRICING: string;
  SLARK_PATH_SETTINGS: string;
  SLARK_URL: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useSlarkConfig = () => {
  const { data, error, isLoading } = useSWR<SlarkConfig>('/api/slark-config', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    config: data,
    error,
    isLoading,
  };
}; 