/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
// import { ResourceMonitorMiddleware } from '../middlewares/resource-monitor.middleware';
import { Redis } from 'ioredis';
import { ReceiverModule } from '../receiver/receiver.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    BullModule.registerQueueAsync({
      name: 'test-queue',
    }),
    ReceiverModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        });
      },
    },
  ],
})
export class AppModule {}
