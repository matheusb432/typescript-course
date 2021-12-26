let userInput: unknown;
let userName: string;

userInput = 5;
userInput = 'Matt';

// NOTE the type check is necessary for TS to not throw compilation errors, since a `string` can't be assigned to `unknown`
if (typeof userInput === 'string') userName = userInput;

// NOTE the `never` type specifies that this function will never return anything
function generateError(message: string, errorCode: number): never {
  throw { message, errorCode };
}

function infiniteLoop(): never {
  while (true) {}
}

// NOTE since generateError() always throws an error, output will never get it's return
const output = generateError('An error ocurred!', 500);

console.log(output);
