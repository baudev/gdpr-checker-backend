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
    // if a domain we add prefix
    if (isValidDomain(value)) {
      value = 'http://' + value;
    }
    // check if valid URL
    const match = value.match(/^http:\/\/([0-9a-z.-_]+)$/);
    if (!(match && isValidDomain(match[1]))) {
      throw new BadRequestException('Invalid URL');
    }
    return value;
  }
}
