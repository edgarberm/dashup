import { useEventListener, useStateRef } from '../hooks/hooks'
import { throttle } from '../utils/utils'
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
import { Area, DashboardProps, Layout, WidgetProps } from '../typings/types'

const PLACEHOLDER = {
  id: 'placeholder',
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}

/**
 *  The Dashboard component.
 */
export function Dashboard({
  widgets,
  columns = 24,
  rowHeight = 100,
  margin = [10, 10],
  packing = true,
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

    const newWidgets = packing ? compact(widgets) : widgets
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
              (obj: WidgetProps) => {
                return !diff.some((obj2: WidgetProps) => {
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
   * Here is where the magic of the grid happens, most of the logic is in `utils`.
   */
  const handleWidgetDrag = (eventName: string, widget: Area) => {
    const item = getLayoutItem(layoutRef.current, widget.id)
    if (item === undefined || item === null) return

    const newLayout = moveElement({
      layout: layoutRef.current,
      widget: item,
      x: widget.x,
      y: widget.y,
      preventCollision: true,
      packing,
    })
    const compactLayout = packing ? compact(newLayout) : newLayout
    const compactItem = compactLayout.find(
      (c: WidgetProps) => c.id === widget.id,
    ) as WidgetProps

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
          ? moveElement({
              layout: layoutRef.current,
              widget: collision[0],
              x: collision[0].x,
              y: widget.height,
              packing,
            })
          : layoutRef.current
      const compactLayout = packing ? compact(newLayout) : newLayout

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
    const newLayout = layoutRef.current.filter((w: WidgetProps) => w.id !== id)
    const compactLayout = packing ? compact(newLayout) : newLayout

    onChange?.(compactLayout)
    layoutUpdate()
    updateHeight()
  }

  return (
    <div
      ref={dashboardRef}
      className='dashup dashup-dashboard'
      style={mergedStyle}
    >
      {layout.map((w) => (
        <Widget
          key={w.id}
          {...w}
          layoutItemProps={w}
          columns={columns}
          colWidth={colWidth}
          rowHeight={rowHeight}
          dashboardWidth={width}
          padding={margin}
          onDrag={handleWidgetDrag}
          onResize={handleWidgetResize}
          onRemove={handleRemoveWidget}
        />
      ))}

      {(isDragging || isResizing) && (
        <Widget
          {...placeholder}
          title=''
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
