import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'vehiculos',
        protoPath: join(__dirname, '../../proto/vehiculos.proto'),
        url: '0.0.0.0:50051',
      },
    },
  );

  await app.listen();
  console.log('🚀 Users gRPC microservice running on port 50051');
}

bootstrap().catch((err) => {
  console.error('Error starting gRPC microservice', err);
  process.exit(1);
});
