type AppType = "admin" | "web";
export declare function credentialsProvider(app: AppType): import("next-auth/providers/credentials").CredentialsConfig<{
    email: {
        label: string;
        type: string;
    };
    password: {
        label: string;
        type: string;
    };
}>;
export {};
