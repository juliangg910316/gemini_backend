import { Body, Controller, HttpStatus, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FilesInterceptor('files'))
  async basicPromptStream(
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: express.Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    basicPromptDto.files = files;
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
