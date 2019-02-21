import * as Algolia from 'algoliasearch';
export declare class AlgoliaController {
    private algoliaService;
    constructor();
    index(query: string, email: string): Promise<Algolia.Response>;
}
