import { Config } from "../models";
import configSchema from "./schema";

export default {
  default: {},
  async validator(config: Config) {
    await configSchema.validate(config);
  },
};
