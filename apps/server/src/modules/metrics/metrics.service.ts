import { Injectable } from '@nestjs/common';
import client, { Registry, collectDefaultMetrics, Counter } from 'prom-client';

@Injectable()
export class MetricsService {
  private registry: Registry;
  wsEvents: Counter;
  transfers: Counter;

  constructor() {
    this.registry = new client.Registry();
    collectDefaultMetrics({ register: this.registry });
    this.wsEvents = new client.Counter({ name: 'ws_events_total', help: 'Total WS events sent', registers: [this.registry] });
    this.transfers = new client.Counter({ name: 'transfers_total', help: 'Total item transfers', registers: [this.registry] });
  }

  async render() {
    return this.registry.metrics();
  }
}

