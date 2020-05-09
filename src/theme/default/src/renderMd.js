import hljs from 'highlight.js';
import mermaid from 'mermaid';
import '../node_modules/mathjax/es5/tex-mml-svg';
import marked from 'marked';

import './theme.css';
import './mermaid.css';
import './highlight.js.css';

mermaid.initialize({ startOnLoad: false });

const renderer = new marked.Renderer();
renderer.code = function (code, language) {
  if ((code.match(/^sequenceDiagram/) || code.match(/^graph/)) && language.match(/^mermaid/)) {
    return `<div class="mermaid">${code}</div>`;
  }

  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
  return `<pre><code class="language-${validLanguage}">${_.escape(code)}</code></pre>`;
};

function renderMd(mdSourceEl, mdOutputEl) {
  // Convert Markdown to HTML
  mdOutputEl.innerHTML = marked(mdSourceEl.value, { renderer });
  // Apply highlight.js for highlighting code
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });
  // Apply mermaid.js graph
  document.querySelectorAll('.mermaid').forEach((block) => {
    try {
      mermaid.init(undefined, block);
    } catch (e) {
      block.innerHTML = '<p><span class="material-icons">warning</span>Error in Mermaid syntax</p>';
      block.classList.add('mermaid--error');
    }
  });
  // Apply MathJax
  MathJax.typeset();
}

window.renderMd = renderMd;
