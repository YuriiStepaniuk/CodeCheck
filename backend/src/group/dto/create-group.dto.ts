import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Group name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Group name is too long (max 50 characters)' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
