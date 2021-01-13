import { Report } from '../report/report.entity';

export interface StreamObservableInterface {
  data: {
    isCompleted: boolean;
    status?: string;
    report?: Report;
  };
  type?: string;
}
