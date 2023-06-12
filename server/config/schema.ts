import { array, boolean, mixed, number, object, string } from "yup";
import { fit as FitEnum } from "sharp";

const imageFormats = [
  "avif",
  "dz",
  "fits",
  "gif",
  "heif",
  "input",
  "jpeg",
  "jpg",
  "jp2",
  "jxl",
  "magick",
  "openslide",
  "pdf",
  "png",
  "ppm",
  "raw",
  "svg",
  "tiff",
  "tif",
  "v",
  "webp",
];

const formatTypes = ["original", ...imageFormats];

const positions = [
  "top",
  "right top",
  "right",
  "right bottom",
  "bottom",
  "left bottom",
  "left",
  "left top",
  "center",
  "entropy",
  "attention",
];

const configSchema = object({
  additionalResolutions: array().of(number().positive()),
  exclude: array().of(mixed().oneOf(imageFormats)),
  formats: array().of(mixed().oneOf(formatTypes)),
  include: array().of(mixed().oneOf(imageFormats)),
  sizes: array().of(
    object({
      name: string(),
      width: number().positive(),
      height: number().positive(),
      fit: mixed().oneOf(Object.values(FitEnum)),
      position: mixed().oneOf(positions),
      withoutEnlargement: boolean(),
    })
  ),
  quality: number().min(0).max(100),
});

export default configSchema;
