import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from "../dtos/basic-prompt.dto";

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const basicPromptStreamUseCase = async (ai: GoogleGenAI, basicPromptDto: BasicPromptDto, options?: Options) => {
    const { prompt, files = [] } = basicPromptDto;
    const images = await Promise.all(
        files.map(async (file) => {
            return await ai.files.upload({
                file: new Blob([Uint8Array.from(file.buffer)], { type: file.mimetype.includes('image') ? file.mimetype : 'image/jpg' }),
            });
        })
    );
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
