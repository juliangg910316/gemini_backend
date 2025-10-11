import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import express from 'express';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) { }

  @Post('basic-prompt')
  async basicPrompt(@Body() basicPromptDto: BasicPromptDto): Promise<any> {
    return this.geminiService.basicPrompt(basicPromptDto);
  }

  @Post('basic-prompt-stream')
  async basicPromptStream(
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: express.Response,
    //TODO: files,
  ): Promise<any> {
    const stream = await this.geminiService.basicPromptStream(basicPromptDto);
    // res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.text;
      console.log('piece', piece);
      // You can process each chunk here if needed
      res.write(piece);
    }
    res.end();
    // return { message: 'Stream ended' };
  }
}
