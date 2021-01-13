import { Injectable } from '@nestjs/common';
import { CookieOpenDatabaseInterface } from './cookieOpenDatabase.interface';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DownloaderHelper } = require('node-downloader-helper');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const csv = require('csvtojson');

@Injectable()
export class CookieService {
  private databaseLink =
    'https://raw.githubusercontent.com/jkwakman/Open-Cookie-Database/master/open-cookie-database.csv';

  private filePath: string;
  private fileContent: Array<CookieOpenDatabaseInterface>;

  constructor() {
    this.downloadFileAndRetrieveContent();
    setInterval(() => {
      // every day
      this.downloadFileAndRetrieveContent();
    }, 86400000);
  }

  private downloadFileAndRetrieveContent() {
    const dl = new DownloaderHelper(this.databaseLink, __dirname, {
      override: true,
    });

    dl.on('end', async (res) => {
      this.filePath = res.filePath;
      this.fileContent = await this.readCSVFile();
    });
    dl.on('error', () => console.log('err'));
    dl.start();
  }

  private readCSVFile(): Promise<Array<CookieOpenDatabaseInterface>> {
    return csv().fromFile(this.filePath);
  }

  public getCookieInformationByName(
    name: string,
  ): CookieOpenDatabaseInterface | null {
    if (this.fileContent == undefined) {
      return null;
    } else {
      const resuts = this.fileContent.filter(function (data) {
        return data['Cookie / Data Key name'] === name;
      });
      if (resuts[0]) {
        return resuts[0];
      } else {
        return null;
      }
    }
  }
}
