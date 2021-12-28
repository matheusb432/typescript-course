// NOTE target in this case is the class' constructor function
// NOTE The decorator factory can be written like this if it's only needed parameter is the constructor function
// function Logger(target: Function) {
//   console.log('Logging...');
//
//   console.log(target);
// }

// NOTE now this decorator factory can accept parameters when it's called
function Logger(logString: string) {
  console.log('Logger start');
  return function (target: Function) {
    console.log('Executing Logger');
    console.log(logString);

    console.log(target);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log('WithTemplate start');
  return (constructor: new (...args: any[]) => any) => {
    console.log('Executing WithTemplate');
    const hookEl = document.getElementById(hookId);

    const ctorObject = new constructor();

    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent = ctorObject.name;
    }
  };
}

// NOTE the order of execution of the decorators is bottom up, meaning the functions will execute in WithTemplate - Logger order
// * but the factory functions themselves run top down.
@Logger('LOGGING - PERSON')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating Person object...');
  }
}

const person = new Person();

console.log(person);

// NOTE decorator factory for an instance property
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property Log decorator');
  console.log(target, propertyName);
}

// NOTE acessor decorator factory
function Log2(target: any, propertyName: string | Symbol, descriptor: PropertyDescriptor) {
  console.log('Acessor decorator!');
  console.log(target);
  console.log(propertyName);
  console.log(descriptor);
}

// NOTE method decorator factory
function Log3(target: any, methodName: string | Symbol, descriptor: PropertyDescriptor) {
  console.log('Method decorator!');
  console.log(target);
  console.log(methodName);
  console.log(descriptor);
}

// NOTE parameter decorator factory, position is the index of the parameter
function Log4(target: any, paramName: string | Symbol, position: number) {
  console.log('Parameter decorator!');
  console.log(target);
  console.log(paramName);
  console.log(position);
}

// NOTE all below decorators execute at class definition, not at object instantiation
class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price, price should be positive!');
    }
  }

  constructor(title: string, price: number) {
    this.title = title;
    this._price = price;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

const p1 = new Product('Book', 19);
const p2 = new Product('Book 2', 29);
