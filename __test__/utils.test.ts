import { calcPosition, calcSizeInPx, getNewPosition } from '../src/utils'

/**
 * dashboard width 1200
 * column width 86.5
 */
describe('Testing dasboard components utilities', () => {
  const columnWidth = 86.5
  const rowHeight = 100
  const padding = [10, 10] as [number, number]

  test('Test calcPosition utility', async () => {
    const position = calcPosition(0, 0, 2, 2, columnWidth, rowHeight, padding)
    expect(position).toEqual({ x: 10, y: 10, width: 183, height: 210 })
  })

  test('Test calcSizeInPx utility', async () => {
    const position = calcPosition(1, 1, 3, 2, columnWidth, rowHeight, padding)
    const position2 = calcSizeInPx(
      0,
      0,
      position.width,
      position.height,
      columnWidth,
      rowHeight,
      12,
      padding
    )

    expect(position).toEqual({ x: 107, y: 120, width: 280, height: 210 })
    expect(position2).toEqual({ w: 3, h: 2 })
  })

  test('Test getNewPosition utility', async () => {
    const position = calcPosition(1, 1, 3, 2, columnWidth, rowHeight, padding)
    const p = document.createElement('div')
    p.style.width = '1200px'
    p.style.height = '800px'
    const w = document.createElement('div')
    w.style.left = '107px'
    w.style.top = '120px'
    w.style.width = '280px'
    w.style.height = '210px'
    p.appendChild(w)
    const position2 = getNewPosition({ x: 2, y: 0 }, w)
    console.log(position)
    console.log(position2)

    expect(position).toEqual({ x: 107, y: 120, width: 280, height: 210 })
    expect(position2).toEqual({ x: 0, y: 0 })
  })
})
