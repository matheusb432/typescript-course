enum ProjectStatus {
  Active = 'active',
  Finished = 'finished',
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus = ProjectStatus.Active
  ) {}
}

type Listener<T> = (items: T[]) => void;

abstract class State<T> {
  protected listeners: Listener<T>[] = [];

  // NOTE Implementing the observer pattern to dynamically add subscribers to this class' actions
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

// NOTE Custom state management class
class ProjectState extends State<Project> {
  //   private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor(projects: Project[]) {
    super();

    this.projects = projects;
  }

  // NOTE Implementing the singleton pattern to only use one instance of this class
  static getInstance(projects: Project[]): ProjectState {
    if (this.instance) return this.instance;

    this.instance = new ProjectState(projects);

    return this.instance;
  }

  //   addListener(listenerFn: Listener) {
  //     this.listeners.push(listenerFn);
  //   }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(`${Math.random()}`, title, description, people);

    // NOTE pushing newProject to projects also works but it's ideal to not directly mutate the state of this prop
    this.projects = [...this.projects, newProject];

    // NOTE passing a copy of this array to all subscribers so that only this class can update the state of projects
    for (const listenerFn of this.listeners) listenerFn(this.projects.slice());
  }
}

const projectState = ProjectState.getInstance([]);

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

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(templateId) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId) as T;

    const importedNode = document.importNode(this.templateElement.content, true);

    this.element = importedNode.firstElementChild as U;
    if (newElementId) this.element.id = newElementId;

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: ProjectStatus) {
    super('project-list', 'app', false, `${type}-projects`);

    this.assignedProjects = [];

    this.configure();

    this.renderContent();
  }

  get listId() {
    return `${this.type}-projects-list`;
  }

  configure() {
    // NOTE this subscription will update the reference of assignedProjects whenever ProjectState emits an event
    projectState.addListener(this.projectListener);
  }

  @Autobind
  private projectListener(projects: Project[]) {
    const relevantProjects = projects.filter((prj) => prj.status === this.type);

    this.assignedProjects = relevantProjects;

    this.renderProjects();
  }

  private renderProjects() {
    const listEl = document.getElementById(this.listId) as HTMLUListElement;

    if (!listEl) return;

    this.destroyItems(listEl);

    for (const projectItem of this.assignedProjects) {
      const listItem = document.createElement('li');

      listItem.textContent = projectItem.title;

      listEl.appendChild(listItem);
    }
  }

  private destroyItems(listEl: HTMLUListElement): void {
    listEl.innerHTML = '';
  }

  renderContent() {
    this.element.querySelector('ul')!.id = this.listId;
    this.element.querySelector('h2')!.textContent = `${this.type} projects`.toUpperCase();
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

    this.configure();
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

  renderContent(): void {}

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

    projectState.addProject(title, desc, people);

    this.clearInputs();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }
}

const projInput = new ProjectInput();
const activeProjList = new ProjectList(ProjectStatus.Active);
const finishedProjList = new ProjectList(ProjectStatus.Finished);
