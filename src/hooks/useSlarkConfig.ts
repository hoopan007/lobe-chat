import useSWR from 'swr';

interface SlarkConfig {
  NEXT_PUBLIC_SLARK_PATH_PRICING: string;
  NEXT_PUBLIC_SLARK_PATH_SETTINGS: string;
  NEXT_PUBLIC_SLARK_URL: string;
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