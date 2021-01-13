import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Url } from '../url/url.entity';

@Entity()
export class Report {
  constructor(domain: string) {
    this.domain = domain;
  }

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  domain: string;

  @OneToMany(() => Url, (url) => url.report, { cascade: true })
  urls: Url[];

  addUrl(url: Url) {
    this.urls.push(url);
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
