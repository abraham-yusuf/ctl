import { writeFile } from "fs/promises";
import Printer from "../printer";
import generateSolutionKey from "../services/generateSolutionKey";

export type GenerateSolutionKeyParams = {
    outputPath: string;
};

export default async (params: GenerateSolutionKeyParams) => {
    Printer.print("Generating solution key...");

    const solutionKay = await generateSolutionKey();

    Printer.print("Writing solution key to " + params.outputPath);

    await writeFile(params.outputPath, solutionKay);

    Printer.print("Generated successfully.");
};
