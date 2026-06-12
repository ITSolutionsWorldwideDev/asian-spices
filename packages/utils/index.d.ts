export declare function formatPrice(amount: number): string;
export declare const formatCurrency: (amount: number, symbol: string, decimals?: number) => string;
export declare function extractYoutubeId(url: string): string | null;
export declare function extractYoutubeData(url: string): {
    videoId: string;
    embedUrl: string;
    thumbnailUrl: string;
} | null;
