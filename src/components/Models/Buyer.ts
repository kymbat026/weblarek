import { IBuyer } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
  private buyer: IBuyer = {
    payment: null,
    email: '',
    phone: '',
    address: '',
  };

  constructor(private events: IEvents) {}

  setPayment(payment: IBuyer['payment']): void {
    this.buyer.payment = payment;
    this.events.emit('buyer:changed');
  }

  setEmail(email: string): void {
    this.buyer.email = email;
    this.events.emit('buyer:changed');
  }

  setPhone(phone: string): void {
    this.buyer.phone = phone;
    this.events.emit('buyer:changed');
  }

  setAddress(address: string): void {
    this.buyer.address = address;
    this.events.emit('buyer:changed');
  }

  getBuyer(): IBuyer {
    return this.buyer;
  }

  clear(): void {
    this.buyer = {
      payment: null,
      email: '',
      phone: '',
      address: '',
    };
    this.events.emit('buyer:changed');
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.buyer.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this.buyer.email) {
      errors.email = 'Не указан email';
    }

    if (!this.buyer.phone) {
      errors.phone = 'Не указан телефон';
    }

    if (!this.buyer.address) {
      errors.address = 'Не указан адрес';
    }

    return errors;
  }
}