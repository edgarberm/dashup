import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import Dashboard from '../src/components/Dashboard'
import '../src/styles/index.css'

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
          widgets={[]}
          columns={12}
          rowHeight={100}
          margin={[10, 10]}
        />
      </Wrapper>,
    )
    const dashboard = container.querySelector('.dashboard') as HTMLElement
    expect(dashboard.children.length).toBe(0)
  })

  test('should render widgets correctly', async () => {
    const { container, debug } = render(
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
              removible: true,
            },
            {
              id: '123456-ñsdhfasjdkhfa',
              x: 5,
              y: 0,
              width: 4,
              height: 2,
              title: 'Widget 4',
              resizable: false,
              removible: false,
            },
          ]}
        />
      </Wrapper>,
    )

    const dashboard = container.querySelector('.dashboard') as HTMLElement
    expect(dashboard.children.length).toBe(2)

    debug()
  })
})
