import { Body, Controller, Post } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('basic-prompt')
  async basicPrompt(@Body() basicPromptDto: BasicPromptDto): Promise<any> {
    // const apiKey = process.env.GEMINI_API_KEY;
    // const apiSecret = process.env.GEMINI_API_SECRET;

    return this.geminiService.basicPrompt(basicPromptDto);
  }
}
