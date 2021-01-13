import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Url } from '../url/url.entity';

@Entity()
export class Cookie {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column()
  provider: string;

  @Column()
  IP: string;

  @Column()
  isEU: boolean;

  @Column()
  country: string;

  @ManyToMany(() => Url, (url) => url.cookies)
  urls: Url[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
