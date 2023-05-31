import { DashboardItem, Layout } from './types'

export function uuidv4() {
  // @ts-ignore
  const pattern = [1e7] + -1e3 + -4e3 + -8e3 + -1e11
  // @ts-ignore
  return pattern.replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  )
}

export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  timeout = 300,
) {
  let lastArgs: Args | undefined

  const run = () => {
    if (lastArgs) {
      fn(...lastArgs)
      lastArgs = undefined
    }
  }

  const throttled = (...args: Args) => {
    const isOnTimeout = !!lastArgs

    lastArgs = args

    if (isOnTimeout) {
      return
    }

    window.setTimeout(run, timeout)
  }

  return throttled
}



/**
 * Esta función se encarga
 */
export function calcPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  columnWidth: number,
  rowHeight: number,
  padding: [number, number],
) {
  return {
    x: Math.round(columnWidth * x + (x + 1) * padding[0]),
    y: Math.round(rowHeight * y + (y + 1) * padding[1]),
    // 0 * Infinity === NaN da un error al calcular el redimensionamiento.
    width:
      width === Infinity
        ? width
        : Math.round(columnWidth * width + Math.max(0, width - 1) * padding[0]),
    height:
      height === Infinity
        ? height
        : Math.round(rowHeight * height + Math.max(0, height - 1) * padding[1]),
  }
}

export function calcPositionInPx(
  x: number,
  y: number,
  innerW: number,
  innerH: number,
  colWidth: number,
  rowHeight: number,
  columns: number,
  padding: [number, number],
) {
  console.log(padding);
  
  const left = Math.round((x - padding[0]) / (colWidth + padding[0]))
  const top = Math.round((y - padding[1]) / (rowHeight + padding[1]))
  // Clampping
  return {
    x: Math.max(Math.min(left, columns - innerW), 0),
    y: Math.max(Math.min(top, Infinity - innerH), 0),
  }
}

export function calcSizeInPx(
  innerX: number,
  innerY: number,
  width: number,
  height: number,
  colWidth: number,
  rowHeight: number,
  columns: number,
  padding: [number, number],
) {
  const W = Math.round((width + padding[0]) / (colWidth + padding[0]))
  const H = Math.round((height + padding[1]) / (rowHeight + padding[1]))

  return {
    w: Math.max(Math.min(W, columns - innerX), 0),
    h: Math.max(Math.min(H, Infinity - innerY), 0),
  }
}

/**
 * Normaliza la posición del componente utilizando el bounding client rect del
 * `Dashboard`. Se utiliza tanto en el evento `mousedown` como en `mousemove`.
 */
export function getNewPosition(
  position: { x: number; y: number },
  target: HTMLElement,
): {
  x: number
  y: number
} {
  const newPosition = { ...position }
  // @ts-ignore
  const parentRect = target.parentNode.getBoundingClientRect()
  const clientRect = target.getBoundingClientRect()
  const cLeft = clientRect.left
  const pLeft = parentRect.left
  const cTop = clientRect.top
  const pTop = parentRect.top

  newPosition.x = cLeft - pLeft
  newPosition.y = cTop - pTop

  return newPosition
}

/**
 * Obtiene la coordenada inferior del  layout.
 *
 * @param  {Layout} layout Layout array.
 * @return {number} Bottom coordinate.
 */
export function bottom(layout: Layout): number {
  let max = 0
  let bottomY = 0

  for (let i = 0, len = layout.length; i < len; i++) {
    bottomY = layout[i].y + layout[i].height
    if (bottomY > max) max = bottomY
  }

  return max
}

function getStatics(layout: Layout): Layout {
  return [...layout].filter((l) => l.stationary)
}

/**
 * Ordena los elementos del layout de arriba a abajo y de izquierda a derecha
 *
 * @param {Layout} layout Array of layout objects.
 * @return {Layout} Layout, sorted static items first.
 */
function sortLayoutItemsByRowCol(layout: Layout): Layout {
  const dashboard = [...layout]
  return dashboard.sort((a: DashboardItem, b: DashboardItem) => {
    if (a.y === b.y && a.x === b.x) {
      return 0
    }

    if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1
    }

    return -1
  })
}

export function findLayoutsDifference(
  layout: Layout,
  originalLayout: Layout,
): Layout {
  // Están en layout pero no en originalLayout
  const uniqueResultOne = layout.filter(
    (obj) => !originalLayout.some((obj2) => obj.id === obj2.id),
  )
  // Están en originalLayout pero no en layout
  const uniqueResultTwo = originalLayout.filter(
    (obj) => !layout.some((obj2) => obj.id === obj2.id),
  )

  return [...uniqueResultOne, ...uniqueResultTwo]
}

/**
 * Comprueba si dos widgets colisionan
 *
 * @return {boolean}
 */
function collides(w1: DashboardItem, w2: DashboardItem): boolean {
  if (w1 === w2) return false
  if (w1.x + w1.width <= w2.x) return false // w1 está a la izquierda de w2
  if (w1.x >= w2.x + w2.width) return false // w1 está a la derecha de w2
  if (w1.y + w1.height <= w2.y) return false // w1 está encima w2
  if (w1.y >= w2.y + w2.height) return false // w1 está debajo w2
  return true // se solapan
}

/**
 * Devuelve el primer elemento con el que colisiona.
 * 🚨 No nos importa el orden, aunque es posible que esto no sea correcrto.
 *
 * @param  {DashboardItem} layoutItem Layout item.
 * @return {DashboardItem|undefined}  A colliding layout item, or undefined.
 */
function getFirstCollision(
  layout: Layout,
  layoutItem: DashboardItem,
): DashboardItem | undefined {
  for (let i = 0, len = layout.length; i < len; i++) {
    if (collides(layout[i], layoutItem)) return layout[i]
  }
}

export function getAllCollisions(
  layout: Layout,
  layoutItem: DashboardItem,
): DashboardItem[] {
  return [...layout].filter((l) => collides(l, layoutItem))
}

export function compactItem(
  compareWith: Layout,
  widget: DashboardItem,
): DashboardItem {
  // Mueve el widget hacia arriba tanto como pueda sin colisionar.
  while (widget.y > 0 && !getFirstCollision(compareWith, widget)) {
    widget.y = widget.y - 1
  }

  // Mueve el widget hacia abajo y sigue moviéndolo si está colisionando.
  let collides
  while ((collides = getFirstCollision(compareWith, widget))) {
    widget.y = collides.y + collides.height
  }

  return widget
}

/**
 * Compacta un layout.
 * Esto implica bajar por cada coordenada Y y eliminar los huecos entre los elementos.
 *
 * @param  {Layout} layout Layout.
 * @return {Layout} Compacted Layout.
 */
export function compact(layout: Layout): Layout {
  const dashboard = [...layout]
  // Guardamos los estáticos
  const compareWith = getStatics(dashboard)

  // Ordenamos los widgets por filas y columnas.
  const sorted = sortLayoutItemsByRowCol(dashboard)
  // Nuestro output
  const out = Array(dashboard.length)

  for (let i = 0, len = sorted.length; i < len; i++) {
    let widget = sorted[i]

    // No movemos los widgets estáticos
    if (!widget.stationary) {
      widget = compactItem(compareWith, widget)

      // Movemos los widget anteriores
      compareWith.push(widget)
    }

    // Los añadimos a nuestro output en el orden correcto.
    out[dashboard.indexOf(widget)] = widget

    widget.moved = false
  }

  return out
}

export function setWidgetStyle(
  x: number,
  y: number,
  width: number,
  height: number,
): any {
  const translate = 'translate3d(' + x + 'px,' + y + 'px, 0)'
  return {
    transform: translate,
    width: width + 'px',
    height: height + 'px',
    position: 'absolute',
  }
}

// Obtenemos la posición del widget en el dashboard (en px) a partir de un mouse event
export function getControlPosition(
  event: globalThis.MouseEvent,
  parent: HTMLElement,
) {
  const offsetParent = parent.offsetParent || document.body // change for dashboardRef
  const offsetParentRect =
    // @ts-ignore
    event.offsetParent === document.body
      ? { x: 0, y: 0 }
      : offsetParent.getBoundingClientRect()

  const x = event.clientX + offsetParent.scrollLeft - offsetParentRect.x
  const y = event.clientY + offsetParent.scrollTop - offsetParentRect.y

  return { x, y }
}

export function createCoreData(
  lastX: number,
  lastY: number,
  x: number,
  y: number,
) {
  return {
    deltaX: x - lastX,
    deltaY: y - lastY,
    lastX: lastX,
    lastY: lastY,
    x: x,
    y: y,
  }
}

/**
 * @param  {Array} layout Layout array.
 * @param  {String} id ID
 * @return {LayoutItem} Item at ID.
 */
export function getLayoutItem(
  layout: Layout,
  id: string,
): DashboardItem | undefined {
  for (let i = 0, len = layout.length; i < len; i++) {
    if (layout[i].id === id) return layout[i]
  }
}

/**
 * Mueve un elemento.
 * También es responsable de mover en cascada los otros elementos.
 *
 * @param  {Layout}      layout
 * @param  {DashboardItem} widget
 * @param  {number}     x en unidades del grid
 * @param  {number}     y en unidades del grid
 * @param  {boolean}    isUserAction indica si el elemento que estamos moviendo está siendo arrastrado/redimensionado por el usuario.
 */
export function moveElement(
  layout: Layout,
  widget: DashboardItem,
  x?: number,
  y?: number,
  isUserAction?: boolean,
  preventCollision?: boolean,
): Layout {
  if (widget.stationary) return layout

  const oldX = widget.x
  const oldY = widget.y

  const movingUp = y && widget.y > y

  // bastante más rápido que extender el objeto
  if (typeof x === 'number') widget.x = x
  if (typeof y === 'number') widget.y = y
  widget.moved = true

  let dashboard: DashboardItem[] = [...layout]
  // Si choca con algo, lo movemos.
  let sorted: DashboardItem[] = sortLayoutItemsByRowCol(dashboard)
  // Tenemos que reordenar los elementos con los que comparamos para asegurarnos de en el
  // caso de tener colisiones múltiples, obtener l colisión más cercana.
  if (movingUp) sorted = sorted.reverse()
  const collisions = getAllCollisions(sorted, widget)

  // NOTE: para en un futuro poder bloquear el dashboard (ahora no hace nada)
  if (preventCollision && collisions.length) {
    widget.x = oldX
    widget.y = oldY
    widget.moved = false
    return layout
  }

  // Movemos cada elemento que colisiona
  const len = collisions.length
  for (let i = 0; i < len; i++) {
    const collision = collisions[i]

    if (collision.moved) continue

    if (widget.y > collision.y && widget.y - collision.y > collision.height / 4)
      continue

    // No movemos los widges estáticos
    if (collision.stationary) {
      dashboard = moveElementAwayFromCollision(
        layout,
        collision,
        widget,
        isUserAction,
      )
    } else {
      dashboard = moveElementAwayFromCollision(
        layout,
        widget,
        collision,
        isUserAction,
      )
    }
  }

  return dashboard
}

/**
 * Aquí es donde ocurre la magia.. 🪄
 *
 * Intentamos mover el widget hacia arriba si hay espacio, si no, hacia abajo.
 *
 * @param  {Array} layout
 * @param  {LayoutItem} collidesWith
 * @param  {LayoutItem} itemToMove
 * @param  {Boolean} [isUserAction] // TODO
 */
function moveElementAwayFromCollision(
  layout: Layout,
  collidesWith: DashboardItem,
  itemToMove: DashboardItem,
  isUserAction?: boolean,
): Layout {
  const preventCollision = false // we're already colliding

  // Si hay suficiente espacio movemos el widget encima.
  // IMPORTANTE tener en cuenta que solo ha de hecerse en la colisión 'principal', de lo contrario
  // podemos entrar en unbucle infinito.
  if (isUserAction) {
    // Copiamos el original para no modificarlo
    const fakeItem: DashboardItem = {
      x: itemToMove.x,
      y: itemToMove.y,
      width: itemToMove.width,
      height: itemToMove.height,
      id: uuidv4(),
    }

    fakeItem.y = Math.max(collidesWith.y - itemToMove.height, 0)

    if (!getFirstCollision(layout, fakeItem)) {
      return moveElement(
        layout,
        itemToMove,
        undefined,
        fakeItem.y,
        preventCollision,
      )
    }
  }

  return moveElement(
    layout,
    itemToMove,
    undefined,
    itemToMove.y + 1,
    preventCollision,
  )
}
