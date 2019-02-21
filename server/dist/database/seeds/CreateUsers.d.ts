import { Seed, Factory } from "typeorm-seeding";
import { Connection } from "typeorm";
export declare class CreateUsers implements Seed {
    seed(factory: Factory, connection: Connection): Promise<any>;
}
