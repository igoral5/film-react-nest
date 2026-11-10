import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty({
    description: 'Описание ошибки',
    example: 'Film not found',
  })
  error: string;
}
