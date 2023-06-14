import { useEventListener, useStateRef } from '../hooks/hooks'
import { throttle } from '../utils/utils'
// @ts-ignore
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import Widget from './Widget'
import {
  bottom,
  compact,
  findLayoutsDifference,
  getAllCollisions,
  getLayoutItem,
  moveElement,
} from '../utils/utils'
import '../styles/index.css'

const PLACEHOLDER = {
  id: 'placeholder',
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}

/**
 *  @todos
 * - Fix: la animación del plceholder en el repintado. (CSS transfor tansition)
 * - Styling (UI)
 * - Mejorar UX.
 *    - Swapping horizontal de los widgets si es posible antes de empujar
 *    - Restringir el drag y el resize al contenedor
 *    - Que se pueda ocultar el header y se muestre en el hover
 * - Refactor
 *
 * @think
 * - Para los widget staticos necesitamos poder moverlos para colocarlos en el lugar apropiado
 */
export default function Dashboard({
  widgets,
  columns = 24,
  rowHeight = 100,
  margin = [10, 10],
  draggableHandle = 'draggable-handle',
  placeholderClassName = 'widget-placeholder',
  onChange,
  onResize,
}: DashboardProps): JSX.Element {
  const dashboardRef = useRef<HTMLDivElement>(null)
  const originalLayout = useRef<Layout>([])
  const [width, setWidth] = useState<number>(0)
  const [mergedStyle, setMergedStyle] = useState<CSSProperties>({})
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [placeholder, setPlaceholder] = useState<Area>(PLACEHOLDER)
  const [layout, setLayout, layoutRef] = useStateRef<Layout>([])
  const colWidth = useMemo(
    () => (width - margin[0]) / columns - margin[0],
    [columns, width, margin],
  )

  useEventListener('resize', throttle(onWindowResize, 500))

  useEffect(() => {
    onWindowResize()

    const newWidgets = compact(widgets) as Layout
    setLayout(newWidgets)
    layoutUpdate()
  }, [widgets]) // eslint-disable-line react-hooks/exhaustive-deps

  function onWindowResize() {
    if (dashboardRef.current) {
      setWidth(dashboardRef.current.offsetWidth)
      onResize?.()
    }
  }

  function updateHeight() {
    const height = bottom(layout) * (rowHeight + margin[1]) + margin[1]
    setMergedStyle({ ...mergedStyle, height: height })
  }

  function layoutUpdate() {
    if (layout.length && originalLayout.current.length) {
      if (layout.length !== originalLayout.current.length) {
        const diff = findLayoutsDifference(layout, originalLayout.current)

        if (diff.length > 0) {
          if (layout.length > originalLayout.current.length) {
            originalLayout.current = originalLayout.current.concat(diff)
          } else {
            originalLayout.current = originalLayout.current.filter(
              (obj: DashboardItem) => {
                return !diff.some((obj2: DashboardItem) => {
                  return obj.id === obj2.id
                })
              },
            )
          }
        }
      }
    }
  }

  /**
   * Aquí se ejecuta la magia del grid, casi toda la lógica está en `ùtils'
   */
  const handleWidgetDrag = (eventName: string, widget: Area) => {
    const item = getLayoutItem(layoutRef.current, widget.id)
    if (item === undefined || item === null) return

    const newLayout = moveElement(
      layoutRef.current,
      item,
      widget.x,
      widget.y,
      true,
    )
    const compactLayout = compact(newLayout) as Layout
    const compactItem = compactLayout.find(
      (c: DashboardItem) => c.id === widget.id,
    ) as DashboardItem

    if (!compactItem) return

    if (eventName === 'mousedown' || eventName === 'mousemove') {
      setPlaceholder({
        ...placeholder,
        x: compactItem.x,
        y: compactItem.y,
        width: compactItem.width,
        height: compactItem.height,
      })
    }

    if (eventName === 'mousemove') {
      setIsDragging(true)
    }

    if (eventName === 'mousemove' || eventName === 'mouseup') {
      setLayout(compactLayout)
      onChange?.(compactLayout)
      layoutUpdate()
      updateHeight()
    }

    if (eventName === 'mouseup') {
      setIsDragging(false)
    }
  }

  const handleWidgetResize = (eventName: string, widget: Area) => {
    const item = getLayoutItem(layoutRef.current, widget.id)

    if (item === undefined || item === null) return

    if (eventName === 'mousedown' || eventName === 'mousemove') {
      setIsResizing(true)
    }

    if (eventName === 'mousemove' || eventName === 'mouseup') {
      item.width = widget.width
      item.height = widget.height
      item.x = widget.x
      item.y = widget.y

      const collision = getAllCollisions(layoutRef.current, item) as Layout
      const newLayout =
        collision.length > 0
          ? moveElement(
              layoutRef.current,
              collision[0],
              collision[0].x,
              widget.height,
              false,
            )
          : layoutRef.current
      const compactLayout = compact(newLayout) as Layout

      setLayout(compactLayout)
      onChange?.(compactLayout)
      layoutUpdate()
      updateHeight()

      setPlaceholder({
        ...placeholder,
        x: widget.x,
        y: widget.y,
        width: widget.width,
        height: widget.height,
      })
    }

    if (eventName === 'mouseup') {
      setIsResizing(false)
    }
  }

  const handleRemoveWidget = (id: string) => {
    const newLayout = layoutRef.current.filter(
      (w: DashboardItem) => w.id !== id,
    )
    const compactLayout = compact(newLayout) as Layout

    // setLayout(compactLayout)
    onChange?.(compactLayout)
    layoutUpdate()
    updateHeight()
  }

  return (
    <div ref={dashboardRef} className='dashboard' style={mergedStyle}>
      {layout.map((w) => (
        <Widget
          key={w.id}
          {...w}
          columns={columns}
          colWidth={colWidth}
          rowHeight={rowHeight}
          dashboardWidth={width}
          padding={margin}
          draggableHandle={draggableHandle}
          onDrag={handleWidgetDrag}
          onResize={handleWidgetResize}
          onRemove={handleRemoveWidget}
        />
      ))}

      {(isDragging || isResizing) && (
        <Widget
          {...placeholder}
          maxWidth={columns}
          columns={columns}
          colWidth={colWidth}
          rowHeight={rowHeight}
          dashboardWidth={width}
          padding={margin}
          placeholderClassName={placeholderClassName}
          onDrag={handleWidgetDrag}
          onResize={handleWidgetResize}
        />
      )}
    </div>
  )
}
