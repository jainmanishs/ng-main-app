// export interface Settings {
//     title: string;
//     gridRow: number;
//     gridCol: number;
//     type:string;
//     width: number;
//     height: number;
//     maxHeight: number;
//     maxWidth: number;
//     minHeight: number;
//     minWidth: number;
//     dataUrl: string;
//     primaryColor: string;

import { GridsterItem } from 'angular-gridster2/lib/gridsterItem.interface';
import { GridsterItemComponentInterface } from 'angular-gridster2';
import { v4 as uuidv4 } from 'uuid';
import { DateRangeParameters } from './etc.model';

// }
export interface DashboardType {
  fontSize?: 'small' | 'medium' | 'large';
  type: string;
  title: string;
  img: string;
  selected: boolean;
  cols: number;
  rows: number;
  minItemCols?: number;
  minItemRows?: number;
  maxItemCols?: any;
  maxItemRows?: any;
  api?: string;
  firstValue?: TabFilterForWidget;
  secondValue?: TabFilterForWidget;
  filters?: AdditionalFilter[];

}
export interface SettingsUser {
  title?: string;
  row: number;
  col: number;
  sizeX: number;
  sizeY: number;
  filter?: string;
  primaryColor?: string;
}
export class SVDetailSettings {
 dateRange:DateRangeParameters;
}
export interface TabFilterForWidget {
  onlyMyPNs?: boolean,
  partNumbersFilterOptions?: string;
  formula?: string;
  // reviewStatus?: EnumReviewedStatus;
  partNumbers?: string;
  view?: string;
  weeks?: number;
  allowMultiple?: boolean;
  filters?: AdditionalFilter[];

}
export interface AdditionalFilter {
  field: string;
  operator: string;
  value: any;
}
export interface PanelCache {
 key:string;
 value:string;
}
export class DashboardPanelModel implements GridsterItem {
  static isFilterSet(filter: TabFilterForWidget): boolean {
    if (filter) { return (filter.onlyMyPNs || filter.partNumbers || filter.formula) ? true : false }
    else {
      return false;
    }
  }
  static copySettingToDashboardWidget(dashboardPanelModel: DashboardPanelModel, uiModel: DashboardPanelModel) {
    // following commented ones are not used right now
    // dashboardPanelModel.dragEnabled=uiModel.dragEnabled;
    // dashboardPanelModel.resizeEnabled=uiModel.resizeEnabled;
    // dashboardPanelModel.compactEnabled=uiModel.compactEnabled;
    // dashboardPanelModel.maxItemRows=uiModel.maxItemRows;
    // dashboardPanelModel.minItemRows=uiModel.minItemRows;
    // dashboardPanelModel.maxItemCols=uiModel.maxItemCols;
    // dashboardPanelModel.minItemCols=uiModel.minItemCols;
    // dashboardPanelModel.minItemArea=uiModel.minItemArea;
    // dashboardPanelModel.maxItemArea=uiModel.maxItemArea;

    dashboardPanelModel.fontSize = uiModel.fontSize || 'medium';
    dashboardPanelModel.title = uiModel.title;
    dashboardPanelModel.type = uiModel.type;
    dashboardPanelModel.link = uiModel.link;
    dashboardPanelModel.header = uiModel.header;
    dashboardPanelModel.dataUrl = uiModel.dataUrl;
    dashboardPanelModel.primaryColor = uiModel.primaryColor;
    dashboardPanelModel.settingsUser = uiModel.settingsUser;
    dashboardPanelModel.data = uiModel.data;
    dashboardPanelModel.filterType = uiModel.filterType;
    dashboardPanelModel.content = uiModel.content;

    // dashboardPanelModel.filterOptions = uiModel.filterOptions;
    dashboardPanelModel.filters = uiModel.filters;
    dashboardPanelModel.firstValue = uiModel.firstValue;
    dashboardPanelModel.secondValue = uiModel.secondValue;

    dashboardPanelModel.panelCache = uiModel.panelCache;
    dashboardPanelModel.allowPrecalculations=uiModel.allowPrecalculations;
    dashboardPanelModel.allowSystemHealth=uiModel.allowSystemHealth;
    //A2
    // don't copy following as this will conflict with dashboard settings, placement and size should be decided by dashboard and not widget
    // dashboardPanelModel.x = uiModel.x;
    // dashboardPanelModel.y = uiModel.y;
    // dashboardPanelModel.rows = uiModel.rows;
    // dashboardPanelModel.cols = uiModel.cols;

  }
  firstValue?: TabFilterForWidget;
  secondValue?: TabFilterForWidget;
  filters?: AdditionalFilter[];
  fontSize?: 'small' | 'medium' | 'large';
  x: number;
  y: number;
  rows: number;
  cols: number;
  [propName: string]: any;
  initCallback?: (
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ) => void;
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  compactEnabled?: boolean;
  maxItemRows?: number;
  minItemRows?: number;
  maxItemCols?: number;
  minItemCols?: number;
  minItemArea?: number;
  maxItemArea?: number;

  title?: string;
  type?: string;
  link?: string;
  header?: string;
  dataUrl?: string;
  primaryColor?: string;
  settingsUser?: SettingsUser;
  panelCache?:PanelCache[];
  allowPrecalculations?:boolean;
  allowSystemHealth?:boolean;
  content?: string;
  refresh$?: () => {};
  public static assignIdIfMissing(panel: DashboardPanelModel) {
    if (!panel.id) {
      panel.id = `${panel.type}-${uuidv4()}`;
    }
  }
  public static createPanelFromType(type: DashboardType) {
    const panel = new DashboardPanelModel();
    panel.fontSize = type.fontSize || 'medium';
    panel.maxItemCols = type.maxItemCols;
    panel.maxItemRows = type.maxItemRows;
    panel.minItemCols = type.minItemCols;
    panel.minItemRows = type.minItemRows;
    panel.x = 0;
    panel.y = 0;
    panel.cols = type.cols;
    panel.rows = type.rows;
    panel.title = type.title;
    panel.type = type.type;
    panel.firstValue = type.firstValue;
    panel.secondValue = type.secondValue;
    panel.filters = type.filters;
    DashboardPanelModel.assignIdIfMissing(panel);
    return panel;
  }
}
