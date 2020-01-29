import "regenerator-runtime";

class MicroEasy extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('src');
    const name = this.getAttribute('name');

    this.innerHTML = `<iframe src="${src}"></iframe>`;
  }

  static async getParent() {
    const parent = window.parent;

    return {
      on(event: string, callback: Function) {},
      emit(event: string, payload?: any) {},
    };
  }

  static async getApplication(name: string) {
    return {
      on(event: string, callback: Function) {},
      emit(event: string, payload?: any) {},
    };
  }
}

customElements.define('micro-easy', MicroEasy);

window.onload = async function() {
  window.parent.postMessage("micro-easy:loaded", "*");
};
