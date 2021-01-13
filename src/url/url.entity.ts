import { Report } from '../report/report.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cookie } from '../cookie/cookie.entity';

@Entity()
export class Url {
  constructor(path: string, isHttps: boolean) {
    this.path = path;
    this.isHttps = isHttps;
  }

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  path: string;

  @Column()
  isHttps: boolean;

  @ManyToOne(() => Report, (report) => report.urls)
  report: Report;

  @ManyToMany(() => Cookie, (cookie) => cookie.urls, { cascade: true })
  cookies: Cookie[];

  addCookie(cookie: Cookie) {
    this.cookies.push(cookie);
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
