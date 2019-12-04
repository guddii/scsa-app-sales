import {
    MessageEndpoint,
    EndpointProperties,
    Message,
    SecurityChecks
} from "@scsa/messaging";
import { Applications } from "./Constants";

export class App extends MessageEndpoint {
    subscribe(event: MessageEvent) {
        super.subscribe(event);
        if (event.data.body.hasOwnProperty("purchase")) {
            console.log(
              `Bought ${event.data.body.purchase.products.length} products`
            );
        }
        if (event.data.body.hasOwnProperty("hello")) {
            this.publish(
              new Message({
                  hello: `Hello Main, ${this.endpointProperties.name} is here.`
              })
            );
        }
    }
}
