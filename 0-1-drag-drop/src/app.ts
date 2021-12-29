interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

enum ProjectStatus {
  Active = 'active',
  Finished = 'finished',
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
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

// NOTE abstract class to manage state using the Observer (or Pub/Sub) design pattern
abstract class State<T> {
  protected listeners: Listener<T>[] = [];

  // NOTE Implementing the observer pattern to dynamically add subscribers to this class' actions
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }

  // NOTE notifying all current listeners by executing every registered listener function
  notifyListeners(items: T[]) {
    for (const listenerFn of this.listeners) listenerFn(items);
  }
}

// NOTE Custom state management class
class ProjectState extends State<Project> {
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

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(`${Math.random()}`, title, description, people);

    // NOTE pushing newProject to projects also works but it's ideal to not directly mutate the state of this prop
    this.projects = [...this.projects, newProject];

    // NOTE passing a copy of this array to all subscribers so that only this class can update the state of projects
    this.notifyProjectListeners();
  }

  moveProject(id: string, status: ProjectStatus) {
    const [project, projectIndex] = this.getDropProject(id);

    if (project == null || projectIndex === -1 || project.status === status) return;

    project.status = status;

    this.projects[projectIndex] = deepClone(project);

    this.notifyProjectListeners();
  }

  private notifyProjectListeners() {
    this.notifyListeners(this.projects.slice());
  }

  private getDropProject(id: string): [Project | undefined, number] {
    const project = this.projects.find((prj) => prj.id === id);
    const projectIndex = this.projects.findIndex((prj) => prj === project);

    return [project, projectIndex];
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

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;

  get persons(): string {
    return this.project.people === 1 ? '1 person' : `${this.project.people} persons`;
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);

    this.project = project;
  }

  // NOTE the course code had configure() and renderContent() calls in the constructor, but I've written this method since they were side effects that make this class more coupled.
  static initItem(hostId: string, project: Project): ProjectItem {
    const projectItem = new ProjectItem(hostId, project);

    projectItem.configure();
    projectItem.renderContent();

    return projectItem;
  }

  @Autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id);

    event.dataTransfer!.effectAllowed = 'move';
  }

  @Autobind
  dragEndHandler(event: DragEvent): void {
    console.log(event.dataTransfer);
    console.log('Drag End');
  }

  // NOTE configuring drag and drop event listeners
  configure(): void {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = `${this.persons} assigned`;
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: ProjectStatus) {
    super('project-list', 'app', false, `${type}-projects`);

    this.assignedProjects = [];
  }

  static initList(type: ProjectStatus = ProjectStatus.Active) {
    const projectList = new ProjectList(type);

    projectList.configure();
    projectList.renderContent();

    return projectList;
  }

  @Autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer?.types[0] !== 'text/plain') return;

    event.preventDefault();

    const listEl = this.element.querySelector('ul')!;

    listEl.classList.add('droppable');
  }

  @Autobind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData('text/plain');

    projectState.moveProject(projectId, this.type);
  }

  @Autobind
  dragLeaveHandler(_event: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;

    listEl.classList.remove('droppable');
  }

  get listId() {
    return `${this.type}-projects-list`;
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    // NOTE this subscription will update the reference of assignedProjects whenever ProjectState emits an event
    projectState.addListener(this.projectListener);
  }

  @Autobind
  private projectListener(projects: Project[]) {
    const relevantProjects = projects.filter((prj) => prj.status === this.type);

    this.assignedProjects = relevantProjects;

    console.log(this.assignedProjects);

    this.renderProjects();
  }

  private renderProjects(): void | never {
    const listEl = document.getElementById(this.listId) as HTMLUListElement;

    if (!listEl) {
      throw Error(`Couldn\'t get list element with id ${this.listId}`);
    }

    this.destroyItems(listEl);

    for (const project of this.assignedProjects) {
      // NOTE the project items will be rendered at instantiation, so even if the references of these objects are lost, the elements are still correctly rendered.
      // new ProjectItem(listEl.id, projectItem);
      ProjectItem.initItem(listEl.id, project);
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

const projectInput = ProjectInput.initInput();
const activeProjectList = ProjectList.initList(ProjectStatus.Active);
const finishedProjectList = ProjectList.initList(ProjectStatus.Finished);
