import { Body, Controller, Get, Post } from '@nestjs/common';
import { UrlPipe } from '../pipe/url.pipe';
import { ConfigService } from '@nestjs/config';

@Controller('report')
export class ReportController {
  constructor(private configService: ConfigService) {}

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
}
