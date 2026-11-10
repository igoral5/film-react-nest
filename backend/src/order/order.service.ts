import { BadRequestException, Injectable } from '@nestjs/common';

import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto, OrderResponseDto, TicketDto } from './dto/order.dto';

interface SeatsGroup {
  filmId: string;
  scheduleId: string;
  seats: string[];
}

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(order: CreateOrderDto): Promise<OrderResponseDto> {
    const tickets = order?.tickets ?? [];

    if (tickets.length === 0) {
      throw new BadRequestException({ error: 'Tickets are not specified' });
    }

    const groups = new Map<string, SeatsGroup>();

    for (const ticket of tickets) {
      const film = await this.filmsRepository.findById(ticket.film);

      if (!film) {
        throw new BadRequestException({
          error: `Film ${ticket.film} not found`,
        });
      }

      const schedule = film.schedule.find((item) => item.id === ticket.session);

      if (!schedule) {
        throw new BadRequestException({
          error: `Schedule ${ticket.session} not found`,
        });
      }

      this.checkPlace(ticket, schedule.rows, schedule.seats);

      const seat = `${ticket.row}:${ticket.seat}`;
      const groupId = `${film.id}:${schedule.id}`;
      const group = groups.get(groupId) ?? {
        filmId: film.id,
        scheduleId: schedule.id,
        seats: [],
      };

      if (schedule.taken.includes(seat) || group.seats.includes(seat)) {
        throw new BadRequestException({
          error: `Seat ${seat} is already taken`,
        });
      }

      group.seats.push(seat);
      groups.set(groupId, group);
    }

    for (const group of groups.values()) {
      const isBooked = await this.filmsRepository.takeSeats(
        group.filmId,
        group.scheduleId,
        group.seats,
      );

      if (!isBooked) {
        throw new BadRequestException({ error: 'Seats are already taken' });
      }
    }

    return new OrderResponseDto(tickets);
  }

  private checkPlace(ticket: TicketDto, rows: number, seats: number): void {
    const isRowValid =
      Number.isInteger(ticket.row) && ticket.row >= 1 && ticket.row <= rows;
    const isSeatValid =
      Number.isInteger(ticket.seat) && ticket.seat >= 1 && ticket.seat <= seats;

    if (!isRowValid || !isSeatValid) {
      throw new BadRequestException({
        error: `Place ${ticket.row}:${ticket.seat} does not exist`,
      });
    }
  }
}
