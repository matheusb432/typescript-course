interface Validatable {
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
function validate(validatableInput: Validatable): boolean {
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

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      return originalMethod.bind(this);
    },
  };

  return adjustedDescriptor;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLTextAreaElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input') as HTMLTemplateElement;
    this.hostElement = document.getElementById('app') as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);

    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLTextAreaElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const titleValue = this.titleInputElement.value;
    const descriptionValue = this.descriptionInputElement.value;
    const peopleValue = +this.peopleInputElement.value;

    if (
      !validate({ value: titleValue, required: true }) ||
      !validate({ value: descriptionValue, required: true, minLength: 5 }) ||
      !validate({ value: peopleValue, required: true, min: 1, max: 5 })
    ) {
      alert('Invalid input!');

      return;
    }

    return [titleValue, descriptionValue, peopleValue];
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();

    const userInput = this.gatherUserInput();

    if (!Array.isArray(userInput)) return;

    const [title, desc, people] = userInput;

    this.clearInputs();

    console.log(title, desc, people);
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const projInput = new ProjectInput();
