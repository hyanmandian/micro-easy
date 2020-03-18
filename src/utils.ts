type Type = string;
type Options = { el?: Window; origin?: string };
type Message = any;
type Handler = (message?: Message) => void;
type Namespace = string;
type Listeners = { [type: string]: Handler[] };
type EventMessage = { type: Type; message: Message; namespace: Namespace };
type MessageEvent<T> = Event & { readonly data: T }; // workaround to fix MessageEvent type: https://github.com/Microsoft/TypeScript/issues/19370

export function emitter(options?: Options) {
  let el = options?.el;
  let origin = options?.origin || '*';
  let namespace: Namespace;
  let listeners: Listeners = {};

  function emit(type: Type, message?: Message) {
    el?.postMessage({ type, message, namespace }, origin);
  }

  function handleMessage({ data }: MessageEvent<EventMessage>) {
    (listeners[data.type] || []).forEach(
      handler => data.namespace === namespace && handler(data.message)
    );
  }

  window.addEventListener('message', handleMessage);

  return {
    on(type: Type, handler: Handler) {
      (listeners[type] || (listeners[type] = [])).push(handler);
    },
    emit,
    unlisten() {
      window.removeEventListener('message', handleMessage);
    },
    setWindow(value: Options['el']) {
      el = value;
    },
    setNamespace(value: Namespace) {
      namespace = value;
    },
  };
}

export function injectStyles(styles: string) {
  const id = window.btoa(styles);

  if (document.querySelector(`style[id="${id}"]`)) return;

  const el = document.createElement('style');
  el.setAttribute('id', id);
  el.appendChild(document.createTextNode(styles));

  document.querySelector('head')?.appendChild(el);
}
