export const host = `
  micro-easy {
    width: 0px;
    height: 0px;
    display: inline-block;
    overflow: hidden;
    position: absolute;
    vertical-align: bottom;
  }

  micro-easy[aria-hidden="false"] {
    position: static;
  }

  micro-easy > iframe {
    width: 999999px;
    height: 999999px;
    border: 0px;
  }
`;

export const wrapper = `
  micro-easy-wrapper {
    display: inline-block;
  }
`;

export function injectStyles(styles: string) {
  const title = window.btoa(styles);

  if (document.querySelector(`style[title="${title}"]`)) return;

  const styleEl = document.createElement('style');
  styleEl.type = 'text/css';
  styleEl.setAttribute('title', title);
  styleEl.appendChild(document.createTextNode(styles));

  document.getElementsByTagName('head')[0].appendChild(styleEl);
}
