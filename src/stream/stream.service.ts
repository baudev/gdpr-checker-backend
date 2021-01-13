import { Injectable } from '@nestjs/common';
import { StreamObservableEntryInterface } from './streamObservableEntry.interface';
import { EMPTY, observable, Observable, throwError } from 'rxjs';
import { StreamObservableInterface } from './streamObservable.interface';
import { catchError, share } from 'rxjs/operators';
import { ReportService } from '../report/report.service';

@Injectable()
export class StreamService {
  protected readonly streamObservableArray: StreamObservableEntryInterface[] = [];

  constructor(private reportService: ReportService) {}

  /**
   * Returns the observable of the streamObservableEntry corresponding to the researched key
   * @param key
   */
  getStreamObservableByUuid(
    key: string,
  ): Observable<StreamObservableInterface> | null {
    for (let i = 0; i < this.streamObservableArray.length; i++) {
      if (this.streamObservableArray[i].key === key) {
        return this.streamObservableArray[i].observable;
      }
    }
    return null;
  }

  /**
   * Creates an observable for the key specified and adds an streamObservableEntry to streamObservableArray
   * @param uuid
   */
  createStreamObservableEntry(
    uuid: string,
  ): Observable<StreamObservableInterface> {
    const observableEntry = {
      key: uuid,
      observable: new Observable<StreamObservableInterface>((observer) => {
        this.reportService.getReportOfUiid(
          uuid,
          (result: StreamObservableInterface) => {
            observer.next(result);
            if (result.data.isCompleted) observer.complete();
          },
          (error: StreamObservableInterface) => {
            observer.next(error);
          },
        );
      }).pipe(share()),
    };
    this.streamObservableArray.push(observableEntry);
    return observableEntry.observable;
  }
}
