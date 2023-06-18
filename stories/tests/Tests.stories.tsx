// @ts-ignore
import { expect } from '@storybook/jest'
import { Meta, StoryObj } from '@storybook/react'
import { fireEvent, within } from '@storybook/testing-library'
import { CSSProperties, MouseEvent, useState } from 'react'
import {
  CustomToolbarProps,
  Dashboard,
  DashboardProps,
  Layout,
  WidgetProps,
} from '../../src'
import { calcPosition, setWidgetStyle, uuidv4 } from '../../src/utils/utils'
import '../dashboard.css'

/**
 * This utility method returns a string representation of the CSS properties
 *
 * @param style {CSSProperties}
 */
const styleString = (style: CSSProperties) =>
  Object.entries(style)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ')
    .concat(';')

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const CUSTOM_TOOLBAR_TITLE = 'Widget 2 (with custom toolbar)'

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

function FakeToolbar({ title, className }: CustomToolbarProps): JSX.Element {
  return (
    <div className={`custom-toolbar ${className}`} data-testid='fake-toolbar'>
      <p>{title}</p>
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
    <div className={`custom-toolbar ${className}`} data-testid='fake-toolbar'>
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
  title: 'Widget 2 (fixed)',
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
  title: 'Widget 2 (not draggable)',
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
  title: 'Widget 2 (not resizable)',
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
  title: 'Widget 2 (min/max size)',
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
  title: CUSTOM_TOOLBAR_TITLE,
  draggable: true,
  resizable: true,
  fixed: false,
  toolbar: <FakeToolbar />,
  component: <FakeComponent text={`This widget has no toolbar`} />,
}

const CUSTOM_OPTIONS_WIDGET: WidgetProps = {
  id: uuidv4(),
  x: 3,
  y: 0,
  width: 6,
  height: 2,
  title: CUSTOM_TOOLBAR_TITLE,
  component: <FakeComponent />,
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
    fixed: false,
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
    fixed: false,
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
    fixed: false,
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
    fixed: false,
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
    fixed: false,
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
    fixed: false,
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
    fixed: false,
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
    fixed: false,
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
    fixed: false,
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
    fixed: false,
    component: <FakeComponent />,
  },
]

type Story = StoryObj<typeof Dashboard>

const tests: Meta<typeof Dashboard> = {
  title: 'Tests',
  component: Dashboard,
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
        />
      </div>
    )
  },
} as Meta<typeof Dashboard>

export default tests

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
export const Default: Story = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const wrapper = canvas.getByTestId('wrapper')
    const columns = args.columns || 12
    const margin = args.margin || [10, 10]
    const dashWidth = wrapper.getBoundingClientRect().width
    const columnWidth = (dashWidth - 10) / columns - margin[0]
    const rowHeight = 100
    const dashboard = wrapper.querySelector('.dashup.dashup-dashboard')

    await step('Render the dashboard and the widgets', async () => {
      await expect(dashboard).toBeInTheDocument()

      await new Promise((resolve) => setTimeout(resolve, 200))
      const widgets = dashboard?.querySelectorAll('.dashup-widget')
      expect(widgets).toHaveLength(10)

      const array = Array.from(widgets || [])

      const widget = array.at(0) as HTMLElement
      expect(widget).toHaveClass('dashup-widget')
    })

    await step('Widgets are render correctly', async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      dashboard?.querySelectorAll('.dashup-widget').forEach((widget, index) => {
        expect(widget).toHaveClass('dashup-widget')

        const props = args.widgets[index]
        const { x, y, width, height } = calcPosition(
          props.x,
          props.y,
          props.width,
          props.height,
          columnWidth,
          rowHeight,
          margin,
        )
        const newStyle = setWidgetStyle(x, y, width, height)
        const returnedStyle = styleString(newStyle).concat(
          ` transform: matrix(1, 0, 0, 1, ${x}, ${y});`,
        )
        const widgetStyle = JSON.stringify(widget.getAttribute('style'))
        const calculatedStyle = JSON.stringify(styleString(newStyle))

        expect(widget).toHaveStyle(returnedStyle)
        expect(widgetStyle).toBe(calculatedStyle)
      })
    })
  },
}

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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const wrapper = canvas.getByTestId('wrapper')
    const dashboard = wrapper.querySelector('.dashup.dashup-dashboard')

    await step('Render fixed widget correctly', async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const widget = dashboard?.querySelectorAll(
        '.dashup-widget',
      )[9] as HTMLElement
      expect(widget).toHaveClass('fixed')
    })
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const wrapper = canvas.getByTestId('wrapper')
    const dashboard = wrapper.querySelector('.dashup.dashup-dashboard')

    await step('Render not draggable widget correctly', async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const widget = dashboard?.querySelectorAll(
        '.dashup-widget',
      )[9] as HTMLElement
      expect(widget).not.toHaveClass('draggable')
    })
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const wrapper = canvas.getByTestId('wrapper')
    const dashboard = wrapper.querySelector('.dashup.dashup-dashboard')

    await step('Render not resizable widget correctly', async () => {
      await sleep(200)
      const widget = dashboard?.querySelectorAll(
        '.dashup-widget',
      )[9] as HTMLElement
      expect(widget).not.toHaveClass('resizable')
    })
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
 * @todo
 */
export const NotPackingLayout: Story = {
  args: {
    packing: false,
    widgets: [...FILTER, FIXED_WIDGET],
  },
  render: (args) => {
    return (
      <div
        style={{ width: '100%', height: '100%', minHeight: 800 }}
        data-testid='wrapper'
      >
        <Dashboard
          widgets={args.widgets}
          columns={args.columns}
          packing={args.packing}
          rowHeight={args.rowHeight}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const wrapper = await canvas.getByTestId('wrapper')

    expect(wrapper).toBeInTheDocument()
  },
}

/**
 * @todo
 */
export const ToolbarWithOptionsWidget: Story = {
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (StoryFn: any, props: any) => {
      CUSTOM_OPTIONS_WIDGET.toolbar = (
        <FakeToolbarWithOptions
          onAction={handleAction}
          onRemove={handleRemove}
        />
      )
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
            onChange={handleChange}
          />
        </div>
      )
    },
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const toolbar = await canvas.findByTestId('fake-toolbar')

    await step('Render widget with toolbar options correctly', async () => {
      expect(toolbar).toBeInTheDocument()
      expect(toolbar).toHaveClass('custom-toolbar')
    })

    await step('Custom toolbar has dragable class', async () => {
      expect(toolbar).toHaveClass('draggable-handle')
    })

    await step('Custom toolbar render title correctly', async () => {
      const test = await canvas.findByText(CUSTOM_TOOLBAR_TITLE)
      expect(test).toBeInTheDocument()
    })

    await step('Custom toolbar render options correctly', async () => {
      const action = await canvas.findByTestId('action-button')
      const remove = await canvas.findByTestId('remove-button')
      const link = await canvas.findByTestId('link')

      expect(action).toBeInTheDocument()
      expect(remove).toBeInTheDocument()
      expect(link).toBeInTheDocument()
    })

    await step('prevent drag if target is not toolbar', async () => {
      const widget = (await toolbar.parentElement) as HTMLElement
      const action = await canvas.findByTestId('action-button')

      await sleep(100)
      await fireEvent.click(action)
      // Chrome console will be log a message saying: You fired the action for widget ${id}
      expect(widget).not.toHaveClass('dragging')
    })
  },
}

export const DragWidgetInteraction: Story = {
  args: {
    widgets: [...FILTER, CUSTOM_TOOLBAR_WIDGET],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const wrapper = await canvas.getByTestId('wrapper')
    const columns = args.columns || 12
    const margin = args.margin || [10, 10]
    const dashWidth = wrapper.getBoundingClientRect().width
    const columnWidth = (dashWidth - 10) / columns - margin[0]
    const toolbar = await canvas.findByTestId('fake-toolbar')

    await sleep(1000)
    await fireEvent.mouseDown(toolbar)

    await sleep(500)
    await fireEvent.mouseMove(toolbar, {
      clientX: -(columnWidth * 2.8),
      clientY: 0,
    })

    await sleep(1000)
    await fireEvent.mouseUp(toolbar, {
      clientX: -(columnWidth * 2.8),
      clientY: 0,
    })

    expect(args.widgets[9].x).toBe(0)
  },
}

export const ResizeWidgetInteraction: Story = {
  args: {
    widgets: [...FILTER, CUSTOM_TOOLBAR_WIDGET],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const toolbar = await canvas.findByTestId('fake-toolbar')
    const resizer = (await toolbar.parentElement?.querySelector(
      '.resizable-handle',
    )) as HTMLElement

    await sleep(1000)
    await fireEvent.mouseDown(resizer)

    await sleep(300)
    await fireEvent.mouseMove(resizer, {
      clientX: -100,
      clientY: 100,
    })

    await sleep(400)
    await fireEvent.mouseUp(resizer, {
      clientX: -100,
      clientY: 100,
    })

    expect(args.widgets[9].width).toBe(5)
    expect(args.widgets[9].height).toBe(3)
  },
}

export const MaxResizeWidgetInteraction: Story = {
  args: {
    widgets: [...FILTER, { ...MIN_MAX_WIDGET_SIZE, toolbar: <FakeToolbar /> }],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const toolbar = await canvas.findByTestId('fake-toolbar')
    const resizer = (await toolbar.parentElement?.querySelector(
      '.resizable-handle',
    )) as HTMLElement

    await sleep(1000)
    await fireEvent.mouseDown(resizer)

    await sleep(300)
    await fireEvent.mouseMove(resizer, {
      clientX: 800,
      clientY: 800,
    })

    await sleep(400)
    await fireEvent.mouseUp(resizer, {
      clientX: 800,
      clientY: 800,
    })

    expect(args.widgets[9].width).toBe(6)
    expect(args.widgets[9].height).toBe(4)
  },
}

export const MinResizeWidgetInteraction: Story = {
  args: {
    widgets: [...FILTER, { ...MIN_MAX_WIDGET_SIZE, toolbar: <FakeToolbar /> }],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const toolbar = await canvas.findByTestId('fake-toolbar')
    const resizer = (await toolbar.parentElement?.querySelector(
      '.resizable-handle',
    )) as HTMLElement

    await sleep(1000)
    await fireEvent.mouseDown(resizer)

    await sleep(300)
    await fireEvent.mouseMove(resizer, {
      clientX: -800,
      clientY: -800,
    })

    await sleep(400)
    await fireEvent.mouseUp(resizer, {
      clientX: -800,
      clientY: -800,
    })

    expect(args.widgets[9].width).toBe(3)
    expect(args.widgets[9].height).toBe(1)
  },
}
