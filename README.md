# ![React Dashboard](./assets/Icon-24.png) React Dashboard

![version](https://img.shields.io/badge/version-1.0.0@beta.1-brightgreen.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)
![GitHub issues](https://img.shields.io/github/issues/builtbyedgar/react-dashboard)

<p>&nbsp;</p>

![React Dashboard](./assets/Icon.png)

<p>&nbsp;</p>

Get started and build your dream dashboard with React Dashboard Component. Fast, lightweight, configurable and super easy to use! ⚡️

🚨 **DISCLAIMER** This component are under development.

---

### Introduction

Designed for ...

Save hundreds of hours trying to create and develop a dashboard from scratch.
The fastest dashboard is here. Seriously.

With Horizon UI you will find many examples for pages like NFTs Pages,
Authentication Pages, Profile and so on. Just choose between a Basic Design or a
cover and you are good to go!

### 🎉 [NEW] Features

Bla bla bla

### Documentation

Bla bla bla

### Quick Start

Install React Dashboard by running either of the following:

- Requires React v18

```bash
npm i react-dashboard@latest
```

### Example

The component is super easy to configure and work with...

#### Properties

- `widgets: Layout`
- `columns?: number` default `12`
- `rowHeight?: number` default `100`
- `margin?: [number, number]` default `[10, 10]`
- `draggableHandle?: string`
- `onChange?: (widgets: Layout) => void`
- `onResize?: () => void`

```tsx
  const widgets: Layout = [
    {
      id: uuidv4(),
      x: 0,
      y: 2,
      width: 3,
      height: 2,
      title: 'Widget 1',
      draggable: true,
      removible: true,
      component: <ComponentForWidget />,
    },
    ....
  ]

  <Dashboard
    widgets={widgets}
    columns={12}
    rowHeight={100}
    onChange={handleDashboardChange}
  />
```

#### Layout

The `Layout` interface aonly wraps an `Array` of `DashboardItem`.

```ts
interface DashboardItem {
  id: string
  x: number
  y: number
  width: number
  height: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  stationary?: boolean
  draggable?: boolean
  resizable?: boolean
  removible?: boolean
  moved?: boolean
  title?: string
  component?: JSX.Element
  options?: DashboardItemOption[]
}
```

```ts
type DashboardItemOption = {
  title?: string // To show in the Tooltip
  action: () => void
  icon: JSX.Element
}
```

### Versions

Here

### Reporting Issues

Issues

### Todo's

🚨 **IMPORTANT** This component are under development.
