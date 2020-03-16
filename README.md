# Micro Easy

The easiest way to use [Micro Frontends](https://micro-frontends.org/) approach.

## Features

- Resize automatic;
- Two way communication (child to parent and parent to child);

## Getting started

First you need to load library via CDN:

```html
<script src="https://unpkg.com/hyanmandian/micro-easy.production.min.js"></script>
```

After that, you need to use `<micro-easy />` web-component to load another application inside your shell application (look at [examples/shell/index.html](https://github.com/hyanmandian/micro-easy/blob/master/examples/shell/index.html)) and wrapper the child application with `<micro-easy-wrapper />` (look at [examples/app-1/index.html](https://github.com/hyanmandian/micro-easy/blob/master/examples/app-1/index.html)).
