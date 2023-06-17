import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { Dashboard } from '../src'

/**
 * colWidth = 86.5
 */
function Wrapper({ children }: { children: JSX.Element }) {
  return (
    <div
      id='wrapper'
      style={{
        minWidth: globalThis.innerWidth,
        width: globalThis.innerWidth,
        minHeight: globalThis.innerHeight,
        height: globalThis.innerHeight,
      }}
    >
      {children}
    </div>
  )
}

describe('Dashboard component ', () => {
  test('should render correctly', async () => {
    const { container } = render(
      <Wrapper>
        <Dashboard
          columns={12}
          rowHeight={100}
          margin={[10, 10]}
          widgets={[]}
        />
      </Wrapper>,
    )
    const dashboard = container.querySelector(
      '.dashup-dashboard',
    ) as HTMLElement
    expect(dashboard).toBeInTheDocument()
    expect(dashboard.children.length).toBe(0)
  })

  test('should render widgets correctly', async () => {
    const { container } = render(
      <Wrapper>
        <Dashboard
          columns={12}
          rowHeight={100}
          margin={[10, 10]}
          widgets={[
            {
              id: '123456-yuwebvrt',
              x: 0,
              y: 0,
              width: 4,
              height: 2,
              title: 'Widget 4',
              resizable: true,
            },
            {
              id: '123456-ñsdhfasjdkhfa',
              x: 5,
              y: 0,
              width: 4,
              height: 2,
              title: 'Widget 4',
              resizable: false,
            },
          ]}
        />
      </Wrapper>,
    )

    const dashboard = container.querySelector(
      '.dashup-dashboard',
    ) as HTMLElement
    expect(dashboard.children.length).toBe(2)
  })
})
