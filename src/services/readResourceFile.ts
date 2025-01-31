import z, { ZodError } from "zod";
import {
    CryptoAlgorithm,
    Encoding,
    Encryption,
    Hash,
    HashAlgorithm,
    Linkage,
    Resource,
    ResourceType,
    StorageType,
} from "@super-protocol/dto-js";
import readJsonFile from "./readJsonFile";
import { createZodErrorMessage, ErrorWithCustomMessage } from "../utils";

export type ReadResourceFileParams = {
    path: string;
};

export type ResourceFile = {
    resource: Resource;
    encryption?: Encryption;
    linkage?: Linkage;
    hash?: Hash;
    args?: any;
};

const ResourceFileValidator = z.object({
    resource: z
        .object({
            type: z.enum([ResourceType.Url]),
            url: z.string().min(1),
        })
        .or(
            z.object({
                type: z.enum([ResourceType.StorageProvider]),
                storageType: z.nativeEnum(StorageType),
                filepath: z.string(),
                credentials: z.any(),
            })
        ),
    encryption: z
        .object({
            algo: z.nativeEnum(CryptoAlgorithm),
            encoding: z.nativeEnum(Encoding),
            key: z.string(),
        })
        .optional(),
    linkage: z
        .object({
            encoding: z.nativeEnum(Encoding),
            mrenclave: z.string(),
        })
        .optional(),
    hash: z
        .object({
            algo: z.nativeEnum(HashAlgorithm),
            hash: z.string(),
            encoding: z.nativeEnum(Encoding),
        })
        .optional(),
    args: z.any().optional(),
});

const readResourceFile = async (params: ReadResourceFileParams): Promise<ResourceFile> => {
    let resourceFile = await readJsonFile(params);

    try {
        await ResourceFileValidator.parseAsync(resourceFile);
    } catch (error) {
        const errorMessage = createZodErrorMessage((error as ZodError).issues);
        throw ErrorWithCustomMessage(
            `Invalid Resource format of file ${params.path}:\n${errorMessage}`,
            error as Error
        );
    }

    return resourceFile;
};

export default readResourceFile;
