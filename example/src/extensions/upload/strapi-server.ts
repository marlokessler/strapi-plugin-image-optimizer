import imageOptimizerService from "strapi-plugin-image-optimizer/dist/server/services/image-optimizer-service";
import { LoadedPlugin } from "@strapi/types/dist/types/core/plugins";

module.exports = (plugin: LoadedPlugin) => {
  plugin.services["image-manipulation"] = imageOptimizerService;
  return plugin;
};
