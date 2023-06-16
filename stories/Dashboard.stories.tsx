// @ts-ignore
import { Meta, StoryObj } from '@storybook/react'
import Dashboard from '../src'
import { uuidv4 } from '../src/utils/utils'
import './dashboard.css'
import { useState } from 'react'

function FakeComponent({ text = 'Content' }: { text?: string }): JSX.Element {
  return (
    <div className='content'>
      <p>{text}</p>
    </div>
  )
}

const STATIC_WIDGET: WidgetProps = {
  id: uuidv4(),
  x: 3,
  y: 0,
  width: 6,
  height: 2,
  title: 'Widget 2 (stationary)',
  draggable: true,
  removible: true,
  stationary: true,
  component: (
    <FakeComponent
      text={`This is a stationary widget. You can't move it or resize it, and the other widgets can't move it.`}
    />
  ),
}

const FAKE_WIDGETS: Layout = [
  {
    id: uuidv4(),
    x: 0,
    y: 0,
    width: 3,
    height: 2,
    title: 'Widget 1',
    draggable: true,
    removible: true,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 3,
    y: 0,
    width: 6,
    height: 2,
    title: 'Widget 2',
    draggable: true,
    removible: true,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 9,
    y: 0,
    width: 3,
    height: 2,
    title: 'Widget 3',
    draggable: true,
    removible: true,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 0,
    y: 2,
    width: 6,
    height: 3,
    title: 'Widget 4',
    draggable: true,
    removible: true,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 6,
    y: 2,
    width: 3,
    height: 2,
    title: 'Widget 5',
    draggable: true,
    removible: true,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 9,
    y: 2,
    width: 3,
    height: 2,
    title: 'Widget 6',
    draggable: true,
    removible: true,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 6,
    y: 4,
    width: 6,
    height: 1,
    title: 'Widget 7',
    draggable: true,
    removible: true,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 0,
    y: 6,
    width: 6,
    height: 2,
    title: 'Widget 8',
    draggable: true,
    removible: true,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 6,
    y: 6,
    width: 3,
    height: 2,
    title: 'Widget 9',
    draggable: true,
    removible: true,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 9,
    y: 6,
    width: 3,
    height: 2,
    title: 'Widget 10',
    draggable: true,
    removible: true,
    component: <FakeComponent />,
  },
  // {
  //   id: uuidv4(),
  //   x: 4,
  //   y: 0,
  //   width: 4,
  //   height: 2,
  //   title: 'Widget 2',
  //   component: <FakeComponent />,
  //   options: [
  //     {
  //       title: 'Option 1',
  //       action: () => {
  //         // eslint-disable-next-line no-console
  //         console.log('Option 1')
  //       },
  //       icon: <svg />,
  //     },
  //     {
  //       title: 'Option 2',
  //       action: () => {
  //         // eslint-disable-next-line no-console
  //         console.log('Option 2')
  //       },
  //       icon: <svg />,
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   x: 8,
  //   y: 0,
  //   width: 4,
  //   height: 1,
  //   title: 'Widget 3',
  //   component: <FakeComponent />,
  // },
  // {
  //   id: uuidv4(),
  //   x: 0,
  //   y: 0,
  //   width: 4,
  //   height: 2,
  //   title: 'Widget 4',
  //   component: <FakeComponent />,
  // },
  // {
  //   id: uuidv4(),
  //   x: 7,
  //   y: 2,
  //   width: 5,
  //   height: 2,
  //   maxWidth: 5,
  //   maxHeight: 3,
  //   minWidth: 3,
  //   minHeight: 2,
  //   title: 'Widget 6',
  //   component: <FakeComponent />,
  // },
  // {
  //   id: uuidv4(),
  //   x: 7,
  //   y: 4,
  //   width: 2,
  //   height: 2,
  //   title: 'Widget 7',
  //   component: <FakeComponent />,
  // },
  // {
  //   id: uuidv4(),
  //   x: 0,
  //   y: 6,
  //   width: 3,
  //   height: 2,
  //   title: 'Widget 8 (no resizable)',
  //   resizable: false,
  //   component: <FakeComponent text='No topbar' />,
  //   hideTopbar: true,
  // },
]

type Story = StoryObj<typeof Dashboard>

const dashboard: Meta<typeof Dashboard> = {
  title: 'Dashboard',
  component: Dashboard,
  tags: ['autodocs'],
  argTypes: {
    widgets: {
      type: { name: 'string', required: false },
      defaultValue: undefined,
      description: 'A collection of DashboardItem',
      table: {
        type: { summary: 'Layout<DashboardItem>[]' },
        defaultValue: { summary: undefined },
      },
      control: {
        type: 'object',
      },
    },
    columns: {
      type: { name: 'number', required: false },
      defaultValue: 12,
      description: 'The number for a dashboards columns',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 12 },
      },
      control: {
        type: 'number',
      },
    },
    rowHeight: {
      type: { name: 'number', required: false },
      defaultValue: 100,
      description: 'The height for a dashboards rows',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 100 },
      },
      control: {
        type: 'number',
      },
    },
    margin: {
      type: { name: 'number', required: false },
      defaultValue: [10, 10],
      description: 'The margin between widgets',
      table: {
        type: { summary: '[number, number]' },
        defaultValue: { summary: [10, 10] },
      },
      control: {
        type: 'number',
      },
    },
    draggableHandle: {
      type: { name: 'string', required: false },
      defaultValue: undefined,
      description: 'The element from which the widget will be dragged',
      table: {
        type: { summary: 'JSX.Element' },
        defaultValue: { summary: undefined },
      },
      control: {
        type: 'number',
      },
    },
    onChange: {
      type: { name: 'function', required: false },
      defaultValue: undefined,
      description: 'The callback function when a widget is moved or resized',
      table: {
        type: { summary: 'onChange?: (widgets: Layout) => void' },
        defaultValue: { summary: undefined },
      },
    },
    onResize: {
      type: { name: 'function', required: false },
      defaultValue: undefined,
      description: 'The callback function when the dashboard is resized',
      table: {
        type: { summary: 'onResize?: () => void' },
        defaultValue: { summary: undefined },
      },
    },
  },
  args: {
    widgets: FAKE_WIDGETS,
    columns: 12,
    rowHeight: 100,
    margin: [10, 10],
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

const FAKE_STATIONARY = FAKE_WIDGETS.filter((w, i) => i !== 1)

/**
 * This example shows how to use the Stationary Widgets.
 *
 * Note that unlike non-draggable or non-resizable widgets, which can be moved by other widgets, this type will not be moved.
 */
export const StationaryWidget: Story = {
  args: {
    widgets: [...FAKE_STATIONARY, STATIC_WIDGET],
  },
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
