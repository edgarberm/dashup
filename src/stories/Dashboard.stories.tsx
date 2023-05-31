import { uuidv4 } from '../utils'
import Dashboard from '../Dashboard'
import { Meta, StoryObj } from '@storybook/react'
import React, { CSSProperties, useState } from 'react'
import { DashboardItem, DashboardProps, Layout } from '../types'
import './dashboard.css'

function FakeComponent(): JSX.Element {
  return (
    <div className='content'>
      <p>Content</p>
    </div>
  )
}

const FAKE_WIDGETS: Layout = [
  {
    id: uuidv4(),
    x: 0,
    y: 2,
    width: 3,
    height: 2,
    title: 'Widget 1 (not draggable)',
    draggable: false,
    removible: false,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 4,
    y: 0,
    width: 4,
    height: 2,
    title: 'Widget 2',
    component: <FakeComponent />,
    options: [
      {
        title: 'Option 1',
        action: () => {
          // eslint-disable-next-line no-console
          console.log('Option 1')
        },
        icon: <svg />,
      },
      {
        title: 'Option 2',
        action: () => {
          // eslint-disable-next-line no-console
          console.log('Option 2')
        },
        icon: <svg />,
      },
    ],
  },
  {
    id: uuidv4(),
    x: 8,
    y: 0,
    width: 4,
    height: 1,
    title: 'Widget 3',
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 0,
    y: 0,
    width: 4,
    height: 2,
    title: 'Widget 4',
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 3,
    y: 2,
    width: 4,
    height: 3,
    title: 'Widget 5 (stationary)',
    stationary: true,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 7,
    y: 2,
    width: 5,
    height: 2,
    maxWidth: 5,
    maxHeight: 3,
    minWidth: 3,
    minHeight: 2,
    title: 'Widget 6',
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 7,
    y: 4,
    width: 2,
    height: 2,
    title: 'Widget 7',
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 0,
    y: 6,
    width: 3,
    height: 2,
    title: 'Widget 8 (no resizable)',
    resizable: false,
    component: <FakeComponent />,
  },
]

type Story = StoryObj<typeof Dashboard>

const dashboard: Meta<typeof Dashboard> = {
  title: 'Dashboard',
  component: Dashboard,
  tags: ['autodocs'],
  layout: 'fullscreen',
  parameters: {
    docs: {
      page: null,
      description: {
        component: `This component is under development. Please **play with it!** 🤹‍♀️`,
      },
      source: {
        language: 'tsx',
      },
    },
  },
  args: {
    widgets: FAKE_WIDGETS,
    columns: 12,
    rowHeight: 100,
    margin: [12, 12],
    onChange: () => {},
    onResize: () => {},
  } as DashboardProps,
} as Meta<typeof Dashboard>

export default dashboard

export const Default: Story = {
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (StoryFn: any, props: any) => {
      const { args } = props
      const [widgets, setWidgets] = useState(args.widgets)
      const handleChange = (dashboard: Layout) => {
        setWidgets(dashboard)
      }

      return (
        <div style={{ height: '100%', minHeight: 800 }}>
          {/* <div className='summary'>
            {widgets.map((widget: DashboardItem) => (
              <div key={widget.id}>
                <p>{widget.title}</p>
                <div>
                  <p>
                    [{widget.x}, {widget.y}, {widget.width}, {widget.height}]
                  </p>
                </div>
              </div>
            ))}
          </div> */}

          <Dashboard
            {...props.args}
            widgets={widgets}
            columns={props.args.columns}
            rowHeight={props.args.rowHeight}
            onChange={handleChange}
          />
        </div>
      )
    },
  ],
}
