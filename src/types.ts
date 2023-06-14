import { MouseEvent } from 'react'

export interface Area {
  id: string
  x: number
  y: number
  width: number
  height: number
}

/**
 * @prop {string} title
 */
export type DashboardItemOption = {
  /** to show in the Tooltip */
  title?: string
  /** action */
  action: () => void
  /** icon for the option */
  icon: JSX.Element
}

export interface DashboardItem {
  id: string
  x: number
  y: number
  width: number
  height: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  stationary?: boolean
  draggable?: boolean
  resizable?: boolean
  removible?: boolean
  moved?: boolean // NOTE: no se expone en `DashboardWidgetProps`puesto que no se utiliza en el componente
  title?: string
  component?: JSX.Element
  hideTopbar?: boolean
  options?: DashboardItemOption[]
}

export type Layout = DashboardItem[]

export interface DashboardProps {
  /** The widget list */
  widgets: Layout
  /** number of columns */
  columns?: number
  /** the rows height */
  rowHeight?: number
  /** the margin between widgets */
  margin?: [number, number]
  /** The className for the draggable handle */
  draggableHandle?: string
  /** the className for the placeholder (ghost) */
  placeholderClassName?: string
  /** callback method when a widget is moved, resized or deleted */
  onChange?: (widgets: Layout) => void
  /** callback method when the dashboard (or window) is resized */
  onResize?: () => void
}

export interface DashboardWidgetProps extends DashboardItem {
  columns: number
  colWidth: number
  rowHeight: number
  dashboardWidth: number
  padding: [number, number]
  draggableHandle?: string
  /** user internally */
  placeholderClassName?: string
  onDrag: (eventName: string, widget: Area) => void
  onResize: (eventName: string, widget: Area) => void
  onRemove?: (id: string) => void
}

export interface WidgetTopBarProps {
  title?: string
  removible?: boolean
  onWidgetRemove?: (event: MouseEvent<HTMLButtonElement>) => void
}
