import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString(
    {},
    { message: 'Due date must be a valid ISO 8601 date string' },
  )
  @IsOptional()
  dueDate?: string;

  @IsIn(['pending', 'completed'], {
    message: 'Status must be either "pending" or "completed"',
  })
  @IsOptional()
  status?: string;
}
