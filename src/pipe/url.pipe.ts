import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const isValidDomain = require('is-valid-domain');

@Injectable()
/**
 * Checks if the value is a good URL or domain
 */
export class UrlPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    // if starts by scheme
    const match = value.match(/^http(s)?:\/\/([0-9a-z.-_]+)$/);
    if (match) {
      value = value.replace(/http(s)?:\/\//, '');
    }
    // check if valid domain
    if (!isValidDomain(value, { subdomain: true })) {
      throw new BadRequestException('Invalid link');
    }
    return value;
  }
}
