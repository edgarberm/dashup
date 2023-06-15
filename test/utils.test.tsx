import { afterAll, describe, expect, test, vi } from 'vitest'
import { calcPosition, calcSizeInPx } from '../src/utils/utils'

/**
 * dashboard width 1200
 * column width 86.5
 */
describe('Testing dasboard components utilities', () => {
  afterAll(() => {
    vi.restoreAllMocks()
  })

  const columnWidth = 86.5
  const rowHeight = 100
  const padding = [10, 10] as [number, number]

  test('Test calcPosition utility', () => {
    const position = calcPosition(0, 0, 2, 2, columnWidth, rowHeight, padding)
    expect(position).toEqual({ x: 10, y: 10, width: 183, height: 210 })
  })

  test('Test calcSizeInPx utility', () => {
    const position = calcPosition(1, 1, 3, 2, columnWidth, rowHeight, padding)
    const position2 = calcSizeInPx(
      0,
      0,
      position.width,
      position.height,
      columnWidth,
      rowHeight,
      12,
      padding,
    )

    expect(position).toEqual({ x: 107, y: 120, width: 280, height: 210 })
    expect(position2).toEqual({ w: 3, h: 2 })
  })
})
