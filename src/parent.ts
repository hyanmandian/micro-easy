import { emitter, injectStyles } from './utils';

export class Parent extends HTMLElement {
  private emitter = emitter({ el: window.parent });
  private observer?: ResizeObserver;

  get on() {
    return this.emitter.on;
  }

  get emit() {
    return this.emitter.emit;
  }

  connectedCallback() {
    if (window.location === window.parent.location) {
      setTimeout(() =>
        this.dispatchEvent(new CustomEvent('error', { detail: 'not_embedded' }))
      );
    } else {
      injectStyles('body{margin:0}micro-easy-wrapper{display:inline-block}');

      this.emitter.on('@handshake', message => {
        this.emitter.emit('@handshake', message);
        this.emitter.setNamespace(message);
        this.observer = new ResizeObserver(([entry]) =>
          this.emitter.emit('@resize', entry.contentRect)
        );
        this.observer.observe(this);
        this.dispatchEvent(new CustomEvent('load'));
      });
    }
  }

  disconnectedCallback() {
    this.emitter.unlisten();
    this.observer?.disconnect();
  }
}

export function getParent(): Promise<Parent> {
  return new Promise((resolve, reject) => {
    function handleLoad() {
      resolve(el);
      el.removeEventListener('load', handleLoad);
    }

    function handleError(e: CustomEvent) {
      reject(e.detail);
      el.removeEventListener('error', handleError as EventListener);
    }

    const el = document.querySelector(`micro-easy-wrapper`) as Parent;
    el.addEventListener('load', handleLoad);
    el.addEventListener('error', handleError as EventListener);
  });
}
