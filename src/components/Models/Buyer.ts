import { IBuyer } from '../../types';

export class Buyer {
  private buyer: IBuyer = {
    payment: '' as IBuyer['payment'],
    email: '',
    phone: '',
    address: '',
  };

  setPayment(payment: IBuyer['payment']): void {
    this.buyer.payment = payment;
  }

  setEmail(email: string): void {
    this.buyer.email = email;
  }

  setPhone(phone: string): void {
    this.buyer.phone = phone;
  }

  setAddress(address: string): void {
    this.buyer.address = address;
  }

  setBuyer(data: Partial<IBuyer>): void {
    this.buyer = {
      ...this.buyer,
      ...data,
    };
  }

  getBuyer(): IBuyer {
    return this.buyer;
  }

  clear(): void {
    this.buyer = {
      payment: '' as IBuyer['payment'],
      email: '',
      phone: '',
      address: '',
    };
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