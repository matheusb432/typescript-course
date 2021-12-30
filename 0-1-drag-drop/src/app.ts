/*
 NOTE importing a namespace, TS-only syntax and feature
 NOTE it's not necessary to import specific functions/interfaces, only the namespace to get access to it in the same namespace
/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />
*/

// NOTE .js for the extension name should not be present if webpack is the project bundler
// import { ProjectInput } from './components/project-input.js';

import { ProjectInput } from './components/project-input';
import { ProjectList } from './components/project-list';
import { ProjectStatus } from './types/project';

ProjectInput.initInput();
ProjectList.initList(ProjectStatus.Active);
ProjectList.initList(ProjectStatus.Finished);
