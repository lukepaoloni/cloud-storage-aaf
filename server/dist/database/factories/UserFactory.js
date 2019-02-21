"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../user/user.model");
const typeorm_seeding_1 = require("typeorm-seeding");
typeorm_seeding_1.define(user_model_1.User, (faker, settings) => {
    const gender = faker.random.number(1);
    const firstName = faker.name.firstName(gender);
    const surname = faker.name.lastName(gender);
    const name = `${firstName} ${surname}`;
    const email = faker.internet.email(firstName, surname);
    const password = `password`;
    const roles = ["admin", "user"];
    const teams = ["developer", "support", "management", "marketing"];
    const user = new user_model_1.User();
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
//# sourceMappingURL=UserFactory.js.map