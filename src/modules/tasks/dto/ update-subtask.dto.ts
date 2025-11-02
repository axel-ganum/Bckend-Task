import { PartialType } from '@nestjs/mapped-types';
import { Subtask } from '../entities/subtask.entity';

export class UpdateSubtaskDto extends PartialType(Subtask) {}