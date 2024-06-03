// @ts-ignore
import { Meta, StoryObj } from '@storybook/react'
import { MouseEvent, useState } from 'react'
import {
  CustomToolbarProps,
  Dashboard,
  DashboardProps,
  Layout,
  WidgetProps,
} from '../src'
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
    <div className='content' data-testid='fake-component'>
      <p>{text}</p>
      {extra && <p style={{ fontWeight: 'bold' }}>{extra}</p>}
    </div>
  )
}

interface FakeToolbarWithOptionsProps extends CustomToolbarProps {
  onRemove: (id: string) => void
  onAction: (id: string) => void
}

function FakeToolbarWithOptions({
  id = uuidv4(),
  title,
  className,
  onRemove,
  onAction,
}: FakeToolbarWithOptionsProps): JSX.Element {
  const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onRemove(id)
  }
  const handleAction = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onAction(id)
  }

  return (
    <div
      className={`custom-draggable-toolbar ${className}`}
      data-testid='fake-toolbar'
    >
      <p>{title}</p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <a
          className='custom-toolbar-link'
          href='https://google.com'
          target='_blank'
          rel='noreferrer'
          data-testid='link'
        >
          link
        </a>
        <button
          className='custom-toolbar-button'
          onClick={handleAction}
          data-testid='action-button'
        >
          <span>action</span>
        </button>
        <button
          className='custom-toolbar-button'
          onClick={handleRemove}
          data-testid='remove-button'
        >
          <svg
            height='20'
            viewBox='0 -960 960 960'
            width='20'
            data-testid='close-icon'
          >
            <path d='M291-253.847 253.847-291l189-189-189-189L291-706.153l189 189 189-189L706.153-669l-189 189 189 189L669-253.847l-189-189-189 189Z' />
          </svg>
        </button>
      </div>
    </div>
  )
}

const FIXED_WIDGET: WidgetProps = {
  id: uuidv4(),
  x: 3,
  y: 0,
  width: 6,
  height: 2,
  draggable: true,
  resizable: true,
  fixed: true,
  component: (
    <FakeComponent
      text={`⚠️ This is a fixed widget. You can't move it or resize it. Also the other widgets can't move it.`}
    />
  ),
}

const NOT_DRAGGABLE_WIDGET: WidgetProps = {
  id: uuidv4(),
  x: 3,
  y: 0,
  width: 6,
  height: 2,
  draggable: false,
  resizable: true,
  fixed: false,
  component: <FakeComponent text={`This is a not draggable widget.`} />,
}

const NOT_RESIZABLE_WIDGET: WidgetProps = {
  id: uuidv4(),
  x: 3,
  y: 0,
  width: 6,
  height: 2,
  draggable: true,
  resizable: false,
  fixed: false,
  component: (
    <FakeComponent
      text={`This is a fixed widget. You can't move it or resize it, and the other widgets can't.`}
    />
  ),
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
  draggable: true,
  resizable: true,
  fixed: false,
  component: (
    <FakeComponent
      text={`This widget has a max/min size values (in layout units).`}
      extra={`minWidth: 3, maxWidth: 6, minHeight: 1, maxHeight: 4.`}
    />
  ),
}

const CUSTOM_TOOLBAR_WIDGET: WidgetProps = {
  id: uuidv4(),
  x: 3,
  y: 0,
  width: 6,
  height: 2,
  draggable: true,
  resizable: true,
  fixed: false,
  component: <FakeComponent text={`This widget has no toolbar`} />,
}

const CUSTOM_OPTIONS_WIDGET: WidgetProps = {
  id: uuidv4(),
  x: 3,
  y: 0,
  width: 6,
  height: 2,
  component: <FakeComponent />,
}

const FAKE_WIDGETS: Layout = [
  {
    id: uuidv4(),
    x: 0,
    y: 0,
    width: 3,
    height: 2,
    draggable: true,
    resizable: true,
    fixed: false,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 3,
    y: 0,
    width: 6,
    height: 2,
    draggable: true,
    resizable: true,
    fixed: false,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 9,
    y: 0,
    width: 3,
    height: 2,
    draggable: true,
    resizable: true,
    fixed: false,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 0,
    y: 2,
    width: 6,
    height: 3,
    draggable: true,
    resizable: true,
    fixed: false,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 6,
    y: 2,
    width: 3,
    height: 2,
    draggable: true,
    resizable: true,
    fixed: false,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 9,
    y: 2,
    width: 3,
    height: 2,
    draggable: true,
    resizable: true,
    fixed: false,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 6,
    y: 4,
    width: 6,
    height: 1,
    draggable: true,
    resizable: true,
    fixed: false,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 0,
    y: 6,
    width: 6,
    height: 2,
    draggable: true,
    resizable: true,
    fixed: false,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 6,
    y: 6,
    width: 3,
    height: 2,
    draggable: true,
    resizable: true,
    fixed: false,
    component: <FakeComponent />,
  },
  {
    id: uuidv4(),
    x: 9,
    y: 6,
    width: 3,
    height: 2,
    draggable: true,
    resizable: true,
    fixed: false,
    component: <FakeComponent />,
  },
]

type Story = StoryObj<typeof Dashboard>

const dashboard: Meta<typeof Dashboard> = {
  title: 'Examples',
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
    packing: {
      type: { name: 'boolean', required: false },
      defaultValue: true,
      description: 'Packing the layout',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
      control: {
        type: 'boolean',
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
    packing: true,
    placeholderClassName: 'widget-placeholder',
    onChange: () => {},
    onResize: () => {},
  } as DashboardProps,
  render: (args) => {
    return (
      <div
        style={{ width: '100%', height: '100%', minHeight: 800 }}
        data-testid='wrapper'
      >
        <Dashboard
          widgets={args.widgets}
          columns={args.columns}
          rowHeight={args.rowHeight}
          margin={args.margin}
          packing={args.packing}
          placeholderClassName={args.placeholderClassName}
        />
      </div>
    )
  },
} as Meta<typeof Dashboard>

export default dashboard

/**
 * **Dashup** brings you a full featured dashboard with draggable and resizable widgets and much more cool features.
 *
 * As you can see in the documentation, the `Dashboard` component is very easy to use and exposes a fairly small collection of props:
 *
 * ```tsx
 * interface DashboardProps {
 *  widgets: Layout
 *  columns?: number
 *  rowHeight?: number
 *  margin?: [number, number]
 *  placeholderClassName?: string
 *  onChange?: (widgets: Layout) => void
 *  onResize?: () => void
 * }
 * ```
 *
 * To configure your dashboard and tailor it to your needs, you will need to play with the properties of your widgets.
 *
 * In the following examples, we will explore the options available to customize your widgets, but the minimal config is:
 *
 * ```tsx
 * const widgets: Layout = [{
 *  id: uuidv4(),
 *  x: 0, // in layout units (columns)
 *  y: 0, // in layout units (rows)
 *  width: 3, // in layout units (columns)
 *  height: 2, // in layout units (rows)
 *  title: 'Widget title here',
 *  component: <WidgetCOntentComponent />,
 * }
 * ```
 */
export const Default: Story = {}

const FILTER = FAKE_WIDGETS.filter((w, i) => i !== 1)

/**
 * You can set the `fixed` property to `true` to make the widget not draggable and not resizable.
 *
 * ⚠️ Keep in mind that the other widgets **can't move it**.
 *
 * ```tsx
 * fixed: true
 * ```
 */
export const FixedWidget: Story = {
  args: {
    widgets: [...FILTER, FIXED_WIDGET],
  },
}

/**
 * You can set the `draggable` property to `false` to make the widget not draggable.
 *
 * ⚠️ Keep in mind that in this case the other widgets **can move it**.
 *
 * ```tsx
 * draggable: false
 * ```
 */
export const NotDraggableWidget: Story = {
  args: {
    widgets: [...FILTER, NOT_DRAGGABLE_WIDGET],
  },
}

/**
 * You can set the `resizable` property to `false` to make the widget not resizable.
 *
 * ⚠️ Keep in mind that in this case the other widgets **can move it**.
 *
 * ```tsx
 * resizable: false
 * ```
 */
export const NotResizableWidget: Story = {
  args: {
    widgets: [...FILTER, NOT_RESIZABLE_WIDGET],
  },
}

/**
 * You can set minimum and maximum sizes for your widgets.
 *
 * ⚠️ All sizes in layout units (columns or rows).
 *
 * ```tsx
 * minWidth: 3
 * minHeight: 1
 * maxWidth: 6
 * maxHeight: 4
 * ```
 *
 * @todo
 * Test the MinMaxWidgetSize example
 */
export const MinMaxWidgetSize: Story = {
  args: {
    widgets: [...FILTER, MIN_MAX_WIDGET_SIZE],
  },
}

/**
 * Not packing layout.
 *
 *```tsx
 * packing: false
 */
export const NotPackingLayout: Story = {
  args: {
    packing: false,
    widgets: [...FILTER, FIXED_WIDGET].map((w, i) => ({
      ...w,
      y:
        i > 2 && !w.fixed
          ? w.y + Math.floor(Math.random() * (3 - 3 + 1) + 3)
          : w.y,
    })),
  },
}

/**
 * @todo
 */
export const ToolbarWithOptionsWidget: Story = {
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (StoryFn: any, props: any) => {
      CUSTOM_OPTIONS_WIDGET.component = (
        <>
          <FakeToolbarWithOptions
            title='Toolbar with options'
            onAction={handleAction}
            onRemove={handleRemove}
          />
          <FakeComponent
            text={`This widget has a max/min size values (in layout units).`}
            extra={`minWidth: 3, maxWidth: 6, minHeight: 1, maxHeight: 4.`}
          />
        </>
      )
      CUSTOM_OPTIONS_WIDGET.dragHandleClassName = 'custom-draggable-toolbar'
      const WS = [...FILTER, CUSTOM_OPTIONS_WIDGET]
      const [widgets, setWidgets] = useState(WS)
      const handleChange = (dashboard: Layout) => {
        setWidgets(dashboard)
      }

      function handleAction(id: string) {
        // eslint-disable-next-line no-console
        console.log(`You fired the action for widget: \n ${id}`)
      }
      function handleRemove(id: string) {
        const newWidgets = widgets.filter((w) => w.id !== id)
        setWidgets(newWidgets)
      }

      return (
        <div style={{ height: '100%', minHeight: 800 }}>
          <Dashboard
            widgets={widgets}
            columns={props.args.columns}
            rowHeight={props.args.rowHeight}
            packing={props.args.packing}
            // dragHandleClassName='custom-draggable-toolbar'
            onChange={handleChange}
          />
        </div>
      )
    },
  ],
}

export const DragWidgetInteraction: Story = {
  args: {
    widgets: [...FILTER, CUSTOM_TOOLBAR_WIDGET],
  },
}

export const ResizeWidgetInteraction: Story = {
  args: {
    widgets: [...FILTER, CUSTOM_TOOLBAR_WIDGET],
  },
}

export const MaxResizeWidgetInteraction: Story = {
  args: {
    widgets: [...FILTER, { ...MIN_MAX_WIDGET_SIZE }],
  },
}

export const MinResizeWidgetInteraction: Story = {
  args: {
    widgets: [...FILTER, { ...MIN_MAX_WIDGET_SIZE }],
  },
}
