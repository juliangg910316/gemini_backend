import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';

@Injectable()
export class GeminiService {
    async basicPrompt(basicPromptDto: BasicPromptDto): Promise<any> {
        // Aquí iría la lógica para interactuar con la API de Gemini usando apiKey y apiSecret
        return { message: 'Lógica de Gemini no implementada aún', prompt: basicPromptDto.prompt };
    }
}
