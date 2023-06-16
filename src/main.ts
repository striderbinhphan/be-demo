import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IConfig } from 'config';
import { CONFIG } from './common/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      allowedHeaders: '*',
    },
  });
  const envConfig = app.get<IConfig>(CONFIG);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix(envConfig.get('service.baseUrl'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/health', (req, res) => {
    res.json({ ready: true });
  });
  await initializeSwagger(app, envConfig);
  await app.listen(envConfig.get<number>('server.port'), () => {
    console.log(`App started at: http://localhost:${envConfig.get<number>('server.port')}`);
    console.log(
      `Swagger server at: http://localhost:${envConfig.get<number>(
        'server.port',
      )}/${envConfig.get<string>('service.docsBaseUrl')}`,
    );
  });
}
/* Initialize swagger docs */
function initializeSwagger(app: INestApplication, envConfig: IConfig) {
  const serviceName = envConfig.get<string>('service.name');
  const serviceDescription = envConfig.get<string>('service.description');
  const apiVersion = envConfig.get<string>('service.apiVersion');
  const config = new DocumentBuilder()
    .setTitle(`${serviceName} API spec`)
    .setDescription(serviceDescription)
    .setVersion(apiVersion)
    .addServer(`${envConfig.get('server.swaggerSchema')}://${envConfig.get('server.hostname')}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(envConfig.get<string>('service.docsBaseUrl'), app, document);
}
/* Involving nestjs boostrap function */
bootstrap();
