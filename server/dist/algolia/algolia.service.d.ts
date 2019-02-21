import * as Algolia from 'algoliasearch';
export declare class AlgoliaService {
    private client;
    private index;
    constructor(index: string);
    clearIndex(): Promise<Algolia.Task>;
    search(query: Algolia.QueryParameters): Promise<Algolia.Response>;
    add<T>(data: T): Promise<Algolia.Task>;
    addMany<T>(data: T[]): Promise<Algolia.Task>;
    save<T>(data: T): Promise<Algolia.Task>;
    saveMany(data: object[]): Promise<Algolia.Task>;
    update<T>(data: T): Promise<Algolia.Task>;
    updateMany<T>(data: T[]): Promise<Algolia.Task>;
    delete(objectId: string): Promise<Algolia.Task>;
    deleteMany(objectIds: string[]): Promise<Algolia.Task>;
    getManyByIds(objectIds: string[]): Promise<{
        results: {}[];
    }>;
    getById<T>(objectId: string): Promise<T>;
}
