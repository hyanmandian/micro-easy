import { emitter, injectStyles } from './utils';

export class Child extends HTMLElement {
  private emitter = emitter();
  private handshakeInterval?: number;

  constructor() {
    super();

    this.setAttribute('aria-hidden', 'true');
  }

  get on() {
    return this.emitter.on;
  }

  get emit() {
    return this.emitter.emit;
  }

  private handleLoad = (e: Event) => {
    const el = (e.currentTarget as HTMLIFrameElement).contentWindow!;
    const name = this.getAttribute('name') as string;

    this.emitter.setWindow(el);

    this.emitter.on('@handshake', message => {
      if (message !== name) return;

      clearInterval(this.handshakeInterval);

      this.setAttribute('aria-hidden', 'false');

      this.emitter.setNamespace(message);

      this.dispatchEvent(new CustomEvent('handshake'));
    });

    this.emitter.on('@resize', data => {
      this.style.width = `${data.width}px`;
      this.style.height = `${data.height}px`;
    });

    this.handshakeInterval = window.setInterval(() => {
      this.emitter.emit('@handshake', name);
    }, 1000);

    el.removeEventListener('load', this.handleLoad);
  };

  connectedCallback() {
    injectStyles(
      `micro-easy{width:0;height:0;display:inline-block;overflow:hidden;position:absolute;vertical-align:bottom}micro-easy[aria-hidden=false]{position:static}micro-easy>iframe{width:${Number.MAX_SAFE_INTEGER}px;height:${Number.MAX_SAFE_INTEGER}px;border:0}`
    );

    const el = document.createElement('iframe');
    el.setAttribute('src', this.getAttribute('src') as string);
    el.setAttribute('name', this.getAttribute('name') as string);
    el.addEventListener('load', this.handleLoad);

    this.appendChild(el);
  }

  disconnectedCallback() {
    this.emitter?.unlisten();
    clearInterval(this.handshakeInterval);
  }
}

export function getChild(name: string): Promise<Child> {
  return new Promise(resolve => {
    function handleHandshake() {
      resolve(el);

      el.removeEventListener('handshake', handleHandshake);
    }

    const el = document.querySelector(`micro-easy[name="${name}"]`) as Child;
    el.addEventListener('handshake', handleHandshake);
  });
}
