export type Options = {
  lazy?: boolean;
  origin?: string;
  namespace?: string;
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
  emit: (type: string, message?: any) => void;
  flush: () => void;
  unlisten: () => void;
};

export function Emitter(el: Window, options?: Options): Instance {
  let lazy = options?.lazy ?? false;
  let listeners: Listener[] = [];
  let pendingActions: Action[] = [];

  function emit(type: string, message?: any) {
    if (lazy) {
      pendingActions = [...pendingActions, { type, message }];
    } else {
      el.postMessage(
        { namespace: options?.namespace, type, message },
        options?.origin ?? '*'
      );
    }
  }

  function handleMessage({ data }: MessageEvent) {
    listeners.forEach(listener => {
      if (
        data.namespace === options?.namespace &&
        data.type === listener.type
      ) {
        listener.handler(data.message);
      }
    });
  }

  window.addEventListener('message', handleMessage);

  return {
    emit,
    flush() {
      lazy = false;

      pendingActions.forEach(({ type, message }, i) => {
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
