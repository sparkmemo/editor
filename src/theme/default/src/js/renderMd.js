import hljs from 'highlight.js';
import mermaid from 'mermaid';
import 'mathjax/es5/tex-mml-svg';
import marked from 'marked';

import '../../node_modules/github-markdown-css/github-markdown.css';
import '../css/mermaid.css';
import '../css/highlight.css';
import '../css/print.css';

mermaid.initialize({ startOnLoad: false });

const renderer = new marked.Renderer();
renderer.code = function (code, language) {
  if ((code.match(/^sequenceDiagram/) || code.match(/^graph/)) && language.match(/^mermaid/)) {
    return `<div class="mermaid">${code}</div>`;
  }

  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
  return `<pre><code class="language-${validLanguage}">${_.escape(code)}</code></pre>`;
};

function renderMd(mdSource) {
  // Convert Markdown to HTML
  return marked(mdSource, { renderer });
}

function postRenderMd() {
  // Apply highlight.js for highlighting code
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });
  // Apply mermaid.js graph
  document.querySelectorAll('.mermaid').forEach((block) => {
    try {
      mermaid.init(undefined, block);
    } catch (e) {
      block.innerHTML = '<p>Error in Mermaid syntax</p>';
      block.classList.add('mermaid--error');
    }
  });
  // Apply MathJax
  MathJax.typeset();
}

window.renderMd = renderMd;
window.postRenderMd = postRenderMd;
