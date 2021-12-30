// NOTE import alias, only use to avoid name clashes as it can make the code a bit more confusing
import { Autobind as autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
// NOTE any exports from this file will be acessible with Validation.{exported item}
import * as Validation from '../util/validation.js';
import Component from './base-component.js';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLTextAreaElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', false, 'user-input');

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLTextAreaElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
  }

  static initInput() {
    // TODO rename to more descriptive after modules refactor is realized
    const pInput = new ProjectInput();

    pInput.configure();

    return pInput;
  }

  private gatherUserInput(): [string, string, number] | void {
    const titleValue = this.titleInputElement.value;
    const descriptionValue = this.descriptionInputElement.value;
    const peopleValue = +this.peopleInputElement.value;

    if (
      !Validation.validate({ value: titleValue, required: true }) ||
      !Validation.validate({ value: descriptionValue, required: true, minLength: 5 }) ||
      !Validation.validate({ value: peopleValue, required: true, min: 1, max: 5 })
    ) {
      alert('Invalid input!');

      return;
    }

    return [titleValue, descriptionValue, peopleValue];
  }

  renderContent(): void {}

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();

    const userInput = this.gatherUserInput();

    if (!Array.isArray(userInput)) return;

    const [title, desc, people] = userInput;

    projectState.addProject(title, desc, people);

    this.clearInputs();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }
}
