import { Body, Controller, Get, HttpStatus, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import express from 'express';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { GeminiService } from './gemini.service';
import { ChatPromptDto } from './dtos/chat-prompt.dto';
import { GenerateContentResponse } from '@google/genai';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) { }

  async outputStreamResponse(res: express.Response, stream: AsyncGenerator<GenerateContentResponse, any, any>) {
    // res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.status(HttpStatus.OK);
    let fullResponse = '';
    for await (const chunk of stream) {
      const piece = chunk.text;
      fullResponse += piece;
      // You can process each chunk here if needed
      res.write(piece);
    }
    res.end();
    return fullResponse;
  }

  @Post('basic-prompt')
  async basicPrompt(@Body() basicPromptDto: BasicPromptDto): Promise<any> {
    return this.geminiService.basicPrompt(basicPromptDto);
  }

  @Post('basic-prompt-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async basicPromptStream(
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: express.Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    basicPromptDto.files = files;
    const stream = await this.geminiService.basicPromptStream(basicPromptDto);
    this.outputStreamResponse(res, stream);
  }

  @Post('chat-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async chatStream(
    @Body() chatPromptDto: ChatPromptDto,
    @Res() res: express.Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    chatPromptDto.files = files;
    const stream = await this.geminiService.chatStream(chatPromptDto);
    const data = await this.outputStreamResponse(res, stream);

    const geminiMessage = { role: 'model', parts: [{ text: data }] };
    const userMessage = { role: 'user', parts: [{ text: chatPromptDto.prompt }] };
    this.geminiService.saveMessage(chatPromptDto.chatId, userMessage);
    this.geminiService.saveMessage(chatPromptDto.chatId, geminiMessage);
  }

  @Get('chat-history/:chatId')
  async getChatHistory(@Param('chatId') chatId: string): Promise<any> {
    return this.geminiService.getChatHistory(chatId).map(message => ({
      role: message.role,
      parts: message.parts?.map(part => part.text).join(''),
    }));
  }

}
