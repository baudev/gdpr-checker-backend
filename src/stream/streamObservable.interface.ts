import { Report } from '../report/report.entity';

export interface StreamObservableInterface {
  data: {
    status?: string;
    percentage: number;
    report?: Report;
  };
  type?: string;
}
