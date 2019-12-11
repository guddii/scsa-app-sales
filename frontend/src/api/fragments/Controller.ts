import {
  EventDrivenConsumer,
  IEventDrivenConsumer,
  Logger,
  Message
} from "@scsa/messaging";
import { cfg } from "../../config";
import "../../client/index.css";

const eventDrivenConsumer = new EventDrivenConsumer(cfg);

interface IframeOptions {
  ctx?: Element | Document;
}

export class Controller implements IEventDrivenConsumer {
  private logger: Logger;
  input: string;

  constructor(options: IframeOptions = { ctx: document }) {
    eventDrivenConsumer.subscribe(this);

    const input = options.ctx.querySelector("input");
    input.addEventListener("input", this.handleInput.bind(this));

    const button = options.ctx.querySelector("button");
    button.addEventListener("click", this.handleClick.bind(this));

    this.logger = new Logger({
      ctx: options.ctx
    });
  }

  handleInput(event) {
    this.input = event.target.value;
    eventDrivenConsumer.publish(new Message({ search: this.input }));
  }

  handleClick() {
    eventDrivenConsumer.publish(new Message({ search: this.input }));
  }

  callback(data) {
    this.logger.write(data);
  }
}
