import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

import { ErrorDto } from '../common/dto/error.dto';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({
    description:
      'Невалидные контактные данные или билеты, несуществующий фильм/сеанс, место вне зала или уже занятое место',
    type: ErrorDto,
  })
  createOrder(@Body() order: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.createOrder(order);
  }
}
