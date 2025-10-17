import { Content, GoogleGenAI } from "@google/genai";
import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { ChatPromptDto } from "./dtos/chat-prompt.dto";
import { ImageGenerationDto } from "./dtos/image-generation.dto";
import { basicPromptStreamUseCase } from "./use-cases/basic-prompt-stream.use-case";
import { basicPromptUseCase } from "./use-cases/basic-prompt.use-case";
import { chatPromptStreamUseCase } from "./use-cases/chat-prompt-stream.use-case";
import { imageGenerationUseCase } from "./use-cases/image-generation.use-case";

@Injectable()
export class GeminiService {
    private ai = new GoogleGenAI({});

    private chatHistory = new Map<string, Content[]>();

    async basicPrompt(basicPromptDto: BasicPromptDto): Promise<any> {
        return basicPromptUseCase(this.ai, basicPromptDto);
    }

    async basicPromptStream(basicPromptDto: BasicPromptDto): Promise<any> {
        return basicPromptStreamUseCase(this.ai, basicPromptDto);
    }

    async chatStream(chatPromptDto: ChatPromptDto): Promise<any> {
        const chatHistory = this.getChatHistory(chatPromptDto.chatId);
        return chatPromptStreamUseCase(this.ai, chatPromptDto, { history: chatHistory });
    }

    saveMessage(chatId: string, message: Content) {
        const history = this.getChatHistory(chatId);
        history.push(message);
        this.chatHistory.set(chatId, history);
    }

    getChatHistory(chatId: string) {
        return structuredClone(this.chatHistory.get(chatId) ?? []);
    }

    imageGeneration(imageGenerationDto: ImageGenerationDto) {
        return imageGenerationUseCase(this.ai, imageGenerationDto);
    }
}