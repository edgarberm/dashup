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
export type WidgetOption = {
  /** to show in the Tooltip */
  title?: string
  /** action */
  action: () => void
  /** icon for the option */
  icon: JSX.Element
}

export interface WidgetProps {
  id: string
  /** In columns */
  x: number
  /** In rows */
  y: number
  /** In columns */
  width: number
  /** In rows */
  height: number
  /** In columns */
  minWidth?: number
  /** In rows */
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  stationary?: boolean
  draggable?: boolean
  resizable?: boolean
  removible?: boolean
  title?: string
  component?: JSX.Element
  toolbar?: JSX.Element
  options?: WidgetOption[]
  /** user internally */
  moved?: boolean
}

export type Layout = WidgetProps[]

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

export interface DashboardWidgetProps extends WidgetProps {
  columns: number
  colWidth: number
  rowHeight: number
  dashboardWidth: number
  padding: [number, number]
  draggableHandle?: string
  /** user internally */
  moved?: boolean
  /** user internally */
  layoutItemProps?: WidgetProps
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
