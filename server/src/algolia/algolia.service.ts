import * as Algolia from 'algoliasearch';

export class AlgoliaService {
    private client: Algolia.Client;
    private index: Algolia.Index;

    constructor(index: string) {
        this.client = Algolia(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
        this.index = this.client.initIndex(index);
    }

    public async clearIndex() {
        return await this.index.clearIndex();
    }

    public async search(query: Algolia.QueryParameters) {
        return await this.index.search(query);
    }

    public async add<T>(data: T) {
        return await this.index.addObject(data);
    }

    public async addMany<T>(data: T[]) {
        return await this.index.addObjects(data);
    }

    public async save<T>(data: T) {
        return await this.index.saveObject(data);
    }

    public async saveMany(data: object[]) {
        return await this.index.saveObjects(data);
    }

    public async update<T>(data: T) {
        return await this.index.partialUpdateObject(data);
    }

    public async updateMany<T>(data: T[]) {
        return await this.index.partialUpdateObjects(data);
    }

    public async delete(objectId: string) {
        return await this.index.deleteObject(objectId);
    }

    public async deleteMany(objectIds: string[]) {
        return await this.index.deleteObjects(objectIds);
    }

    public async getManyByIds(objectIds: string[]) {
        return await this.index.getObjects(objectIds);
    }

    public async getById<T>(objectId: string) {
        return await this.index.getObject(objectId) as T;
    }
}
