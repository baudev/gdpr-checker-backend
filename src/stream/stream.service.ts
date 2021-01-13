import { Injectable } from '@nestjs/common';
import { StreamObservableEntryInterface } from './streamObservableEntry.interface';
import { Observable } from 'rxjs';
import { StreamObservableInterface } from './streamObservable.interface';
import { share } from 'rxjs/operators';

@Injectable()
export class StreamService {
  protected readonly streamObservableArray: StreamObservableEntryInterface[] = [];

  /**
   * Returns the observable of the streamObservableEntry corresponding to the researched key
   * @param key
   */
  getStreamObservableByKey(
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
   * @param key
   */
  createStreamObservableEntry(
    key: string,
  ): Observable<StreamObservableInterface> {
    const observableEntry = {
      key: key,
      observable: new Observable<StreamObservableInterface>((observer) => {
        observer.next({ data: { domain: key, isCompleted: false } });
        setInterval(() => {
          observer.next({ data: { domain: key, isCompleted: true } });
          observer.complete();
        }, 5000);
      }).pipe(share()),
    };
    this.streamObservableArray.push(observableEntry);
    return observableEntry.observable;
  }
}
