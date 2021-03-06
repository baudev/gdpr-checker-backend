import { Module } from '@nestjs/common';
import { ReportController } from './report/report.controller';
import { ConfigModule } from '@nestjs/config';
import { StreamService } from './stream/stream.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report/report.entity';
import { Url } from './url/url.entity';
import { Cookie } from './cookie/cookie.entity';
import { ReportService } from './report/report.service';
import { NavigatorService } from './navigator/navigator.service';
import { CookieService } from './cookie/cookie.service';
import { config } from './ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([Report, Url, Cookie]),
  ],
  controllers: [ReportController],
  providers: [StreamService, ReportService, NavigatorService, CookieService],
})
export class AppModule {}
