// NOTE defining a namespace is a way to separate the app into modules
namespace App {
  export enum ProjectStatus {
    Active = 'active',
    Finished = 'finished',
  }

  export class Project {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public people: number,
      public status: ProjectStatus = ProjectStatus.Active
    ) {}
  }
}
