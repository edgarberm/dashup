import { ReactElement } from 'react'

/**
 * @internal
 */
export interface Area {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export const DraggableHandleClassName = 'draggable-handle'

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
  /** make widget fixed */
  fixed?: boolean
  /** make widget draggable */
  draggable?: boolean
  /** make widget resizable */
  resizable?: boolean
  /** the widget title */
  title: string
  /** the component that will be rendered into the widget */
  component?: JSX.Element
  /** the component that will be the wiidget toolbar */
  toolbar?: ReactElement
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
  /** packing the layout */
  packing?: boolean
  /** the className for the placeholder (ghost) */
  placeholderClassName?: string
  /** callback method when a widget is moved, resized or deleted */
  onChange?: (widgets: Layout) => void
  /** callback method when the dashboard (or window) is resized */
  onResize?: () => void
}

/**
 * @internal
 */
export interface DashboardWidgetProps extends WidgetProps {
  columns: number
  colWidth: number
  rowHeight: number
  dashboardWidth: number
  padding: [number, number]
  /** @deprecated */
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

export interface CustomToolbarProps {
  id?: string
  title?: string
  className?: string
}
