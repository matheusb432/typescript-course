import { Autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
import { DragTarget } from '../types/drag-drop.js';
import { Project, ProjectStatus } from '../types/project.js';
import Component from './base-component.js';
import { ProjectItem } from './project-item.js';

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
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

    this.renderProjects();
  }

  private renderProjects(): void | never {
    const listEl = document.getElementById(this.listId) as HTMLUListElement;

    if (!listEl) {
      throw Error(`Couldn\'t get list element with id ${this.listId}`);
    }

    this.destroyItems(listEl);

    for (const project of this.assignedProjects) {
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
