import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Url } from '../url/url.entity';
import { CookieOpenDatabaseCategoryEnum } from './cookieOpenDatabaseCategory.enum';

@Entity()
export class Cookie {
  constructor(name: string) {
    this.name = name;
  }

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  type: CookieOpenDatabaseCategoryEnum | undefined;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  domain: string;

  @Column({ nullable: true })
  IP: string;

  @Column({ nullable: true })
  hasAdequateLevelOfProtection: boolean;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  countryCodeIso: string;

  @Column({ nullable: true })
  retentionPeriod: string;

  @Column({ nullable: true })
  termsLink: string;

  @ManyToMany(() => Url, (url) => url.cookies)
  urls: Url[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
