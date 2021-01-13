import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @OneToMany(() => Url, (url) => url.report, { cascade: true, eager: true })
  urls: Url[];

  addUrl(url: Url) {
    if (!this.urls) {
      this.urls = [];
    }
    this.urls.push(url);
  }

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
