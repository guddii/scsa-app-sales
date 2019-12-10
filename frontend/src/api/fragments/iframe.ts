import {
    EventDrivenConsumer,
    IEventDrivenConsumer,
    LoggerSingleton,
    Message
} from "@scsa/messaging";
import { cfg } from "../../config";

const eventDrivenConsumer = new EventDrivenConsumer(cfg);

export class Iframe implements IEventDrivenConsumer {
    private logger: LoggerSingleton;
    input: string;

    constructor() {
        if (top === self) {
            console.warn("This system was not instantiated in an iFrame");
        }
        eventDrivenConsumer.subscribe(this);

        const input = document.querySelector("input");
        input.addEventListener("input", this.handleInput.bind(this));

        const button = document.querySelector("button");
        button.addEventListener("click", this.handleClick.bind(this));

        this.logger = LoggerSingleton.getInstance();
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

new Iframe();
