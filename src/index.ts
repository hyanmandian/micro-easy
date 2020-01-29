import "regenerator-runtime";

class MicroEasy extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('src');
    this.innerHTML = `<iframe src="${src}"></iframe>`;
  }

  static async getParent() {
    const parent = window.parent;

    console.log(parent);

    return {
      on(event: string, callback: Function) {},
      emit(event: string, payload?: any) {},
    };
  }

  static async getApplication() {
    return {
      on(event: string, callback: Function) {},
      emit(event: string, payload?: any) {},
    };
  }
}

customElements.define('micro-easy', MicroEasy);

window.onload = async function() {
  const parent = await MicroEasy.getParent();

  console.log(parent);
};
