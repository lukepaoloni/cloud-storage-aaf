import axios from "axios";
import { User } from "@user/user.model";
import * as faker from "faker";

const gender = faker.random.number(1);
const firstName = faker.name.firstName(gender);
const lastName = faker.name.lastName(gender);
const name = `${firstName} ${lastName}`;
const roles = ["admin", "user"];
const teams = ["developer", "support", "marketing", "management"];

const body: Partial<User> = {
  name,
  email: faker.internet.email(firstName, lastName),
  password: "password",
  company: faker.company.companyName(),
  street: faker.address.streetAddress(),
  city: faker.address.city(),
  postCode: faker.address.zipCode("en-GB"),
  role: roles[faker.random.number(1)],
  teams: [teams[faker.random.number(3)]],
  created_at: new Date(),
  updated_at: new Date()
};

axios.post(`http://localhost:4000/api/rest/users`, body);
