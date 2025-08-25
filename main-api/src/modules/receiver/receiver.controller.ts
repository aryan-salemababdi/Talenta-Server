import { Controller, Post, Body } from '@nestjs/common';
import { ReceiverService } from './receiver.service';

@Controller('receiver')
export class ReceiverController {
  constructor(private readonly receiverService: ReceiverService) {}

  @Post('send-resume')
  async sendResume(
    @Body() resume: { name: string; email: string; fileUrl: string },
  ) {
    return await this.receiverService.sendResume(resume);
  }
}
