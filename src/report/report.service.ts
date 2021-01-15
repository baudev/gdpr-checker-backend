import { Injectable } from '@nestjs/common';
import { StreamObservableInterface } from '../stream/streamObservable.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { NavigatorService } from '../navigator/navigator.service';
import { Url } from '../url/url.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    private navigatorService: NavigatorService,
  ) {}

  public getReportOfUiid(
    uiid: string,
    resolve: (result: StreamObservableInterface) => void,
    reject: (error: StreamObservableInterface) => void,
  ): void {
    resolve({
      data: { percentage: 10, status: 'Searching in database...' },
    });
    // check in database if the results already exists
    this.reportRepository.findOne({ uuid: uiid }).then((report) => {
      if (report === undefined) {
        reject({
          data: { percentage: 100, status: 'Invalid request' },
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
        resolve({ data: { percentage: 100, report: report } });
      } else {
        // we delete the previous URL
        this.urlRepository.remove(report.urls).then(() => {
          report.urls = [];
          this.reportRepository.save(report);

          // need to create a report
          resolve({
            data: {
              percentage: 20,
              status: 'Need to create a new report...',
              report: report,
            },
          });

          this.navigatorService.analyzeWebsite(
            report,
            (result) => {
              if (result.data.percentage === 100) {
                result.data.report.updatedAt = new Date();
                this.reportRepository.save(result.data.report);
              }
              resolve(result);
            },
            (error) => {
              reject(error);
            },
          );
        });
      }
    });
  }
}
