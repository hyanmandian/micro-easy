import { emitter, injectStyles } from './utils';

export class Child extends HTMLElement {
  private emitter = emitter({
    origin: this.getAttribute('origin') || undefined,
  });
  private observer?: IntersectionObserver;
  private handshakeRef?: number;

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

      clearInterval(this.handshakeRef);

      this.emitter.setNamespace(message);
      this.setAttribute('aria-hidden', 'false');
      this.dispatchEvent(new CustomEvent('load'));
    });

    this.emitter.on('@resize', data => {
      this.style.width = `${data.width}px`;
      this.style.height = `${data.height}px`;
    });

    this.handshakeRef = window.setInterval(() => {
      try {
        this.emitter.emit('@handshake', name);
      } catch (e) {
        clearInterval(this.handshakeRef);

        this.dispatchEvent(
          new CustomEvent('error', { detail: 'invalid_origin' })
        );
      }
    }, 1000);

    el.removeEventListener('load', this.handleLoad);
  };

  private async load() {
    const src = this.getAttribute('src') as string;

    try {
      const { ok, statusText } = await fetch(src, { method: 'HEAD' });

      if (!ok) throw new Error(statusText);

      const el = document.createElement('iframe');
      el.setAttribute('src', src);
      el.setAttribute('name', this.getAttribute('name') as string);
      el.setAttribute('sandbox', this.getAttribute('sandbox') as string);
      el.setAttribute('frameborder', '0');
      el.addEventListener('load', this.handleLoad);

      this.appendChild(el);
    } catch (e) {
      this.dispatchEvent(new CustomEvent('error', { detail: 'not_found' }));
    }
  }

  connectedCallback() {
    injectStyles(
      `micro-easy{width:0;height:0;display:inline-block;overflow:hidden;position:absolute;vertical-align:bottom}micro-easy[aria-hidden=false]{position:static}micro-easy>iframe{width:${Number.MAX_SAFE_INTEGER}px;height:${Number.MAX_SAFE_INTEGER}px;}`
    );

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.observer?.disconnect();
        this.load();
      }
    });
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.emitter?.unlisten();
    clearInterval(this.handshakeRef);
    this.observer?.disconnect();
  }
}

export function getChild(name: string): Promise<Child> {
  return new Promise((resolve, reject) => {
    function handleLoad() {
      resolve(el);
      el.removeEventListener('load', handleLoad);
    }

    function handleError(e: CustomEvent) {
      reject(e.detail);
      el.removeEventListener('error', handleError as EventListener);
    }

    const el = document.querySelector(`micro-easy[name="${name}"]`) as Child;
    el.addEventListener('load', handleLoad);
    el.addEventListener('error', handleError as EventListener);
  });
}
