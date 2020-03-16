export type Options = {
  lazy?: boolean;
  origin?: string;
  namespace: string;
};

export type Listener = {
  type: string;
  handler: (data?: any) => void;
};

export type Action = {
  type: string;
  message?: any;
};

export type Instance = {
  on: (type: string, callback: (data?: any) => void) => void;
  emit: (type: string, message: any) => void;
  listen: () => void;
  unlisten: () => void;
};

export function Emitter(el: Window, options: Options): Instance {
  let listen = !(options.lazy ?? false);
  let lazy: Action[] = [];
  let listeners: Listener[] = [];

  function emit(type: string, message?: any) {
    if (!listen) {
      lazy = [...lazy, { type, message }];
    } else {
      el.postMessage(
        { namespace: options.namespace, type, message },
        options.origin ?? '*'
      );
    }
  }

  function handleMessage(e: MessageEvent) {
    const data = e?.data || {};

    listeners.forEach(listener => {
      if (data.namespace === options.namespace && data.type === listener.type) {
        listener.handler(data.message);
      }
    });
  }

  window.addEventListener('message', handleMessage);

  return {
    emit,
    listen() {
      listen = true;

      lazy.forEach(({ type, message }, i) => {
        this.emit(type, message);
        delete listeners[i];
      });
    },
    on(type, handler) {
      listeners = [...listeners, { type, handler }];
    },
    unlisten() {
      window.removeEventListener('message', handleMessage);
    },
  };
}
