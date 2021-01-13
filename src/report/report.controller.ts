import { Body, Controller, Param, Post, Sse } from '@nestjs/common';
import { UrlPipe } from '../pipe/url.pipe';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { StreamService } from '../stream/stream.service';
import { StreamObservableInterface } from '../stream/streamObservable.interface';

@Controller('report')
export class ReportController {
  constructor(
    private configService: ConfigService,
    private streamService: StreamService,
  ) {}

  @Post()
  createReport(@Body('domain', new UrlPipe()) domain: string): string {
    return (
      this.configService.get('PROTOCOL') +
      '://' +
      this.configService.get('HOST') +
      '/report/' +
      domain
    );
  }

  @Sse('/:domain')
  getReport(
    @Param('domain', new UrlPipe()) domain: string,
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
