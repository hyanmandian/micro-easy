# Micro Easy

The easiest way to use [Micro Frontends](https://micro-frontends.org/) approach.

## Features

- Handshake;
- Auto resize;
- Two way communication (child to parent and parent to child).

## Getting started

First you need to load library via CDN:

```html
<script src="https://unpkg.com/hyanmandian/micro-easy.production.min.js"></script>
```

After that, you need to use `<micro-easy name="app-name" src="app-src" />` web-component to load child app inside your shell app (look at [examples/shell/index.html](https://github.com/hyanmandian/micro-easy/blob/master/examples/shell/index.html)) and wrapper the child app with `<micro-easy-wrapper />` (look at [examples/app-1/index.html](https://github.com/hyanmandian/micro-easy/blob/master/examples/app-1/index.html)).

Right now you can talk with your parent using `MicroEasy.getParent()` and talk with your child using `MicroEasy.getChild('app-name')`.

## License

[MIT](LICENSE)
