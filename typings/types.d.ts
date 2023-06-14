
interface Area {
  id: string
  x: number
  y: number
  width: number
  height: number
}

/**
 * @prop {string} title
 */
type DashboardItemOption = {
  /** to show in the Tooltip */
  title?: string
  /** action */
  action: () => void
  /** icon for the option */
  icon: JSX.Element
}

interface DashboardItem {
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
  moved?: boolean // NOTE: no se expone en `DashboardWidgetProps`puesto que no se utiliza en el componente
  title?: string
  component?: JSX.Element
  hideTopbar?: boolean
  options?: DashboardItemOption[]
}

type Layout = DashboardItem[]

interface DashboardProps {
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

interface DashboardWidgetProps extends DashboardItem {
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

interface WidgetTopBarProps {
  title?: string
  removible?: boolean
  onWidgetRemove?: (event: MouseEvent<HTMLButtonElement>) => void
}

default function Dashboard({ widgets, columns, rowHeight, margin, draggableHandle, placeholderClassName, onChange, onResize, }: DashboardProps): JSX.Element;
