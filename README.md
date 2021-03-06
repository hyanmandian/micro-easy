![Package size](https://badgen.net/bundlephobia/minzip/@hyanmandian/micro-easy)

# Micro Easy

The easiest way to use [Micro Frontends](https://micro-frontends.org/) approach.

## Features

- Super tiny;
- Auto resize;
- Lazy loading;
- Error handling;
- Auto handshake;
- Two way communication (child to parent and parent to child).

## Getting started

```html
<!-- load our library in parent and child app -->
<script src="https://unpkg.com/@hyanmandian/micro-easy@0.1.4/dist/micro-easy.umd.production.min.js"></script>

<!-- load your child app on parent app and interact with it -->
<button>Ping</button>
<micro-easy
  src="http://example.com/"
  name="child"
  sandbox="allow-scripts allow-same-origin"
></micro-easy>
<script>
  async function init() {
    try {
      const child = await MicroEasy.getChild('child');

      child.on('pong', () => {
        console.log('pong');
      });

      document.querySelector('button').addEventListener('click', () => {
        child.emit('ping');
      });
    } catch (e) {
      // handle error (invalid_origin | not_found)
    }
  }

  init();
</script>

<!-- wrap your child app and interact with parent app -->
<micro-easy-wrapper>
  <button>Pong</button>
</micro-easy-wrapper>
<script>
  async function init() {
    try {
      const parent = await MicroEasy.getParent();

      parent.on('ping', () => {
        console.log('ping');
      });

      document.querySelector('button').addEventListener('click', () => {
        parent.emit('pong');
      });
    } catch (e) {
      // handle error (not_embedded)
    }
  }

  init();
</script>
```

## License

[MIT](LICENSE)
