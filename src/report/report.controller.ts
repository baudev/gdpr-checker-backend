import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Sse,
} from '@nestjs/common';
import { UrlPipe } from '../pipe/url.pipe';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { StreamService } from '../stream/stream.service';
import { StreamObservableInterface } from '../stream/streamObservable.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('report')
@Controller('report')
export class ReportController {
  constructor(
    private configService: ConfigService,
    private streamService: StreamService,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  @ApiBody({
    // Issue https://github.com/nestjs/swagger/issues/669
    schema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
        },
      },
    },
  })
  @Post()
  async createReport(
    @Body('domain', new UrlPipe()) domain: string,
  ): Promise<{ uuid: string; domain: string; updatedAt: Date }> {
    // we search if the domain has an existing entry in database
    let report = await this.reportRepository.findOne({ domain: domain });
    if (report === undefined) {
      // we need to create one
      report = new Report(domain);
      report.updatedAt = new Date();
      report = await this.reportRepository.save(report);
    }
    const { urls, createdAt, ...result } = report;
    return result;
  }

  @Sse('/:uuid')
  getReport(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ): Observable<StreamObservableInterface> {
    // checks if there is a current observable for this domain
    const existingObservable = this.streamService.getStreamObservableByUuid(
      uuid,
    );
    if (existingObservable) {
      return existingObservable;
    } else {
      // we need to create one
      return this.streamService.createStreamObservableEntry(uuid);
    }
  }
}
