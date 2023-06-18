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
 * La idea de este componente es que solo se encargue de 'pintarse' a si mismo, la lógica
 * del layout recaerá sobre el componente que lo contiene.
 *
 * Para esto, le pasaremos por medio de props los datos necesarios (posición y tamaño)
 * para poder recalgular el layout.
 *
 * 🗒️ @note
 * Este componente es el que utilizamos para 'pintar' el placeholder ya que contiene
 * toda la logica necesaria. Seria interesante poder separarlo y disponer de la logica en
 * los componentes que la necesiten por medio de hooks o de la Context API.
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
   * La primera vez que se renderiza el componente decidimos si el evento de drag lo
   * dispara el propio widget o bien la toolbar
   */
  useEffect(() => {
    const dragger = widget.current
      ? (widget.current.querySelector(
          `.${DraggableHandleClassName}`,
        ) as HTMLElement)
      : widget.current
    const resizer = resizeHandle.current

    if (dragger) {
      // NOTE: añadir `&& isResizingRef.current === false`?
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
   * Cuando las propiedades necesarias cambian, recalculamos los nuevos estilos y renderizamos el componente.
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
   * Crea y setea los estilos para nuestro componente.
   * 🚨 @important este método renderiza el componente al modificar `style` `setStyle`
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
   * Puesto que los tres eventos de drag comparten la mayor parte de su logica los tres
   * apuntan a esta función. Los fragmentos independientes para cada caso se gestionan
   * por medio de un switch case.
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
    // Posición del widget en el sah (px)
    const position = getControlPosition(event, target)
    if (position === null) return

    // Creamos el objeto en el que almacenaremos las posiciones
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

    // Pasamos nuestras nuevas coordenadas al `Dashboard` para que recalcule el nuevo layout
    onDrag(event.type, {
      id,
      x: pos.x,
      y: pos.y,
      width: innerW.current,
      height: innerH.current,
    })

    // Repintamos el componente
    createStyle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Mismo caso que para los eventos de drag
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
    // Posición del widget en el sah (px)
    const position = getControlPosition(event, target)
    if (position === null) return

    // Creamos el objeto en el que almacenaremos las dimensiones
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

    // Pasamos nuestras nuevas coordenadas al `Dashboard` para que recalcule el nuevo layout
    onResize(event.type, {
      id,
      x: innerX.current,
      y: innerY.current,
      width: size.w,
      height: size.h,
    })

    // Repintamos el componente
    createStyle()
  }

  return (
    <div
      ref={widget}
      id={id}
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
      {/** 🗒️ @note si es el placeholder no renderizamos el contenido */}
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
