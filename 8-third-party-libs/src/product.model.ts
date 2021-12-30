import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class Product {
  // NOTE validation decorators from the class-validator npm package
  @IsNotEmpty()
  title: string;
  @IsNumber()
  @IsPositive()
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }

  getInformation() {
    return [this.title, `$${this.price}`];
  }
}
