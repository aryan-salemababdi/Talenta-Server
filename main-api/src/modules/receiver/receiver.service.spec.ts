import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';
import { ReceiverService } from './receiver.service';
import { getQueueToken } from '@nestjs/bull';
import { ResumeJobType } from 'src/common/types/ResumeJob.type';

describe('ReceiverService', () => {
  let service: ReceiverService;
  let queueMock: Partial<Queue>;

  beforeEach(async () => {
    queueMock = {
      add: jest.fn().mockResolvedValue({ id: '123' }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiverService,
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          provide: getQueueToken('test-queue'),
          useValue: queueMock,
        },
      ],
    }).compile();

    service = module.get<ReceiverService>(ReceiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should queue a resume job', async () => {
    const resume: ResumeJobType = {
      name: 'Aryan Salemabadi',
      email: 'aryan@example.com',
      fileUrl: 'https://example.com/resume.pdf',
    };

    const result = await service.sendResume(resume);

    expect(queueMock.add).toHaveBeenCalledWith(resume, {
      removeOnComplete: true,
      attempts: 3,
    });

    expect(result).toEqual({ message: 'Resume queue', jobId: '123' });
  });
});
