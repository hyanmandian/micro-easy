# Micro Easy

The easiest way to use [Micro Frontends](https://micro-frontends.org/) approach.

## Features

- Super tiny ![Package size](https://badgen.net/bundlephobia/minzip/@hyanmandian/micro-easy)
- Handshake;
- Auto resize;
- Two way communication (child to parent and parent to child).

## Getting started

```html
<!-- load our library in parent and child app -->
<script src="https://unpkg.com/@hyanmandian/micro-easy@0.1.1/dist/micro-easy.umd.production.min.js"></script>

<!-- load your child app on parent app and interact with it -->
<button>Ping</button>
<micro-easy name="child" src="http://example.com/"></micro-easy>
<script>
  async function init() {
    const child = await MicroEasy.getChild('child');

    child.on('pong', () => {
      console.log('pong');
    });

    document.querySelector('button').addEventListener('click', () => {
      child.emit('ping');
    });
  }

  init();
</script>

<!-- wrap your child app and interact with parent app -->
<micro-easy-wrapper>
  <button>Pong</button>
</micro-easy-wrapper>
<script>
  async function init() {
    const parent = await MicroEasy.getParent();

    parent.on('ping', () => {
      console.log('ping');
    });

    document.querySelector('button').addEventListener('click', () => {
      parent.emit('pong');
    });
  }

  init();
</script>
```

## License

[MIT](LICENSE)
