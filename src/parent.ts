import * as styles from './styles';
import { Emitter } from './emitter';

export class Parent extends HTMLElement {
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

    this.emit('micro-easy:loaded');
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.emitter.unlisten();
    this.observer.disconnect();
  }
}

export function getParent() {
  const el = document.querySelector('micro-easy-wrapper') as Parent;

  return {
    on: el.on,
    emit: el.emit,
  };
}
