import { ReadStream } from "fs";

export interface File {
  name: string;
  hash: string;
  mime: string;
  path?: string;
  ext: string;
  width?: number;
  height?: number;
  size?: number;
  getStream: () => ReadStream;
}

export interface SourceFile extends File {
  tmpWorkingDirectory: string;
}
