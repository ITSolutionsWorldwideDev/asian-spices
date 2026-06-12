export declare function authorizeUser(email: string, password: string): Promise<{
    id: any;
    email: any;
    isPlatformAdmin: any;
    storeRoles: any[];
}>;
