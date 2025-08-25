import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ReceiverService } from './receiver.service';
import { ReceiverController } from './receiver.controller';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    BullModule.registerQueue({
      name: 'test-queue',
    }),
  ],
  providers: [ReceiverService],
  controllers: [ReceiverController],
})
export class ReceiverModule {}
