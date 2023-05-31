import { render, waitFor } from '@testing-library/react'
import Dashboard from '../src/Dashboard'

/**
 * colWidth = 86.5
 */
function Wrapper({ children }: { children: JSX.Element }) {
  return (
    <div id='wrapper' style={{ minWidth: 1200, width: 1200, minHeight: 800 }}>
      {children}
    </div>
  )
}

describe('Dashboard component test', () => {
  test('Dashboard is render correct', async () => {
    const { container } = render(
      <Wrapper>
        <Dashboard
          widgets={[]}
          columns={12}
          rowHeight={100}
          margin={[10, 10]}
        />
      </Wrapper>
    )
    const dashboard = container.querySelector('.dashboard') as HTMLElement
    expect(dashboard.children.length).toBe(0)
  })

  test('Dashboard is render widgets correctly', async () => {
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
      </Wrapper>
    )

    await waitFor(() => {
      const dashboard = container.querySelector('.dashboard') as HTMLElement
      const wrapper = container.querySelector('#wrapper') as HTMLElement
      console.log(container.offsetWidth)
      console.log(dashboard.offsetWidth)
      console.log(wrapper.getBoundingClientRect().width)
      // console.log(dashboard.style.minWidth)
  
      expect(dashboard.children.length).toBe(2)
  
      // debug()
    })
  })
})
