import * as styles from './styles';
import { Emitter, Instance } from './emitter';

class MicroEasy extends HTMLElement {
  private emitter!: Instance;
  private iframeEl!: HTMLIFrameElement;

  constructor() {
    super();

    this.loaded = false;
  }

  get name() {
    return String(this.getAttribute('name'));
  }

  get src() {
    return this.getAttribute('src');
  }

  set loaded(value: boolean) {
    this.setAttribute('aria-hidden', String(!value));
  }

  get loaded() {
    return !Boolean(this.getAttribute('aria-hidden'));
  }

  get on() {
    return this.emitter.on;
  }

  get emit() {
    return this.emitter.emit;
  }

  connectedCallback() {
    styles.injectStyles(styles.host);

    this.iframeEl = document.createElement('iframe');
    this.iframeEl.setAttribute(
      'src',
      `${this.src}?micro-easy:name=${this.name}`
    );

    this.appendChild(this.iframeEl);

    this.emitter = Emitter(this.iframeEl.contentWindow!, {
      lazy: true,
      namespace: this.name,
    });

    this.on('micro-easy:loaded', () => {
      this.loaded = true;
      this.emitter.listen();
    });

    this.on('micro-easy:resize', data => {
      this.style.width = `${data.width}px`;
      this.style.height = `${data.height}px`;
    });
  }

  disconnectedCallback() {
    this.emitter?.unlisten();
  }
}

customElements.define('micro-easy', MicroEasy);

class MicroEasyWrapper extends HTMLElement {
  private emitter = Emitter(window.parent, { namespace: this.name });
  private observer = new ResizeObserver(([entry]) =>
    this.emit('micro-easy:resize', entry.contentRect)
  );

  get name() {
    return String(
      new URLSearchParams(window.location.search).get('micro-easy:name')
    );
  }

  get on() {
    return this.emitter.on;
  }

  get emit() {
    return this.emitter.emit;
  }

  connectedCallback() {
    styles.injectStyles(styles.wrapper);

    this.emit('micro-easy:loaded', this.getBoundingClientRect());

    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.emitter.unlisten();
    this.observer.disconnect();
  }
}

customElements.define('micro-easy-wrapper', MicroEasyWrapper);
