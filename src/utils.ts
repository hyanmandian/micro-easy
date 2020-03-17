type Options = {
  el?: Window;
  origin?: string;
  namespace?: string;
};

type Listener = {
  type: string;
  handler: (data?: any) => void;
};

export function emitter(options?: Options) {
  let el = options?.el;
  let origin = options?.origin || '*';
  let namespace = options?.namespace;
  let listeners: Listener[] = [];

  function emit(type: string, message?: any) {
    el?.postMessage({ namespace, type, message }, origin);
  }

  function handleMessage({ data }: MessageEvent) {
    listeners.forEach(listener => {
      if (data.namespace === namespace && data.type === listener.type) {
        listener.handler(data.message);
      }
    });
  }

  window.addEventListener('message', handleMessage);

  return {
    on(type: Listener['type'], handler: Listener['handler']) {
      listeners = [...listeners, { type, handler }];
    },
    emit,
    unlisten() {
      window.removeEventListener('message', handleMessage);
    },
    setWindow(value: Options['el']) {
      el = value;
    },
    setNamespace(value: Options['namespace']) {
      namespace = value;
    },
  };
}

export function injectStyles(styles: string) {
  const title = window.btoa(styles);

  if (document.querySelector(`style[title="${title}"]`)) return;

  const el = document.createElement('style');
  el.type = 'text/css';
  el.setAttribute('title', title);
  el.appendChild(document.createTextNode(styles));

  document.getElementsByTagName('head')[0].appendChild(el);
}
