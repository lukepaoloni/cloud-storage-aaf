import { User } from "../../user/user.model";
import { define } from "typeorm-seeding";
import * as Faker from "faker";

define(User, (faker: typeof Faker, settings: { role: string }) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const surname = faker.name.lastName(gender);
  const name = `${firstName} ${surname}`;
  const email = faker.internet.email(firstName, surname);
  const password = `password`;
  const roles = ["admin", "user"];
  const teams = ["developer", "support", "management", "marketing"];

  const user = new User();
  user.name = name;
  user.email = email;
  user.password = password;
  user.postCode = faker.address.zipCode("en-GB");
  user.company = faker.company.companyName();
  user.street = faker.address.streetAddress();
  user.city = faker.address.city();
  user.role = roles[faker.random.number(1)];
  user.country = faker.address.country();
  user.teams.push(teams[faker.random.number(3)]);
  user.created_at = new Date();
  user.updated_at = new Date();
  return user;
});
