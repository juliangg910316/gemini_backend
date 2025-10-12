import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from "../dtos/basic-prompt.dto";
import { geminiUploadFiles } from "../helpers/gemini-upload-file";

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const basicPromptStreamUseCase = async (ai: GoogleGenAI, basicPromptDto: BasicPromptDto, options?: Options) => {
    const { prompt, files = [] } = basicPromptDto;
    const images = await geminiUploadFiles(ai, files);
    const {
        model = "gemini-2.5-flash",
        systemInstruction = `
        Responde únicamente en Español,
        en formato Markdown, 
        con un tono profesional y amigable,
        usa el sistema métrico decimal
        .`
    } = options || {};
    const response = await ai.models.generateContentStream({
        model,
        // contents: basicPromptDto.prompt,
        contents: [
            createUserContent([
                prompt,
                ...images.map(image => createPartFromUri(image.uri ?? '', image.mimeType ?? ''))
            ])
        ],
        config: { systemInstruction }
    });
    return response;
}
