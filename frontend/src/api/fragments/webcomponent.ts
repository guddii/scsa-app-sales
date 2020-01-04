import {
    EventDrivenConsumerMS,
    IEventDrivenConsumer,
    Logger,
    Message
} from "@scsa/messaging";
import "../../client/index.css";
import { cfg } from "../../config";
import tpl from "../../server/views/partials/entry.pug";

const eventDrivenConsumer = new EventDrivenConsumerMS(cfg);

class SalesSearch extends HTMLElement implements IEventDrivenConsumer {
    public input: string;
    private logger: Logger;
    private datalist: HTMLDataListElement;

    constructor() {
        super();

        this.render();

        const input = this.shadowRoot.querySelector("input");
        input.addEventListener("input", this.handleInput.bind(this));

        const button = this.shadowRoot.querySelector("button");
        button.addEventListener("click", this.handleClick.bind(this));

        this.datalist = this.shadowRoot.querySelector(
            '[data-selector="results"]'
        );

        this.logger = new Logger({ ctx: this.shadowRoot });
        eventDrivenConsumer.subscribe(this);
    }

    public render() {
        const template = document.createElement("template");
        template.innerHTML += tpl();
        template.innerHTML += `<link type="text/css" rel="stylesheet" href="${cfg
            .CURRENT.options.url + "api/fragments/webcomponent.css"}">`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    public handleInput(event) {
        this.input = event.target.value;
        eventDrivenConsumer.publish(new Message({ search: this.input }));
    }

    public handleClick() {
        eventDrivenConsumer.publish(new Message({ search: this.input }));
    }

    public handleFindings(data) {
        this.datalist.innerText = "";
        if (data.payload.found) {
            data.payload.found.products.forEach(element => {
                const opt = document.createElement("option");
                opt.value = element;
                this.datalist.append(opt);
            });
        }
    }

    public callback(data) {
        this.logger.write(data);
        this.handleFindings(data);
    }
}

globalThis.customElements.define("sales-search", SalesSearch);
