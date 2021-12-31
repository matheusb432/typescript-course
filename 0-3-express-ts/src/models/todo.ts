export class Todo {
  constructor(public id: string, public text: string) {}

  static create = (text: string) => new Todo(`${Math.round(Math.random() * 100)}`, text);
}
