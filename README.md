# Weberlo Icons for React

<p align="center">
Implementation of the Weberlo Icons library for React applications.
<p>

## Development

Install dependencies  (yarn or pnpm)

```
yarn 
```

Run the development server (yarn or pnpm)

```
yarn build
```


## Installation

```
yarn add @weberlo/icons-react
```

or

```
npm install @weberlo/icons-react
```

or

```
pnpm install @weberlo/icons-react
```


## How to use

It's build with ESmodules so it's completely tree-shakable. Each icon can be imported as a component.

```js
import { IconArrowLeft } from '@weberlo/icons-react';

const App = () => {
  return <IconArrowLeft />;
};

export default App;
```

You can pass additional props to adjust the icon.

```js
<IconArrowLeft color="red" size={48} />
```

### Props

| name          | type     | default      |
| ------------- | -------- | ------------ |
| `size`        | _Number_ | 24           |
| `color`       | _String_ | currentColor |
| `stroke`      | _Number_ | 2            |


## License

Weberlo Icons is licensed under the [MIT License](https://github.com/weberlo/weberlo-icons/blob/master/LICENSE).

