import { BreadCrumb } from './models/breadcrumb';

export class SetApplicationUrl {
  static readonly type = '[Configuration] Set Application Url';
  constructor(public readonly breadCrumb: BreadCrumb[]) {}
}

export class UpdateApplicationUrl {
  static readonly type = '[Configuration] Update Application Url';
  constructor(public readonly breadcrumbInfo: BreadCrumb[]) {}
}
