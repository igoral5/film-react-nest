import { Test } from '@nestjs/testing';

import { CreateOrderDto } from './dto/order.dto';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  const orderService = {
    createOrder: jest.fn(),
  };

  const order: CreateOrderDto = {
    email: 'user@example.com',
    phone: '+79990000000',
    tickets: [
      {
        film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
        session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 1,
        seat: 2,
        price: 350,
      },
    ],
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderService }],
    }).compile();

    controller = moduleRef.get(OrderController);
  });

  it('передаёт заказ в сервис и возвращает результат', async () => {
    const response = { total: 1, items: [] };
    orderService.createOrder.mockResolvedValue(response);

    await expect(controller.createOrder(order)).resolves.toBe(response);
    expect(orderService.createOrder).toHaveBeenCalledWith(order);
  });

  it('пробрасывает ошибку сервиса при невалидном заказе', async () => {
    orderService.createOrder.mockRejectedValue(new Error('Seat is taken'));

    await expect(controller.createOrder(order)).rejects.toThrow(
      'Seat is taken',
    );
  });
});
