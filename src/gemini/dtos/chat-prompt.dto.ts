import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class ChatPromptDto {

  @IsUUID()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsArray()
  @IsOptional()
  files: Express.Multer.File[];
}