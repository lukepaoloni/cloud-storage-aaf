import { Seed, Factory } from "typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../../user/user.model";

export class CreateUsers implements Seed {
  public async seed(factory: Factory, connection: Connection): Promise<any> {
    await factory(User)().seedMany(15);
  }
}
