import { Injectable } from '@nestjs/common';
import { StreamObservableInterface } from '../stream/streamObservable.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { NavigatorService } from '../navigator/navigator.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private navigatorService: NavigatorService,
  ) {}

  public getReportOfUiid(
    uiid: string,
    resolve: (result: StreamObservableInterface) => void,
    reject: (error: StreamObservableInterface) => void,
  ): void {
    resolve({
      data: { isCompleted: false, status: 'Searching in database...' },
    });
    // check in database if the results already exists
    this.reportRepository.findOne({ uuid: uiid }).then((report) => {
      if (report === undefined) {
        reject({
          data: { isCompleted: true, status: 'Invalid request' },
          type: 'error',
        });
        return;
      }
      const previousDay = new Date().getTime() - 24 * 60 * 60 * 1000;
      if (
        report.updatedAt.getTime() > previousDay &&
        report.urls !== undefined &&
        report.urls.length > 0
      ) {
        // report is recent
        resolve({ data: { isCompleted: true, report: report } });
      } else {
        // need to create a report
        resolve({
          data: {
            isCompleted: false,
            status: 'Need to create a new report...',
            report: report,
          },
        });

        // we delete the previous URL
        // TODO check why url stay in db
        report.urls = [];
        this.reportRepository.save(report);

        this.navigatorService.analyzeWebsite(
          report,
          (result) => {
            if (result.data.isCompleted) {
              result.data.report.updatedAt = new Date();
              this.reportRepository.save(result.data.report);
            }
            resolve(result);
          },
          (error) => {
            reject(error);
          },
        );
      }
    });
  }
}
