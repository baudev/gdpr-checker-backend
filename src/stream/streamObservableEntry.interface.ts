import { Observable } from 'rxjs';
import { StreamObservableInterface } from './streamObservable.interface';

export interface StreamObservableEntryInterface {
  key: string;
  observable: Observable<StreamObservableInterface>;
}
