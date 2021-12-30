export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// NOTE with the union type and the type guard, can check if a string or a number is empty
function isEmpty(val: string | number) {
  if (typeof val === 'number') return val == null;

  return !val || val.trim().length === 0;
}

// NOTE validator function for reusable validation logic
export function validate(validatableInput: Validatable): boolean {
  if (validatableInput == null) return false;

  let isValid = true;

  const { value, required, minLength, maxLength, min, max } = validatableInput;

  if (required) {
    // NOTE &&= short circuit operator is equivalent to isValid = isValid && ...
    isValid &&= !isEmpty(value);
  }

  if (minLength != null && typeof value === 'string') {
    isValid &&= value.length >= minLength;
  }

  if (maxLength != null && typeof value === 'string') {
    isValid &&= value.length <= maxLength;
  }

  if (min != null && typeof value === 'number') {
    isValid &&= value >= min;
  }

  if (max != null && typeof value === 'number') {
    isValid &&= value <= max;
  }

  return isValid;
}
