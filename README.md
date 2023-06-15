# <img src="./assets/Icon.png" width="22px" height="22px" /> Dashup

<img src="./assets/Icon.png" width="120px" height="120px" />

<p>&nbsp;</p>

![version](https://img.shields.io/badge/version-1.0.0@beta.5-brightgreen.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)
![GitHub issues](https://img.shields.io/github/issues/builtbyedgar/dashup)


<br>

This library provides a set of highly customizable and performant **React** components specifically designed for creating interactive dashboards. With a focus on simplicity and flexibility, this library empowers developers to effortlessly build stunning dashboard interfaces.

🚨 **IMPORTANT**: This component are under development. Is not ready for production!

## Features

#### 100% React & TypeScript 

The components are built using React and TypeScript, ensuring type safety and a seamless integration with your existing React projects.

#### Zero dependencies

The library has no external dependencies, making it lightweight and easy to manage.
#### Draggable and resizable widgets

Intuitively drag and rearrange widgets within the dashboard to suit your needs. Resize widgets dynamically to optimize the layout and maximize content visibility.

#### Static widgets

Create static widgets for displaying non-interactive information or visual elements.


#### Serialized layout

Save and load the dashboard layout effortlessly using a serialized format.

#### Fully customizable
Customize the appearance, behavior, and styling of the components to match your application's branding and requirements.

#### High performance

Utilizing the best practices of React performance optimization, the library ensures smooth rendering and fluid user experiences.

#### Storybook integration

Utilize the power of [Storybook](https://storybook.js.org/) for easy development and interactive documentation.


## Requirements

- React >= 18
- ReactDOM >= 18
## Usage

Install **Dashup** by running:


#### NPM

```bash
npm install dashup
```

#### Yarn

```bash
yarn add dashup
```

#### PNPM

```bash
pnpm install dashup
```

## Properties

- `widgets: Layout`
- `columns?: number` default `12`
- `rowHeight?: number` default `100`
- `margin?: [number, number]` default `[10, 10]`
- `draggableHandle?: string`
- `onChange?: (widgets: Layout) => void`
- `onResize?: () => void`

```tsx
// The `Array` of widgets (layout)
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
    stationary: false,
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
  /** in column units */
  x: number
  /** in row units */
  y: number
  /** in column units */
  width: number
  /** in row units */
  height: number
  /** in column units */
  minWidth?: number
  /** in row units */
  minHeight?: number
  /** in column units */
  maxWidth?: number
  /** in row units */
  maxHeight?: number
  stationary?: boolean
  draggable?: boolean
  resizable?: boolean
  removible?: boolean
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


## Todo's

- [x] Code refactor
- [ ] Extra features
- [ ] More Storybook examples and customizations
- [ ] Docuentation
- [ ] Test
- [ ] Publish package


## Contributing

We welcome contributions from the community! If you'd like to contribute to this project, please review our contribution guidelines and submit a pull request.

License
This project is licensed under the MIT License.
