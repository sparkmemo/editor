const { ipcRenderer } = require("electron");
const { msgChannel } = require("../../core/const");

const sourceEl = document.getElementById("source");
const outputEl = document.getElementById("output");
let fileMeta = {
  path: undefined,
  changed: false,
};

const regex = {
  frontmatter: /^---\n(.*?)\n---/s,
  katex: {
    block: /\$\$\n(.+?)\n\$\$/gs,
    inline: /\$(.+?)\$/g,
  },
};

init();
setupIPC();

/**
 * Initialize editor
 */
function init() {
  const renderer = {
    code(code, infostring) {
      const lang = (infostring || "").match(/\S*/)[0];

      if (
        (code.match(/^sequenceDiagram/) || code.match(/^graph/)) &&
        lang.match(/mermaid/i)
      ) {
        return `<div class="lang-mermaid">${code}</div>`;
      }

      if (lang) {
        return `<pre><code class="lang-${lang}">${code}</code></pre>\n`;
      }

      return `<pre><code class="lang-text">${code}</code></pre>\n`;
    },
  };
  marked.use({ renderer });
  mermaid.initialize({ theme: "neutral" });
  sourceEl.addEventListener("keyup", () => {
    fileMeta.changed = true;
    render();
  });
  sourceEl.addEventListener("drop", handleDrop);
  window.addEventListener("beforeunload", handleClose);
}

/**
 * Setting up all IPC event listeners
 */
function setupIPC() {
  ipcRenderer.on(msgChannel.open, (_, args, newContent) => {
    const open = (args, newContent) => {
      sourceEl.value = newContent;
      fileMeta = {
        ...fileMeta,
        ...args,
      };
      render();
    };
    if (sourceEl.value) {
      const shouldProceed = ipcRenderer.sendSync(
        msgChannel.saveBeforeNext,
        fileMeta,
        sourceEl.value
      );
      if (shouldProceed) {
        open(args, newContent);
      }
    } else {
      open(args, newContent);
    }
  });

  ipcRenderer.on(msgChannel.saveReq, () => {
    ipcRenderer
      .invoke(msgChannel.save, fileMeta, sourceEl.value)
      .then((res) => {
        const [shouldProceed, path = undefined] = res;
        console.log(res);
        if (shouldProceed) {
          if (path) {
            fileMeta.path = path;
          }
          setTimeout(() => {
            fileMeta.changed = false;
          }, 200);
        }
      });
  });

  ipcRenderer.on(msgChannel.saveAsReq, () => {
    ipcRenderer
      .invoke(msgChannel.saveAs, fileMeta, sourceEl.value)
      .then((shouldProceed) => {
        if (shouldProceed) {
          setTimeout(() => {
            fileMeta.changed = false;
          }, 200);
        }
      });
  });
}

/**
 * Renders the output based on source.
 */
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
    } catch (err) {
      console.log("Mermaid", err);
    }
  });

  // Katex
  outputEl.querySelectorAll("div.lang-katex-block").forEach((block) => {
    try {
      katex.render(block.textContent, block, {
        displayMode: true,
      });
    } catch (err) {
      console.log("Katex - Block", err);
    }
  });
  outputEl.querySelectorAll("span.lang-katex-inline").forEach((block) => {
    try {
      katex.render(block.textContent, block);
    } catch (err) {
      console.log("Katex - Inline", err);
    }
  });
}

/**
 * Prerenders the source and return the common markdown
 *
 * @param {string} source - Source
 * @returns {string} - Common Markdown
 */
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
      `<div class="lang-katex-block">${match[1].trim()}</div>`
    );
  }

  // Katex - Inline
  const katexInline = source.matchAll(regex.katex.inline);
  for (const match of katexInline) {
    rendered = rendered.replace(
      match[0],
      `<span class="lang-katex-inline">${match[1]}</span>`
    );
  }

  return rendered;
}

/**
 * Handles the image drop event
 *
 * @param {*} e - HTML Drop Event
 */
function handleDrop(e) {
  for (const file of e.dataTransfer.files) {
    console.log(file);
    if (file.type.startsWith("image")) {
      sourceEl.value += `![${file.name}](${file.path})\n`;
      render();
    }
  }
}

/**
 * Handles the window close event
 *
 * @param {*} e - HTML BeforeUnload Event
 */
function handleClose(e) {
  if (fileMeta.changed) {
    const shouldProceed = ipcRenderer.sendSync(
      msgChannel.saveBeforeNext,
      fileMeta,
      sourceEl.value
    );
    if (!shouldProceed) {
      e.returnValue = false;
    }
  }
}
