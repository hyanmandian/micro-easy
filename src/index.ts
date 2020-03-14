class MicroEasy extends HTMLElement {
  private el!: HTMLIFrameElement;
  private loaded = false;
  private listeners = [];
  private lazyDispatches = [];

  constructor() {
    super();

    this.style.width = '0px';
    this.style.height = '0px';
    this.style.display = 'inline-block';
    this.style.overflow = 'hidden';
    this.style.position = 'absolute';
    this.style.visibility = 'hidden';

    this.on('micro-easy:loaded', (payload: any) => {
      this.style.width = `${payload.width}px`;
      this.style.height = `${payload.height}px`;
      this.style.position = 'static';
      this.style.visibility = 'visible';

      this.loaded = true;

      this.lazyDispatches.forEach(this.dispatch);
      this.lazyDispatches = [];
    });
  }

  get name() {
    return this.getAttribute('name');
  }

  get src() {
    return this.getAttribute('src');
  }

  on = (type, listener) => {
    this.listeners = [...this.listeners, { type, listener }];
  };

  dispatch = action => {
    if (!this.loaded) {
      return (this.lazyDispatches = [...this.lazyDispatches, action]);
    }

    this.el.contentWindow.postMessage({
      name: this.name,
      ...action,
    });
  };

  handleMessage = (e: MessageEvent) => {
    const { type, name, payload } = e?.data || {};

    this.listeners.forEach(event => {
      if (this.name !== name || type !== event.type) return;

      event.listener(payload);
    });
  };

  connectedCallback() {
    window.addEventListener('message', this.handleMessage);

    this.el = document.createElement('iframe');
    this.el.setAttribute('src', `${this.src}?micro-easy:name=${this.name}`);
    this.el.frameBorder = '0px';
    this.el.style.width = '999999px';
    this.el.style.height = '999999px';

    this.appendChild(this.el);
  }

  disconnectedCallback() {
    window.removeEventListener('message', this.handleMessage);
  }
}

customElements.define('micro-easy', MicroEasy);

class MicroEasyWrapper extends HTMLElement {
  private listeners = [];

  constructor() {
    super();

    this.style.display = 'inline-block';
    this.style.paddingRight = '2px';
    this.style.paddingLeft = '2px';
    this.style.paddingBottom = '1px';
  }

  get name() {
    const params = new URLSearchParams(window.location.search);
    return params.get('micro-easy:name')!;
  }

  on = (type, listener) => {
    this.listeners = [...this.listeners, { type, listener }];
  };

  dispatch = action => {
    window.parent.postMessage(
      {
        name: this.name,
        ...action,
      },
      '*'
    );
  };

  handleMessage = (e: MessageEvent) => {
    const { type, name, payload } = e?.data || {};

    this.listeners.forEach(event => {
      if (this.name !== name || type !== event.type) return;

      event.listener(payload);
    });
  };

  connectedCallback() {
    window.addEventListener('message', this.handleMessage);

    this.dispatch({
      type: 'micro-easy:loaded',
      payload: this.getBoundingClientRect(),
    });
  }

  disconnectedCallback() {
    window.removeEventListener('message', this.handleMessage);
  }
}

customElements.define('micro-easy-wrapper', MicroEasyWrapper);
