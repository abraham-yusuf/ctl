import { getStorageProvider, StorageAccess } from "@super-protocol/sp-sdk-js";
import { pipeline } from "stream/promises";
import * as fs from "fs";

export default async (
    remotePath: string,
    localPath: string,
    storageAccess: StorageAccess,
    progressListener?: (total: number, current: number) => void
) => {
    const storageProvider = getStorageProvider(storageAccess);
    const downloaderStream = await storageProvider.downloadFile(remotePath, {}, progressListener);
    await pipeline(downloaderStream, fs.createWriteStream(localPath));
};
