import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import { fromEvent } from 'rxjs';

@Injectable()
export class FixtureEventService {
  private readonly logger: Logger = new Logger(FixtureEventService.name);
  private readonly emitter: EventEmitter = new EventEmitter();
  subscribeUpdatedFixtureEvent() {
    return fromEvent(this.emitter, 'fixture_updated');
  }

  async emitEvent(event: string, data: any) {
    this.emitter.emit(event, { data });
  }
}
