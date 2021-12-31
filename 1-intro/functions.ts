// NOTE explicit function return types
function add(n1: number, n2: number): number {
  return n1 + n2;
}

// NOTE void is a TS only type, that specifies that a function has no return, same as in many other programming languagesc
function printResult(num: number): void {
  console.log(`Result: ${num}`);
}

// NOTE The `=> void` in this context doesn't enforce that the callback shouldn't return anything, but rather that this function will not do anything with it's return.
function addAndHandle(n1: number, n2: number, callback: (num: number) => void) {
  const result = n1 + n2;

  callback(result);
}

// NOTE technically the type that is returned from this function is `undefined`, but TS still interprets it as the `void` type
printResult(add(5, 12));

// let combineValues: Function;
// NOTE function types, using the arrow function notation that specifies what params it can receive and what it returns
let combineValues: (a: number, b: number) => number;

combineValues = add;
// NOTE since combineValues' type is that of a function with 2 number params and a return of number, printResult can't be assigned here
// combineValues = printResult;

console.log(combineValues(8, 8));

// NOTE with the function type defined, it's possible to pass a callback as a parameter with type safety
addAndHandle(10, 20, (result) => {
  console.log(`Handling ${result}...`);
});
