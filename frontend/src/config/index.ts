import { ApplicationKeys, Config } from "@scsa/global";
import json from "../../package.json";

export const cfg = new Config(ApplicationKeys.Sales, "applications");
export const pkg = json;
