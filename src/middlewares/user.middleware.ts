import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  async use(req, res, next) {
    req.user = undefined;
    next();
  }
}
