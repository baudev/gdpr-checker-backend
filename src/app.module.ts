import { Module } from '@nestjs/common';
import { ReportController } from './report/report.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StreamService } from './stream/stream.service';
import { WebsitesController } from './websites/websites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report/report.entity';
import { Url } from './url/url.entity';
import { Cookie } from './cookie/cookie.entity';
import { ReportService } from './report/report.service';
import { NavigatorService } from './navigator/navigator.service';
import { CookieService } from './cookie/cookie.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USERNAME', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'postgres'),
        database: configService.get('DATABASE_NAME', 'test'),
        extra: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Report, Url, Cookie]),
  ],
  controllers: [ReportController, WebsitesController],
  providers: [
    StreamService,
    ReportService,
    NavigatorService,
    CookieService,
  ],
})
export class AppModule {}
