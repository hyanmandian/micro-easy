import { Child, getChild } from './child';
import { Parent, getParent } from './parent';

customElements.define('micro-easy', Child);
customElements.define('micro-easy-wrapper', Parent);

(window as any).MicroEasy = { getChild, getParent };
