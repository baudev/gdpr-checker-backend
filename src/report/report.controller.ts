import {Body, Controller, Param, ParseUUIDPipe, Post, Sse} from '@nestjs/common';
import { UrlPipe } from '../pipe/url.pipe';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { StreamService } from '../stream/stream.service';
import { StreamObservableInterface } from '../stream/streamObservable.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';

@Controller('report')
export class ReportController {
  constructor(
    private configService: ConfigService,
    private streamService: StreamService,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  @Post()
  async createReport(
    @Body('domain', new UrlPipe()) domain: string,
  ): Promise<Report> {
    // we search if the domain has an existing entry in database
    let report = await this.reportRepository.findOne({ domain: domain });
    if (report === undefined) {
      // we need to create one
      report = new Report(domain);
      report = await this.reportRepository.save(report);
    }
    return report;
  }

  @Sse('/:uuid')
  getReport(
    @Param('uuid', new ParseUUIDPipe()) domain: string,
  ): Observable<StreamObservableInterface> {
    // checks if there is a current observable for this domain
    const existingObservable = this.streamService.getStreamObservableByKey(
      domain,
    );
    if (existingObservable) {
      return existingObservable;
    } else {
      // we need to create one
      return this.streamService.createStreamObservableEntry(domain);
    }
  }
}
