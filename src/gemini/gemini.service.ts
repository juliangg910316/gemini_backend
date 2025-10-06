import { GoogleGenAI } from "@google/genai";
import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { basicPromptUseCase } from "./use-cases/basic-prompt.use-case";

@Injectable()
export class GeminiService {
    private ai = new GoogleGenAI({});
    async basicPrompt(basicPromptDto: BasicPromptDto): Promise<any> {
        return basicPromptUseCase(this.ai, basicPromptDto);
    }
}
