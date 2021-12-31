// NOTE type aliases that are useful when using union types to avoid code duplication
type Combinable = number | string;
type ConversionDescriptor = 'as-number' | 'as-text';

function combine(
  // NOTE union types specify that a value can be any one of the defined union types
  input1: Combinable,
  input2: Combinable,
  //  NOTE literal types that specify only specific value types, in this case it can only have any of those two values
  resultConversion: ConversionDescriptor
) {
  let result;
  if (
    (typeof input1 === 'number' && typeof input2 === 'number') ||
    resultConversion === 'as-number'
  ) {
    result = +input1 + +input2;
  } else {
    result = input1.toString() + input2.toString();
  }
  return result;
  // if (resultConversion === 'as-number') {
  //   return +result;
  // } else {
  //   return result.toString();
  // }
}

const combinedAges = combine(30, 26, 'as-number');
console.log(combinedAges);

const combinedStringAges = combine('30', '26', 'as-number');
console.log(combinedStringAges);

const combinedNames = combine('Max', 'Anna', 'as-text');
console.log(combinedNames);
