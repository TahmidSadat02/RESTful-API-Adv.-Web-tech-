import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to CoffeeShop!',
      template: './welcome', // Matches welcome.hbs
      context: {
        name: name,
      },
    });
  }

  async sendOrderConfirmation(
    email: string,
    name: string,
    orderId: number,
    total: number,
    items: any[],
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Order Confirmation - #${orderId}`,
      template: './order-confirmation',
      context: {
        customerName: name,
        orderId: orderId,
        totalPrice: total.toFixed(2),
        items: items,
      },
    });
  }

  async sendOrderStatusUpdate(
    email: string,
    name: string,
    orderId: number,
    status: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Your Order is ${status.toUpperCase()} - #${orderId}`, // Required subject format
      template: './order-status',
      context: {
        customerName: name,
        orderId: orderId,
        status: status,
      },
    });
  }
}
