/*
 NOTE importing a namespace, TS-only syntax and feature
 NOTE it's not necessary to import specific functions/interfaces, only the namespace to get access to it in the same namespace
/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />
*/

import { ProjectInput } from './components/project-input.js';
import { ProjectList } from './components/project-list.js';
import { ProjectStatus } from './types/project.js';

ProjectInput.initInput();
ProjectList.initList(ProjectStatus.Active);
ProjectList.initList(ProjectStatus.Finished);
