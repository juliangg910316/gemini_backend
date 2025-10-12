import { Content, createPartFromUri, GoogleGenAI } from "@google/genai";
import { ChatPromptDto } from "../dtos/chat-prompt.dto";
import { geminiUploadFiles } from "../helpers/gemini-upload-file";

interface Options {
    model?: string;
    systemInstruction?: string;
    history: Content[];
}

export const chatPromptStreamUseCase = async (ai: GoogleGenAI, chatPromptDto: ChatPromptDto, options?: Options) => {
    const { prompt, files = [] } = chatPromptDto;
    const uploadedFiles = await geminiUploadFiles(ai, files);
    const {
        model = "gemini-2.5-flash",
        history = [],
        systemInstruction = `
        Responde únicamente en Español,
        en formato Markdown, 
        con un tono profesional y amigable,
        usa el sistema métrico decimal
        .`
    } = options || {};
    const chat = ai.chats.create({
        model,
        config: {
            systemInstruction: systemInstruction,
        },
        history,
    });
    return await chat.sendMessage({
        message: [prompt, ...uploadedFiles.map((file) => createPartFromUri(
            file.uri ?? '', file.mimeType ?? ''
        ),)],
    });
}
