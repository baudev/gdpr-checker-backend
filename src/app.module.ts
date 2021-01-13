import { Module } from '@nestjs/common';
import { ReportController } from './report/report.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ReportController],
  providers: [],
})
export class AppModule {}
