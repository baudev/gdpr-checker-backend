import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

@Controller()
export class WebsitesController {
  @Get()
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(
        readFileSync(join(__dirname, '../assets/', 'index.html')).toString(),
      );
  }
}
