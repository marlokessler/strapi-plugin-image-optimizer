import imageOptimizerService from "strapi-plugin-image-optimizer/dist/server/services/image-optimizer-service";

module.exports = (plugin) => {
  plugin.services["image-manipulation"] = imageOptimizerService;
  return plugin;
};
