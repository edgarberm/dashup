// @ts-ignore
import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Dashboard from '../src'
import { uuidv4 } from '../src/utils/utils'
import './dashboard.css'

function FakeComponent({
  text = 'Content',
  extra,
}: {
  text?: string
  extra?: string
}): JSX.Element {
  return (
    <div className='content'>
      <p>{text}</p>
      {extra && <p style={{ fontWeight: 'bold' }}>{extra}</p>}
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
  resizable: true,
  removible: true,
  stationary: true,
  component: (
    <FakeComponent
      text={`This is a stationary widget. You can't move it or resize it, and the other widgets can't.`}
    />
  ),
}

const NOT_DRAGGABLE_WIDGET: WidgetProps = {
  id: uuidv4(),
  x: 3,
  y: 0,
  width: 6,
  height: 2,
  title: 'Widget 2 (not draggable)',
  draggable: false,
  resizable: true,
  removible: true,
  stationary: false,
  component: <FakeComponent text={`This is a not draggable widget.`} />,
}

const NOT_RESIZABLE_WIDGET: WidgetProps = {
  id: uuidv4(),
  x: 3,
  y: 0,
  width: 6,
  height: 2,
  title: 'Widget 2 (not resizable)',
  draggable: true,
  resizable: false,
  removible: true,
  stationary: false,
  component: (
    <FakeComponent
      text={`This is a stationary widget. You can't move it or resize it, and the other widgets can't.`}
    />
  ),
}

const NOT_REMOVIBLE_WIDGET: WidgetProps = {
  id: uuidv4(),
  x: 3,
  y: 0,
  width: 6,
  height: 2,
  title: 'Widget 2 (not removible)',
  draggable: true,
  resizable: true,
  removible: false,
  stationary: false,
  component: <FakeComponent text={`This can't be removed from the layout.`} />,
}

const MIN_MAX_WIDGET_SIZE: WidgetProps = {
  id: uuidv4(),
  x: 3,
  y: 0,
  width: 6,
  height: 2,
  minWidth: 3,
  maxWidth: 6,
  minHeight: 1,
  maxHeight: 4,
  title: 'Widget 2 (min/max size)',
  draggable: true,
  resizable: true,
  removible: false,
  stationary: false,
  component: (
    <FakeComponent
      text={`This widget has a max/min size values (in layout units).`}
      extra={`minWidth: 3, maxWidth: 6, minHeight: 1, maxHeight: 4.`}
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
    resizable: true,
    removible: true,
    stationary: false,
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
    resizable: true,
    removible: true,
    stationary: false,
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
    resizable: true,
    removible: true,
    stationary: false,
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
    resizable: true,
    removible: true,
    stationary: false,
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
    resizable: true,
    removible: true,
    stationary: false,
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
    resizable: true,
    removible: true,
    stationary: false,
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
    resizable: true,
    removible: true,
    stationary: false,
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
    resizable: true,
    removible: true,
    stationary: false,
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
    resizable: true,
    removible: true,
    stationary: false,
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
    resizable: true,
    removible: true,
    stationary: false,
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
      description: 'The class name for the draggable handle',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'draggable-handle' },
      },
    },
    placeholderClassName: {
      type: { name: 'string', required: false },
      defaultValue: undefined,
      description: 'The class name for the placeholder',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'widget-placeholder' },
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
 * This property make the widget not draggable and not resizable. Also the other widgets can't move it.
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

const FAKE_DRAGGABLE = FAKE_WIDGETS.filter((w, i) => i !== 1)

/**
 * This example shows how to use the Not Draggable Widgets.
 *
 * This property make the widget not draggable, but the other widgets can move it.
 */
export const NotDraggableWidget: Story = {
  args: {
    widgets: [...FAKE_DRAGGABLE, NOT_DRAGGABLE_WIDGET],
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

const FAKE_RESIZABLE = FAKE_WIDGETS.filter((w, i) => i !== 1)

/**
 * This example shows how to use the Not Resizable Widgets.
 *
 * This property make the widget not resizable, but the other widgets can move it.
 */
export const NotResizableWidget: Story = {
  args: {
    widgets: [...FAKE_RESIZABLE, NOT_RESIZABLE_WIDGET],
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

const FAKE_REMOVIBLE = FAKE_WIDGETS.filter((w, i) => i !== 1)

/**
 * This example shows how to use the Not Resizable Widgets.
 *
 * This property make the widget not resizable, but the other widgets can move it.
 */
export const NotRemovibleWidget: Story = {
  args: {
    widgets: [...FAKE_REMOVIBLE, NOT_REMOVIBLE_WIDGET],
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

const FAKE_MIN_MAX = FAKE_WIDGETS.filter((w, i) => i !== 1)

/**
 * This example shows how to use the Not Resizable Widgets.
 *
 * This property make the widget not resizable, but the other widgets can move it.
 */
export const MinMaxWidgetSize: Story = {
  args: {
    widgets: [...FAKE_MIN_MAX, MIN_MAX_WIDGET_SIZE],
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
