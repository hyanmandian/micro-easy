class MicroEasy extends HTMLElement {
  private loaded = false;

  constructor() {
    super();

    this.style.width = '0px';
    this.style.height = '0px';
    this.style.display = 'inline-block';
    this.style.opacity = '0';
    this.style.overflow = 'hidden';
    this.style.position = 'absolute';
    this.style.visibility = 'hidden';
    this.style.transition = 'all 0.5s';
  }

  handleLoad = (e: MessageEvent) => {
    const { type, payload } = e?.data || {};

    if (
      type !== 'micro-easy:loaded' ||
      this.getAttribute('name') === payload.name
    ) {
      return;
    }

    this.style.width = `${payload.size.width}px`;
    this.style.height = `${payload.size.height}px`;
    this.style.opacity = '1';
    this.style.position = 'static';
    this.style.visibility = 'visible';

    this.loaded = true;
  };

  connectedCallback() {
    window.addEventListener('message', this.handleLoad);

    const src = this.getAttribute('src');
    const name = this.getAttribute('name');

    this.innerHTML = `<iframe frameborder="0" name="${name}" src="${src}?micro-easy:name=${name}"></iframe>`;
  }

  disconnectedCallback() {
    window.removeEventListener('message', this.handleLoad);
  }
}

customElements.define('micro-easy', MicroEasy);

window.onload = function() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('micro-easy:name');

  if (!name) return;

  const size = document.querySelector('html')!.getBoundingClientRect();

  window.parent.postMessage(
    { type: 'micro-easy:loaded', payload: { name, size } },
    '*'
  );
};
