"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = require("@nestjs/swagger");
exports.swagger = (app) => {
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Cloud Storage')
        .setDescription('The Cloud Storage API.')
        .setVersion('0.1')
        .addBearerAuth('Authorization', 'header')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api/swagger', app, document);
};
//# sourceMappingURL=swagger.js.map