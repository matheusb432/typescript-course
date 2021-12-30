import { Autobind } from '../decorators/autobind';
import { Draggable } from '../types/drag-drop';
import { Project } from '../types/project';
import Component from './base-component';

export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
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
  dragEndHandler(_: DragEvent): void {}

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
