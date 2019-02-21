import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from '@shared/swagger';
import { Logger } from '@nestjs/common';
import { clientPubDir } from '@shared/config';

async function bootstrap() {
    // process.setMaxListeners(0)
    const app = await NestFactory.create(AppModule);

    swagger(app);
    app.useStaticAssets(clientPubDir);
    app.enableCors();

    await app.listen(4000);

    Logger.log('Go to http://localhost:4000');
}

bootstrap();
