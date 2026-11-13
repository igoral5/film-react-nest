import { BadRequestException, Injectable } from '@nestjs/common';

import {
  FilmsRepository,
  SeatReservation,
} from '../repository/films.repository';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(order: CreateOrderDto): Promise<OrderResponseDto> {
    const tickets = order?.tickets ?? [];

    if (tickets.length === 0) {
      throw new BadRequestException({ error: 'Tickets are not specified' });
    }

    const reservations: SeatReservation[] = tickets.map((ticket) => ({
      filmId: ticket.film,
      scheduleId: ticket.session,
      row: ticket.row,
      seat: ticket.seat,
    }));

    await this.filmsRepository.takeSeats(reservations);

    return new OrderResponseDto(tickets);
  }
}
