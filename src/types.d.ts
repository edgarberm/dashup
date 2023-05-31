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
  title?: string // To show in the Tooltip
  action: () => void
  icon: JSX.Element
}

interface DashboardItem {
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
  component?: JSX.Element<any>
  options?: DashboardItemOption[]
}

type Layout = DashboardItem[]

interface DashboardProps {
  widgets: Layout
  columns?: number
  rowHeight?: number
  margin?: [number, number]
  draggableHandle?: string
  onChange?: (widgets: Layout) => void
  onResize?: () => void
}

interface DashboardWidgetProps extends DashboardItem {
  columns: number
  colWidth: number
  rowHeight: number
  dashboardWidth: number
  padding: [number, number]
  draggableHandle?: string
  placeholderClassName?: string
  onDrag: (eventName: string, widget: Area) => void
  onResize: (eventName: string, widget: Area) => void
  onRemove?: (id: string) => void
}
