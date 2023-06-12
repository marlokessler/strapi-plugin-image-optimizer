export interface Config {
  /**
   * Additional resolutions to generate. The value is the factor by which the original image is multiplied. For example, if the original image is 1000x1000 and the factor is 2, then the generated image will be 2000x2000.
   */
  additionalResolutions?: number[];
  /**
   * The image formats to exclude. Exclude takes precedence over include. Default is [].
   */
  exclude?: SourceFormat[];
  /**
   * The image formats to generate. Default is ["original", "webp", "avif"].
   */
  formats?: OutputFormat[];
  /**
   * The image formats to include. Exclude takes precedence over include. Default is ["jpeg", "jpg", "png"].
   */
  include?: SourceFormat[];
  /**
   * The image sizes to generate. Default is [].
   */
  sizes: ImageSize[];
  /**
   * The quality of the generated images. Default is 80.
   */
  quality?: number;
}

export interface ImageSize {
  /**
   * The name of the size. This will be used as part of generated image's name and url.
   */
  name: string;
  /**
   * The width of the output image in pixels. If only width is specified then the height is calculated with the original aspect ratio.
   */
  width?: number;
  /**
   * The height of the output image in pixels. If only height is specified then the width is calculated with the original aspect ratio.
   */
  height?: number;
  /**
   * The image fit mode if both width and height are specified. Default is cover.
   */
  fit?: ImageFit;
  /**
   * The position of the image within the output image. This option is only used when fit is cover or contain. Default is center.
   */
  position?: ImagePosition;
  /**
   * When true, the image will not be enlarged if the input image is already smaller than the required dimensions. Default is false.
   */
  withoutEnlargement?: boolean;
}

export type SourceFormat =
  | "avif"
  | "dz"
  | "fits"
  | "gif"
  | "heif"
  | "input"
  | "jpeg"
  | "jpg"
  | "jp2"
  | "jxl"
  | "magick"
  | "openslide"
  | "pdf"
  | "png"
  | "ppm"
  | "raw"
  | "svg"
  | "tiff"
  | "tif"
  | "v"
  | "webp";

export type OutputFormat = "original" | SourceFormat;

export type ImageFit = "contain" | "cover" | "fill" | "inside" | "outside";

export type ImagePosition =
  | "top"
  | "right top"
  | "right"
  | "right bottom"
  | "bottom"
  | "left bottom"
  | "left"
  | "left top"
  | "center"
  | "entropy"
  | "attention";
