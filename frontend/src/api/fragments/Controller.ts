import {
    EventDrivenConsumerGT,
    IEventDrivenConsumer,
    Logger,
    Message
} from "@scsa/messaging";
import "../../client/index.css";
import { cfg } from "../../config";

interface IIframeOptions {
    ctx?: Element | Document;
    edc?: any;
}

export class Controller implements IEventDrivenConsumer {
    public button = document.querySelector("button");
    public input: string;
    private logger: Logger;
    private options: IIframeOptions;
    private datalist: HTMLDataListElement;



    constructor(
        options: IIframeOptions = {
            ctx: document,
            edc: new EventDrivenConsumerGT(cfg)
        }
    ) {
        this.options = options;
        this.options.edc.subscribe(this);

        const input = options.ctx.querySelector("input");
        input.addEventListener("input", this.handleInput.bind(this));

        const button = options.ctx.querySelector("button");
        button.addEventListener("click", this.handleClick.bind(this));

        this.datalist = options.ctx.querySelector(
          '[data-selector="results"]'
        );

        this.logger = new Logger({
            ctx: options.ctx
        });
    }

    public handleInput = event => {
        this.input = event.target.value;
        this.options.edc.publish(new Message({ search: this.input }));
    };

    public handleClick = () => {
        this.options.edc.publish(new Message({ search: this.input }));
    };

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
