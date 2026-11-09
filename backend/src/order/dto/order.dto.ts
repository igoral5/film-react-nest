import { randomUUID } from 'node:crypto';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

const PHONE_PATTERN = /^\+7\d{10}$/;

export class TicketDto {
  @IsString()
  @IsNotEmpty()
  film: string;

  @IsString()
  @IsNotEmpty()
  session: string;

  @IsString()
  @IsNotEmpty()
  daytime: string;

  @IsInt()
  @Min(1)
  row: number;

  @IsInt()
  @Min(1)
  seat: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(PHONE_PATTERN, {
    message: 'phone must be +7 followed by 10 digits',
  })
  phone: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class OrderResultDto extends TicketDto {
  id: string;

  constructor(ticket: TicketDto) {
    super();
    this.film = ticket.film;
    this.session = ticket.session;
    this.daytime = ticket.daytime;
    this.row = ticket.row;
    this.seat = ticket.seat;
    this.price = ticket.price;
    this.id = randomUUID();
  }
}

export class OrderResponseDto {
  total: number;
  items: OrderResultDto[];

  constructor(tickets: TicketDto[]) {
    this.items = tickets.map((ticket) => new OrderResultDto(ticket));
    this.total = this.items.length;
  }
}
