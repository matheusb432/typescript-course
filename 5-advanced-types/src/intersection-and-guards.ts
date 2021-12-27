type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

// interface ElevatedEmployee extends Employee, Admin {}

// NOTE intersection types, can combine many object types together into one
// NOTE equivalent to an interface which extends these two types
type ElevatedEmployee = Admin & Employee;

const elevatedEmployee: ElevatedEmployee = {
  name: 'Max',
  privileges: ['create-server'],
  startDate: new Date(),
};

type Combinable = string | number;
type Numeric = number | boolean;

// NOTE in this case, the intersection of these two types will be only `number`
type Universal = Combinable & Numeric;

// NOTE TypeScript function overload, specifies that given those param types, the return will be of said type
function add(a: string, b: string): string;
function add(a: number, b: number): number;
function add(a: Combinable, b: Combinable) {
  // NOTE type guard, forces type safety to union types
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }

  return a + b;
}

// NOTE with the function overloads, TS can now correctly infer the return types of these values
const resultNum = add(1, 5);
const resultStr = add('Hello ', 'World');

console.log(resultNum);
console.log(resultStr);

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  // NOTE doesn't thrown any errors since both of the union types have this prop
  console.log(`Name: ${emp.name}`);

  // NOTE type guard equivalent on custom objects, code will only run if the prop exists `in` the object.
  if ('privileges' in emp) {
    console.log(`Privileges: ${emp.privileges}`);
  }

  if ('startDate' in emp) {
    console.log(`Start Date: ${emp.startDate}`);
  }
}

class Car {
  drive() {
    console.log('driving...');
  }
}

class Truck {
  drive() {
    console.log('DRIVING...');
  }

  loadCargo(amount: number) {
    console.log(`Loading cargo ... ${amount}`);
  }
}

type Vehicle = Car | Truck;

const car = new Car();
const truck = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();

  // * also works
  //   if ('loadCargo' in vehicle) {
  // NOTE Pure JS way of knowing if an object is an instance of a class, compares constructor functions
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(car);
useVehicle(truck);
