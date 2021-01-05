const sourceEl = document.getElementById("source");
const outputEl = document.getElementById("output");

const regex = {
  frontmatter: /^---\n(.*?)\n---/s,
  katex: {
    block: /\$\$\n(.+?)\n\$\$/gs,
    inline: /\$(.+?)\$/gs,
  },
};

init();

function init() {
  const renderer = {
    code(code, infostring) {
      const lang = (infostring || "").match(/\S*/)[0];

      if (
        (code.match(/^sequenceDiagram/) || code.match(/^graph/)) &&
        lang.match(/mermaid/i)
      ) {
        return '<div class="lang-mermaid">' + code + "</div>";
      }

      if (lang) {
        return '<pre><code class="' + lang + '">' + code + "</code></pre>\n";
      }

      return '<pre><code class="lang-text">' + code + "</code></pre>\n";
    },
  };
  marked.use({ renderer });
  mermaid.initialize({ theme: "neutral" });
  sourceEl.addEventListener("keyup", render);
  sourceEl.addEventListener("drop", handleDrop);
}

function render() {
  const source = prerender(sourceEl.value);
  outputEl.innerHTML = marked(source);

  // Code Highlighting
  outputEl.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightBlock(block);
  });

  // Mermaid Graph
  outputEl.querySelectorAll("div.lang-mermaid").forEach((block, index) => {
    try {
      mermaid.mermaidAPI.render(
        `mermaid-graph-${index}`,
        block.textContent,
        (svg) => {
          block.innerHTML = svg;
        }
      );
    } catch (err) {}
  });

  // Katex
  outputEl.querySelectorAll("div.lang-katex-block").forEach((block) => {
    try {
      katex.render(block.textContent, block, {
        displayMode: true,
      });
    } catch (err) {}
  });
  outputEl.querySelectorAll("span.lang-katex-inline").forEach((block) => {
    try {
      katex.render(block.textContent, block);
    } catch (err) {}
  });
}

function prerender(source) {
  let rendered = source;

  // Frontmatter
  const frontmatter = source.match(regex.frontmatter);
  if (frontmatter) {
    rendered = rendered.replace(
      frontmatter[0],
      `<div class="frontmatter"><pre><code class="lang-yaml">${frontmatter[1]}</code></pre></div>`
    );
  }

  // Katex - Block
  const katexBlock = source.matchAll(regex.katex.block);
  for (const match of katexBlock) {
    rendered = rendered.replace(
      match[0],
      `<div class="lang-katex-block">` + match[1].trim() + "</div>"
    );
  }

  // Katex - Inline
  const katexInline = source.matchAll(regex.katex.inline);
  for (const match of katexInline) {
    rendered = rendered.replace(
      match[0],
      `<span class="lang-katex-inline">` + match[1] + "</span>"
    );
  }

  return rendered;
}

function handleDrop(e) {
  for (const file of e.dataTransfer.files) {
    console.log(file);
    if (file.type.startsWith("image")) {
      sourceEl.value += `![${file.name}](${file.path})\n`;
      render();
    }
  }
}
