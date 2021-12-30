import { Project, ProjectStatus } from '../types/project';
import { deepClone } from '../util/utils';

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
export class ProjectState extends State<Project> {
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

// NOTE this will only execute once even if this module is imported multiple times
console.log('Initializing state...');

export const projectState = ProjectState.getInstance([]);
