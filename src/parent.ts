import { emitter, injectStyles } from './utils';

export class Parent extends HTMLElement {
  private observer?: ResizeObserver;
  private emitter = emitter({ el: window.parent });

  get on() {
    return this.emitter.on;
  }

  get emit() {
    return this.emitter.emit;
  }

  connectedCallback() {
    injectStyles('body{margin:0}micro-easy-wrapper{display:inline-block}');

    this.emitter.on('@handshake', message => {
      this.emitter.emit('@handshake', message);
      this.emitter.setNamespace(message);

      this.observer = new ResizeObserver(([entry]) => {
        this.emitter.emit('@resize', entry.contentRect);
      });

      this.observer.observe(this);

      this.dispatchEvent(new CustomEvent('handshake'));
    });
  }

  disconnectedCallback() {
    this.emitter.unlisten();
    this.observer?.disconnect();
  }
}

export function getParent(): Promise<Parent> {
  return new Promise(resolve => {
    function handleHandshake() {
      resolve(el);

      el.removeEventListener('handshake', handleHandshake);
    }

    const el = document.querySelector(`micro-easy-wrapper`) as Parent;
    el.addEventListener('handshake', handleHandshake);
  });
}
