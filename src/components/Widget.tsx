import {
  CSSProperties,
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useStateRef } from '../hooks/hooks'
import {
  Area,
  DashboardWidgetProps,
  DraggableHandleClassName,
} from '../typings/types'
import {
  calcPosition,
  calcPositionInPx,
  calcSizeInPx,
  createCoreData,
  getControlPosition,
  getNewPosition,
  setWidgetStyle,
} from '../utils/utils'

/**
 * The idea of this component is for it to only take care of 'painting' itself, while the
 * layout logic will be handled by the component that contains it.
 *
 * To achieve this, we will pass the necessary data (position and size) through props in
 * order to recalculate the layout.
 *
 * 🗒️ @note
 * This component is used to 'paint' the placeholder since it contains all the necessary
 * logic. It would be interesting to separate it and have the logic available in the
 * components that need it through hooks or the Context API.
 *
 */
export default function Widget({
  id,
  x,
  y,
  width,
  height,
  minWidth = 1,
  minHeight = 1,
  maxWidth = 12,
  maxHeight = Infinity,
  fixed = false,
  draggable = true,
  resizable = true,
  title,
  component,
  toolbar,
  columns,
  colWidth,
  rowHeight,
  dashboardWidth,
  padding,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  moved,
  placeholderClassName,
  layoutItemProps,
  onDrag,
  onResize,
}: DashboardWidgetProps): JSX.Element {
  const widget = useRef<HTMLDivElement>(null)
  const resizeHandle = useRef<HTMLSpanElement>(null)
  const lastX = useRef<number>(NaN)
  const lastY = useRef<number>(NaN)
  const lastW = useRef<number>(0)
  const lastH = useRef<number>(0)
  const innerX = useRef<number>(0)
  const innerY = useRef<number>(0)
  const innerW = useRef<number>(0)
  const innerH = useRef<number>(0)
  const colW = useRef<number>(0)
  const draggingArea = useRef<Area>()
  const resizingArea = useRef<Area>()
  const [style, setStyle] = useState<CSSProperties>({})
  const [isDragging, setIsDragging, isDraggingRef] = useStateRef<boolean>(false)
  const [isResizing, setIsResizing, isResizingRef] = useStateRef<boolean>(false)

  /**
   * he first time the component is rendered, we decide whether the drag event is triggered
   * by the widget itself or by the toolbar.
   */
  useEffect(() => {
    const dragger = widget.current
      ? (widget.current.querySelector(
          `.${DraggableHandleClassName}`,
        ) as HTMLElement)
      : widget.current
    const resizer = resizeHandle.current

    if (dragger) {
      // NOTE: add `&& isResizingRef.current === false`?
      if (draggable && !fixed) {
        dragger.addEventListener('mousedown', handleDragEvents, false)
      }
    }

    if (resizer) {
      if (resizable && !fixed) {
        resizer.addEventListener('mousedown', handleResizeEvents, false)
      }
    }

    return () => {
      if (draggable && !fixed) {
        dragger?.removeEventListener('mousedown', handleDragEvents, false)
      }

      if (resizable && !fixed) {
        resizer?.removeEventListener('mousedown', handleResizeEvents, false)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * When the necessary properties change, we recalculate the new styles and render the component.
   */
  useEffect(() => {
    innerX.current = x
    innerY.current = y
    innerW.current = width
    innerH.current = height
    colW.current = colWidth

    createStyle()
  }, [x, y, width, height, columns, colWidth, dashboardWidth]) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Create and set the styles for our component.
   * 🚨 @important This method renders the component by modifying style and setStyle.
   */
  const createStyle = () => {
    const pos = calcPosition(
      innerX.current,
      innerY.current,
      innerW.current,
      innerH.current,
      colW.current,
      rowHeight,
      padding,
    )

    if (isDraggingRef.current && draggingArea.current) {
      pos.x = draggingArea.current.x
      pos.y = draggingArea.current.y
    }

    if (isResizingRef.current && resizingArea.current) {
      pos.width = resizingArea.current.width
      pos.height = resizingArea.current.height
    }

    const newStyle = setWidgetStyle(pos.x, pos.y, pos.width, pos.height)
    setStyle(newStyle)
  }

  /**
   * Since the three drag events share most of their logic, all three point to this function.
   * The separate fragments for each case are managed through a switch case.
   */
  const handleDragEvents = useCallback((event: MouseEvent) => {
    event.preventDefault()

    if (
      (event.target as HTMLElement).nodeName === 'BUTTON' ||
      fixed ||
      isResizingRef.current
    ) {
      return
    }

    const target = widget.current as HTMLElement
    // Widget position (in pixels).
    const position = getControlPosition(event, target)
    if (position === null) return

    // We create the object where we will store the positions.
    const area: Area = {
      id: id,
      x: innerX.current,
      y: innerY.current,
      width: innerW.current,
      height: innerH.current,
    }
    const np = getNewPosition(area, target)

    switch (event.type) {
      // On drag start
      case 'mousedown': {
        document.addEventListener('mousemove', handleDragEvents, false)
        document.addEventListener('mouseup', handleDragEvents, false)

        area.x = np.x
        area.y = np.y
        draggingArea.current = area

        setIsDragging(true)
        break
      }
      // On drag end
      case 'mouseup': {
        if (!isDraggingRef.current) return

        document.removeEventListener('mousemove', handleDragEvents, false)
        document.removeEventListener('mouseup', handleDragEvents, false)

        area.x = np.x
        area.y = np.y
        draggingArea.current = undefined

        setIsDragging(false)

        break
      }
      // On drag move
      case 'mousemove': {
        if (!isDraggingRef.current || !draggingArea.current) return

        const coreEvent = createCoreData(
          lastX.current,
          lastY.current,
          position.x,
          position.y,
        )
        area.x = draggingArea.current.x + coreEvent.deltaX / 1
        area.y = draggingArea.current.y + coreEvent.deltaY / 1

        draggingArea.current = area

        break
      }
    }

    const pos = calcPositionInPx(
      area.x,
      area.y,
      innerW.current,
      innerH.current,
      colW.current,
      rowHeight,
      columns,
      padding,
    )

    lastX.current = position.x
    lastY.current = position.y

    // We pass our new coordinates to the Dashboard to recalculate the new layout.
    onDrag(event.type, {
      id,
      x: pos.x,
      y: pos.y,
      width: innerW.current,
      height: innerH.current,
    })

    // We repaint the component.
    createStyle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Same case as for the drag events.
   */
  const handleResizeEvents = (event: MouseEvent) => {
    event.preventDefault()

    if (
      (event.target as HTMLElement).nodeName === 'BUTTON' ||
      fixed ||
      isDraggingRef.current
    ) {
      return
    }

    const target = widget.current as HTMLElement
    // Widget position (in px)
    const position = getControlPosition(event, target)
    if (position === null) return

    // We create the object where we will store the dimensions.
    const newSize: Area = {
      id: id,
      x: innerX.current,
      y: innerY.current,
      width: innerW.current,
      height: innerH.current,
    }
    const ns = calcPosition(
      innerX.current,
      innerY.current,
      innerW.current,
      innerH.current,
      colW.current,
      rowHeight,
      padding,
    )

    switch (event.type) {
      // On resize start
      case 'mousedown': {
        document.addEventListener('mousemove', handleResizeEvents, false)
        document.addEventListener('mouseup', handleResizeEvents, false)

        newSize.width = ns.width
        newSize.height = ns.height
        resizingArea.current = newSize

        setIsResizing(true)

        break
      }
      // On resize end
      case 'mouseup': {
        if (!isResizingRef.current) return

        document.removeEventListener('mousemove', handleResizeEvents, false)
        document.removeEventListener('mouseup', handleResizeEvents, false)

        newSize.width = ns.width
        newSize.height = ns.height
        resizingArea.current = undefined

        setIsResizing(false)

        break
      }
      // On resize move
      case 'mousemove': {
        if (!isResizingRef.current || !resizingArea.current) return

        const coreEvent = createCoreData(
          lastW.current,
          lastH.current,
          position.x,
          position.y,
        )
        newSize.width = resizingArea.current.width + coreEvent.deltaX / 1
        newSize.height = resizingArea.current.height + coreEvent.deltaY / 1

        resizingArea.current = newSize

        break
      }
    }

    const size = calcSizeInPx(
      innerX.current,
      innerY.current,
      newSize.width,
      newSize.height,
      colW.current,
      rowHeight,
      columns,
      padding,
    )

    if (size.w < minWidth) {
      size.w = minWidth
    }
    if (size.w > maxWidth) {
      size.w = maxWidth
    }
    if (size.h < minHeight) {
      size.h = minHeight
    }
    if (size.h > maxHeight) {
      size.h = maxHeight
    }

    lastW.current = position.x
    lastH.current = position.y

    // We pass our new dimensions to the Dashboard to recalculate the new layout.
    onResize(event.type, {
      id,
      x: innerX.current,
      y: innerY.current,
      width: size.w,
      height: size.h,
    })

    // We repaint the component.
    createStyle()
  }

  return (
    <div
      ref={widget}
      id={`widget-${id}`}
      className={`
        dashup-widget
        ${placeholderClassName || ''}
        ${draggable && !fixed ? 'draggable' : ''}
        ${resizable && !fixed ? 'resizable' : ''}
        ${fixed ? 'fixed' : ''}
        ${isDragging ? 'dragging' : ''}
        ${isResizing ? 'resizing' : ''}`}
      style={style}
    >
      {/** 🗒️ @note If it is the placeholder, we do not render the content. */}
      {placeholderClassName === undefined && (
        <div className={!toolbar ? DraggableHandleClassName : 'wrapper'}>
          {toolbar &&
            cloneElement(toolbar, {
              id,
              title,
              className: DraggableHandleClassName,
            })}

          {component && cloneElement(component, layoutItemProps)}

          {resizable && !fixed && (
            <span
              role=''
              ref={resizeHandle}
              className='resizable-handle'
            ></span>
          )}
        </div>
      )}
    </div>
  )
}
