export declare class DbConnection {
    private CONNECTION_CONFIG;
    private connectionPool;
    constructor(dbName: string);
    Connect: (successCallback: any, errorCallback: any) => void;
}
