# Strapi-plugin-image-optimizer

## Table of contents

- [Requirements](#requirements)
- [Installation](#installation)
  - [Config options](#config-options)
  - [Full example config](#full-example-config)
- [Usage](#usage)
  - [Uploading images](#uploading-images)
- [Examples](#examples)
- [Found a bug?](#found-a-bug)
- [Contributors](#contributors-✨)

## Requirements

Strapi Version >= v4.6.x

## Installation

Enable the Image Optimizer plugin in the `./config/plugins.js/ts` of your Strapi project.

### Config options

The plugin requires several configurations to be set in the `.config/plugins.js/ts` file of your Strapi project to work. Mandatory settings are marked with `*`.

| Key | Type | Notes |

### Full example config

```TypeScript
module.exports = ({ env }) => ({
  // ...

  "image-optimizer": {
    enabled: true,
    config: {
      // TODO: Enter config here
    },
  },

  // ...
});
```

## Usage

### Uploading images

When uploading an image in the media library, Image Optimizer resizes and converts the uploaded images as specified in the config.

## Examples

## Found a bug?

If you found a bug or have any questions please [submit an issue](https://github.com/marlokessler/strapi-plugin-image-optimizer/issues). If you think you found a way how to fix it, please feel free to create a pull request!

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
