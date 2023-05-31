# <img src="./assets/Icon.png" width="22px" height="22px" /> React Dashboard

<img src="./assets/Icon.png" width="120px" height="120px" />

<p>&nbsp;</p>

![version](https://img.shields.io/badge/version-1.0.0@beta.1-brightgreen.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)
![GitHub issues](https://img.shields.io/github/issues/builtbyedgar/react-dashboard)



<p>&nbsp;</p>

🚨 **IMPORTANT** This component are under development. Is not ready for production!
I would be delighted to have your help in getting it ready as soon as possible. If you'd like, you can create an issue [here](https://github.com/builtbyedgar/react-dashboard/issues).

---

### How to use it

**Peer dependencies**

- React v18
- React RouterDom


Install React Dashboard by running either of the following:

```bash
npm i react-dashboard@latest
```

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

### Todo's

- [x] Code refactor
- [ ] Extra features
- [ ] More Storybook examples and customizations
- [ ] Docuentation
- [ ] Test
- [ ] Publish package
