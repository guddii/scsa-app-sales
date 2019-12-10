import {
    EventDrivenConsumer,
    IEventDrivenConsumer,
    LoggerSingleton,
    Message
} from "@scsa/messaging";
import { cfg } from "../../config";
import tpl from "../../server/views/partials/entry.pug";

const eventDrivenConsumer = new EventDrivenConsumer(cfg);

class SalesSearch extends HTMLElement implements IEventDrivenConsumer {
    private logger: LoggerSingleton;
    input: string;

    constructor() {
        super();

        this.render();

        const input = this.shadowRoot.querySelector("input");
        input.addEventListener("input", this.handleInput.bind(this));

        const button = this.shadowRoot.querySelector("button");
        button.addEventListener("click", this.handleClick.bind(this));

        this.logger = LoggerSingleton.getInstance(this.shadowRoot);
        eventDrivenConsumer.subscribe(this);
    }

    render() {
        const template = document.createElement("template");
        template.innerHTML += tpl();
        template.innerHTML += `<link type="text/css" rel="stylesheet" href="${cfg
            .CURRENT.options.url + "assets/client.css"}">`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
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

window.customElements.define("sales-search", SalesSearch);
