import { IsNotEmpty } from 'class-validator';

export class CreateTaskWithAiDto {
  @IsNotEmpty()
  message: string;
}

