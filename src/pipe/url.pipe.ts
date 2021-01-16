import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
/**
 * Checks if the value is a good URL or domain
 */
export class UrlPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    const regex = /(http(s)?:\/\/)?([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5})(\/.*)?$/m;
    const matches = regex.exec(value.toLowerCase());
    // check if valid domain
    if (matches == null) {
      throw new BadRequestException('Invalid link');
    }
    return matches[3];
  }
}
