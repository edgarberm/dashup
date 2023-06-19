import { Layout, WidgetProps } from '../typings/types'

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
 * Normalize the component's position using the bounding client rect of the Dashboard.
 * It is used in both the mousedown and mousemove events.
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
 * Obtains the bottom coordinate of the layout.
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

/**
 * Get all fixed widgets
 */
function getStatics(layout: Layout): Layout {
  return [...layout].filter((l) => l.fixed)
}

/**
 * Arrange the elements of the layout from top to bottom and from left to right.
 *
 * @param {Layout} layout Array of layout objects.
 * @return {Layout} Layout, sorted static items first.
 */
function sortLayoutItemsByRowCol(layout: Layout): Layout {
  const dashboard = [...layout]
  return dashboard.sort((a: WidgetProps, b: WidgetProps) => {
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
  // They are in layout but not in originalLayout
  const uniqueResultOne = layout.filter(
    (obj) => !originalLayout.some((obj2) => obj.id === obj2.id),
  )
  // They are in originalLayout but not in layout
  const uniqueResultTwo = originalLayout.filter(
    (obj) => !layout.some((obj2) => obj.id === obj2.id),
  )

  return [...uniqueResultOne, ...uniqueResultTwo]
}

/**
 * Check if two widgets collide
 *
 * @return {boolean}
 */
function collides(w1: WidgetProps, w2: WidgetProps): boolean {
  if (w1 === w2) return false
  if (w1.x + w1.width <= w2.x) return false // w1 is to the left of w2
  if (w1.x >= w2.x + w2.width) return false // w1 is to the right of w2
  if (w1.y + w1.height <= w2.y) return false // w1 is above w2
  if (w1.y >= w2.y + w2.height) return false // w1 is below w2
  return true // overlap
}

/**
 * Return the first element with which it collides
 * 🚨 We don't care about the order, although this may not be accurate
 *
 * @param  {WidgetProps} layoutItem Layout item.
 * @return {WidgetProps|undefined}  A colliding layout item, or undefined.
 */
function getFirstCollision(
  layout: Layout,
  layoutItem: WidgetProps,
): WidgetProps | undefined {
  for (let i = 0, len = layout.length; i < len; i++) {
    if (collides(layout[i], layoutItem)) return layout[i]
  }
}

export function getAllCollisions(
  layout: Layout,
  layoutItem: WidgetProps,
): WidgetProps[] {
  return [...layout].filter((l) => collides(l, layoutItem))
}

export function compactItem(
  compareWith: Layout,
  widget: WidgetProps,
): WidgetProps {
  // Move the widget upwards as much as possible without colliding
  while (widget.y > 0 && !getFirstCollision(compareWith, widget)) {
    widget.y = widget.y - 1
  }

  // Move the widget downwards and continue moving if it is colliding
  let collides
  while ((collides = getFirstCollision(compareWith, widget))) {
    widget.y = collides.y + collides.height
  }

  return widget
}

/**
 * Compact the layout
 * This involves iterating through each Y coordinate and eliminating the gaps between elements
 *
 * @param  {Layout} layout Layout.
 * @return {Layout} Compacted Layout.
 */
export function compact(layout: Layout): Layout {
  const dashboard = [...layout]
  // We save the static elements
  const compareWith = getStatics(dashboard)

  // We sort the widgets by rows and columns
  const sorted = sortLayoutItemsByRowCol(dashboard)
  // Our output
  const out = Array(dashboard.length)

  for (let i = 0, len = sorted.length; i < len; i++) {
    let widget = sorted[i]

    // We don't move the static widgets
    if (!widget.fixed) {
      widget = compactItem(compareWith, widget)

      // We move the previous widgets
      compareWith.push(widget)
    }

    // We add them to our output in the correct order
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
  const translate = 'translate3d(' + x + 'px, ' + y + 'px, 0px)'
  return {
    transform: translate,
    width: width + 'px',
    height: height + 'px',
    position: 'absolute',
  }
}

// We obtain the position of the widget on the dashboard (in pixels) from a mouse event
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
): WidgetProps | undefined {
  for (let i = 0, len = layout.length; i < len; i++) {
    if (layout[i].id === id) return layout[i]
  }
}

/**
 * Move an element
 * It is also responsible for cascading the movement of the other elements
 *
 * @param  {Layout}      layout
 * @param  {WidgetProps} widget
 * @param  {number}     x in grid units
 * @param  {number}     y in grid units
 * @param  {boolean}    isUserAction Indicate if the element being moved is being dragged/resized by the user
 */
export function moveElement({
  layout,
  widget,
  x,
  y,
  isUserAction = true,
  preventCollision = true,
  packing,
}: {
  layout: Layout
  widget: WidgetProps
  x?: number
  y?: number
  isUserAction?: boolean
  preventCollision?: boolean
  packing?: boolean
}): Layout {
  if (widget.fixed) return layout

  const oldX = widget.x
  const oldY = widget.y

  const movingUp = y && widget.y > y

  // Much faster than extending the object
  if (typeof x === 'number') widget.x = x
  if (typeof y === 'number') widget.y = y
  widget.moved = true

  let dashboard: WidgetProps[] = [...layout]
  // If it collides with something, we move it
  let sorted: WidgetProps[] = packing
    ? sortLayoutItemsByRowCol(dashboard)
    : dashboard
  // We need to reorder the elements we compare with to ensure that in the
  // case of having multiple collisions, we obtain the closest collision
  if (movingUp && packing) sorted = sorted.reverse()
  const collisions = getAllCollisions(sorted, widget)

  if (preventCollision && collisions.length && !packing) {
    widget.x = oldX
    widget.y = oldY
    widget.moved = false
  }

  if (packing === false) return dashboard

  // We move each colliding element
  const len = collisions.length
  for (let i = 0; i < len; i++) {
    const collision = collisions[i]

    if (collision.moved) continue

    if (widget.y > collision.y && widget.y - collision.y > collision.height / 4)
      continue

    // We don't move the static widgets
    if (collision.fixed) {
      dashboard = moveElementAwayFromCollision(
        layout,
        collision,
        widget,
        isUserAction,
        packing,
      )
    } else {
      dashboard = moveElementAwayFromCollision(
        layout,
        widget,
        collision,
        isUserAction,
        packing,
      )
    }
  }

  return dashboard
}

/**
 * This is where the magic happens.. 🪄
 *
 * We attempt to move the widget upwards if there is space, otherwise downwards
 *
 * @param  {Array} layout
 * @param  {LayoutItem} collidesWith
 * @param  {LayoutItem} itemToMove
 * @param  {Boolean} [isUserAction] // TODO
 */
function moveElementAwayFromCollision(
  layout: Layout,
  collidesWith: WidgetProps,
  itemToMove: WidgetProps,
  isUserAction?: boolean,
  packing?: boolean,
): Layout {
  const preventCollision = false // we're already colliding

  // If there is enough space, we move the widget above
  // IMPORTANTE Keep in mind that this should only be done for the 'main' collision,
  // otherwise we may enter an infinite loop.
  if (isUserAction) {
    // We make a copy of the original to avoid modifying it
    const fakeItem: WidgetProps = {
      title: itemToMove.title,
      x: itemToMove.x,
      y: itemToMove.y,
      width: itemToMove.width,
      height: itemToMove.height,
      id: uuidv4(),
    }

    fakeItem.y = Math.max(collidesWith.y - itemToMove.height, 0)

    if (!getFirstCollision(layout, fakeItem)) {
      return moveElement({
        layout,
        widget: itemToMove,
        x: undefined,
        y: fakeItem.y,
        preventCollision,
        packing,
      })
    }
  }
  return moveElement({
    layout,
    widget: itemToMove,
    x: undefined,
    y: itemToMove.y + 1,
    preventCollision,
    packing,
  })
}
