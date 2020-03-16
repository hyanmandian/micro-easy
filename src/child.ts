import * as styles from './styles';
import { Emitter, Instance } from './emitter';

export class Child extends HTMLElement {
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

export function getChild(name: string) {
  const el = document.querySelector(`micro-easy[name="${name}"]`) as Child;

  return {
    on: el.on,
    emit: el.emit,
  };
}
