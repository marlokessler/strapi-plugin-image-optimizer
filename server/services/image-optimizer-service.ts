import { ReadStream, createReadStream, createWriteStream } from "fs";
import { join } from "path";
import sharp, { Sharp, Metadata, FormatEnum, format } from "sharp";

import { bytesToKbytes } from "@strapi/utils/lib/file";
import imageManipulation from "@strapi/plugin-upload/server/services/image-manipulation";

import settingsService from "./settings-service";
import {
  OutputFormat,
  ImageSize,
  InvalidParametersError,
  File,
  SourceFile,
  StrapiImageFormat,
  SourceFormat,
} from "../models";

const defaultFormats: OutputFormat[] = ["original", "webp", "avif"];
const defaultInclude: SourceFormat[] = ["jpeg", "jpg", "png"];
const defaultQuality = 80;

async function optimizeImage(file: SourceFile): Promise<StrapiImageFormat[]> {
  // Get config
  const {
    exclude = [],
    formats = defaultFormats,
    include = defaultInclude,
    sizes,
    additionalResolutions,
    quality = defaultQuality,
  } = settingsService.settings;

  const sourceFileType = file.ext.replace(".", "") as keyof FormatEnum;
  if (exclude.includes(sourceFileType) || !include.includes(sourceFileType.toLowerCase())) {
    return Promise.all([]);
  }

  const imageFormatPromises: Promise<StrapiImageFormat>[] = [];

  formats.forEach((format) => {
    sizes.forEach((size) => {
      imageFormatPromises.push(generateImage(file, format, size, quality));
      if (additionalResolutions) {
        additionalResolutions.forEach((resizeFactor) => {
          imageFormatPromises.push(
            generateImage(file, format, size, quality, resizeFactor)
          );
        });
      }
    });
  });

  return Promise.all(imageFormatPromises);
}

async function generateImage(
  sourceFile: SourceFile,
  format: OutputFormat,
  size: ImageSize,
  quality: number,
  resizeFactor = 1
): Promise<StrapiImageFormat> {
  const resizeFactorPart = resizeFactor === 1 ? "" : `_${resizeFactor}x`;
  const sizeName = `${size.name}${resizeFactorPart}`;
  const formatPart = format === "original" ? "" : `_${format}`;
  return {
    key: `${sizeName}${formatPart}`,
    file: await resizeFileTo(
      sourceFile,
      sizeName,
      format,
      size,
      quality,
      resizeFactor
    ),
  };
}

async function resizeFileTo(
  sourceFile: SourceFile,
  sizeName: string,
  format: OutputFormat,
  size: ImageSize,
  quality: number,
  resizeFactor: number
): Promise<File> {
  let sharpInstance = sharp();
  if (format !== "original") {
    sharpInstance = sharpInstance.toFormat(format);
  }
  sharpInstance = sharpAddFormatSettings(sharpInstance, { quality });
  sharpInstance = sharpAddResizeSettings(sharpInstance, size, resizeFactor);

  const imageHash = `${sizeName}_${sourceFile.hash}`;
  const filePath = join(sourceFile.tmpWorkingDirectory, imageHash);
  const newImageStream = sourceFile.getStream().pipe(sharpInstance);
  await writeStreamToFile(newImageStream, filePath);

  const metadata = await getMetadata(createReadStream(filePath));
  return {
    name: getFileName(sourceFile, sizeName),
    hash: imageHash,
    ext: getFileExtension(sourceFile, format),
    mime: getFileMimeType(sourceFile, format),
    path: sourceFile.path,
    width: metadata.width,
    height: metadata.height,
    size: metadata.size && bytesToKbytes(metadata.size),
    getStream: () => createReadStream(filePath),
  };
}

function sharpAddFormatSettings(
  sharpInstance: Sharp,
  { quality }: { quality?: number }
): Sharp {
  return sharpInstance
    .jpeg({ quality, progressive: true, force: false })
    .png({
      compressionLevel: Math.floor(((quality ?? 100) / 100) * 9),
      progressive: true,
      force: false,
    })
    .webp({ quality, force: false })
    .tiff({ quality, force: false });
}

function sharpAddResizeSettings(
  sharpInstance: Sharp,
  size: ImageSize,
  factor: number
): Sharp {
  if (!size.width && !size.height) {
    throw new InvalidParametersError(
      "Either width or height must be specified"
    );
  }
  return sharpInstance.resize({
    width: size.width && size.width * factor,
    height: size.height && size.height * factor,
    fit: size.fit,
    // Position "center" cannot be set since it's the default (see: https://sharp.pixelplumbing.com/api-resize#resize).
    position: size.position === "center" ? undefined : size.position,
    withoutEnlargement: size.withoutEnlargement,
  });
}

async function writeStreamToFile(sharpsStream: Sharp, path: string) {
  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(path);
    // Reject promise if there is an error with the provided stream
    sharpsStream.on("error", reject);
    sharpsStream.pipe(writeStream);
    writeStream.on("close", resolve);
    writeStream.on("error", reject);
  });
}

async function getMetadata(readStream: ReadStream): Promise<Metadata> {
  return new Promise((resolve, reject) => {
    const sharpInstance = sharp();
    sharpInstance.metadata().then(resolve).catch(reject);
    readStream.pipe(sharpInstance);
  });
}

function getFileName(sourceFile: File, sizeName: string) {
  const fileNameWithoutExtension = sourceFile.name.replace(/\.[^\/.]+$/, "");
  return `${sizeName}_${fileNameWithoutExtension}`;
}

function getFileExtension(sourceFile: File, format: OutputFormat) {
  return format === "original" ? sourceFile.ext : `.${format}`;
}

function getFileMimeType(sourceFile: File, format: OutputFormat) {
  return format === "original" ? sourceFile.mime : `image/${format}`;
}

export default () => ({
  ...imageManipulation(),
  generateResponsiveFormats: optimizeImage,
});
