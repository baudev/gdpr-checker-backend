import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser, Cookie as PuppeteerCookie } from 'puppeteer';
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
        percentage: 40,
        status: 'Requesting the page...',
        report: report,
      },
    });
    const pageNumber = (await this.browser.pages()).length;
    if (pageNumber > 10) {
      reject1({
        data: {
          percentage: 100,
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
            percentage: 100,
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

    // TODO check multiple urls and not only one
    const urlEntity = new Url(report.domain, isHTTPS);
    report.addUrl(urlEntity);

    let percentage = 40;
    const increasePercentageForEachCookie =
      (100 - percentage) /
      (cookiesArray.cookies.length !== 0 ? cookiesArray.cookies.length : 1);

    for (const cookie of cookiesArray.cookies) {
      const cookieEntity = await this.getInformationFromCookie(cookie);
      urlEntity.addCookie(cookieEntity);
      percentage = percentage + increasePercentageForEachCookie;
      resolve1({ data: { percentage: percentage, report: report } });
    }
    resolve1({ data: { percentage: 100, report: report } });
  }

  /**
   * Gets IP from a domain
   * @param domain
   * @private
   */
  private getIPFromDomain(domain: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      dns.lookup(domain, (err, address, family) => {
        if (err) reject(err);
        resolve(address);
      });
    });
  }

  /**
   * Extracts the domain of a cookie domain
   * @param url
   * @private
   */
  private static extractCookieDomain(url: string) {
    const regex = /([a-z0-9][a-z0-9\-]{1,63}\.[a-z\.]{2,6})$/i;
    const match = regex.exec(url);
    return match[1];
  }

  /**
   * Creates a Cookie from the browser cookie information and database
   * @param cookie
   * @private
   */
  private async getInformationFromCookie(
    cookie: PuppeteerCookie,
  ): Promise<Cookie> {
    return new Promise(async (resolve) => {
      // Get cookie name
      const cookieEntity = new Cookie(cookie.name);
      // Extract the cookie domain
      cookieEntity.domain = NavigatorService.extractCookieDomain(cookie.domain);

      // Search in database information on this cookie
      const cookieInformation = this.cookieService.getCookieInformationByName(
        cookieEntity.name,
      );

      // If there is information
      if (cookieInformation !== null) {
        cookieEntity.provider = cookieInformation.Platform;
        cookieEntity.type = cookieInformation.Category;
        cookieEntity.description = cookieInformation.Description;
        cookieEntity.retentionPeriod = cookieInformation['Retention period'];
        cookieEntity.termsLink =
          cookieInformation['User Privacy & GDPR Rights Portals'];
      }
      try {
        // Gets IP of the related domain
        cookieEntity.IP = await this.getIPFromDomain(cookieEntity.domain);
        // Gets location information concerning the IP
        const geo = geoip.lookup(cookieEntity.IP);
        if (geo != null) {
          // Checks if data is authorized to go outside UE
          cookieEntity.countryCodeIso = geo.country;
          cookieEntity.hasAdequateLevelOfProtection =
            geo.eu === '1' ||
            NavigatorService.authorizedCountriesOutOfUE().includes(geo.country);
          // Gets the country name
          const countryLookup = lookup.byIso(geo.country);
          if (countryLookup != null) {
            cookieEntity.country = countryLookup.country;
          }
        }
      } catch (e) {
        // error while getting IP address
      }
      return resolve(cookieEntity);
    });
  }

  /**
   * The list of countries that EU considers as offering an adequate level of data protection.
   * https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en
   * @private
   */
  private static authorizedCountriesOutOfUE(): string[] {
    return [
      'AD', // Andorra
      'AR', // Argentina
      'CA', // Canada
      'FO', // Faroe Islands
      'GG', // Guernsey
      'IL', // Israel
      'IM', // Isle of Man
      'JP', // Japan
      'JE', // Jersey
      'NZ', // New Zealand
      'CH', // Switzerland
      'UY', // Uruguay
    ];
  }
}
