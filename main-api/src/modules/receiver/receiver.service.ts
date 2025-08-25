import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ResumeJobType } from '../../common/types/ResumeJob.type';

@Injectable()
export class ReceiverService {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @InjectQueue('test-queue') private readonly testQueue: Queue<ResumeJobType>,
  ) {}

  async sendResume(resume: ResumeJobType) {
    const job = await this.testQueue.add(resume, {
      removeOnComplete: true,
      attempts: 3,
    });
    return { message: 'Resume queued', jobId: job.id };
  }
}
