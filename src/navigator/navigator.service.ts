import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';
import { Url } from '../url/url.entity';
import { Cookie } from '../cookie/cookie.entity';
import * as dns from 'dns';
import { CookieService } from '../cookie/cookie.service';
import { Report } from '../report/report.entity';
import { StreamObservableInterface } from '../stream/streamObservable.interface';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const geoip = require('geoip-lite');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lookup = require('country-code-lookup');

@Injectable()
export class NavigatorService {
  protected browser: Browser;
  constructor(private cookieService: CookieService) {
    this.launchBrowser();
  }

  private launchBrowser() {
    puppeteer
      .launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      })
      .then((browser) => {
        this.browser = browser;
        this.browser.on('disconnected', () => this.launchBrowser());
      });
  }

  private waitForBrowser() {
    return new Promise((resolve) => {
      const browserCheck = setInterval(() => {
        if (this.browser !== undefined) {
          clearInterval(browserCheck);
          return resolve(true);
        }
      }, 100);
    });
  }

  async analyzeWebsite(
    report: Report,
    resolve1: (result: StreamObservableInterface) => void,
    reject1: (error: StreamObservableInterface) => void,
  ): Promise<void> {
    await this.waitForBrowser();
    resolve1({
      data: {
        isCompleted: false,
        status: 'Requesting the page...',
        report: report,
      },
    });
    const pageNumber = (await this.browser.pages()).length;
    if (pageNumber > 10) {
      reject1({
        data: {
          isCompleted: true,
          status: 'Too much usage. Try later please.',
        },
      });
    }
    const page = await this.browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    // TODO find a cleaner way
    try {
      await page.goto('https://' + report.domain, {
        waitUntil: 'networkidle2',
      });
    } catch (e) {
      // trying with HTTP
      try {
        await page.goto('http://' + report.domain, {
          waitUntil: 'networkidle2',
        });
      } catch (e) {
        reject1({
          data: {
            isCompleted: true,
            status: 'Impossible to load the given URL',
          },
        });
      }
    }
    // ts definitions are not good
    const cookiesArray = await (page as any)._client.send(
      'Network.getAllCookies',
    );

    const isHTTPS = /^https:\/\//.test(page.url());

    page.close();
    // TODO move this part
    const urlEntity = new Url(report.domain, isHTTPS);
    report.addUrl(urlEntity);
    for (const cookie of cookiesArray.cookies) {
      const cookieEntity = new Cookie(cookie.name);
      cookieEntity.domain = this.extractCookieDomain(cookie.domain);
      const cookieInformation = this.cookieService.getCookieInformationByName(
        cookieEntity.name,
      );
      if (cookieInformation !== null) {
        cookieEntity.type = cookieInformation.Category;
      }
      try {
        cookieEntity.IP = await this.getIPFromDomain(cookieEntity.domain);
        const geo = geoip.lookup(cookieEntity.IP);
        if (geo != null) {
          cookieEntity.hasAdequateLevelOfProtection =
            geo.eu === '1' ||
            [
              'AD',
              'AR',
              'CA',
              'FO',
              'GG',
              'IL',
              'IM',
              'JP',
              'JE',
              'NZ',
              'CH',
              'UY',
            ].includes(geo.country); // https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en
          const countryLookup = lookup.byIso(geo.country);
          if (countryLookup != null) {
            cookieEntity.country = countryLookup.country;
          }
        }
      } catch (e) {
        // error while getting IP address
      }
      urlEntity.addCookie(cookieEntity);
    }
    resolve1({ data: { isCompleted: true, report: report } });
  }

  // TODO Doc

  private getIPFromDomain(domain: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      dns.lookup(domain, (err, address, family) => {
        if (err) reject(err);
        resolve(address);
      });
    });
  }

  private extractCookieDomain(url: string) {
    const regex = /([a-z0-9][a-z0-9\-]{1,63}\.[a-z\.]{2,6})$/i;
    const match = regex.exec(url);
    return match[1];
  }
}
