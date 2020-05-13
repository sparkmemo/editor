const { ipcRenderer } = require('electron');
const url = require('url');

const leftEl = document.getElementById('left');
const rightEl = document.getElementById('right');
const mdSourceEl = document.getElementById('mdSource');
const mdOutputEl = document.getElementById('mdOutput');

let displayMode;
let lastKeyTimeStamp = 0;

let fileName = 'Untitled.md';
let filePath = '';
let fileSaved = true;

function clearDisplayMode(el) {
  el.className = '';
}

function applyDisplayMode(mode) {
  clearDisplayMode(leftEl);
  clearDisplayMode(rightEl);
  switch (mode) {
    case 'edit':
      leftEl.classList.add('left', 'left--expand');
      rightEl.classList.add('right', 'right--hide');
      break;
    case 'read':
      leftEl.classList.add('left', 'left--hide');
      rightEl.classList.add('right', 'right--expand');
      break;
    default:
    case 'standard':
      leftEl.classList.add('left');
      rightEl.classList.add('right');
      break;
  }
  displayMode = mode;
}

function insertMarkdown(insertContent) {
  const prevSelectStart = mdSourceEl.selectionStart;
  const prevSelectEnd = mdSourceEl.selectionEnd;
  const beforeContent = mdSourceEl.value.substring(0, prevSelectStart);
  const afterContent = mdSourceEl.value.substring(prevSelectStart);
  mdSourceEl.value = beforeContent + insertContent + afterContent;
  mdSourceEl.selectionStart = prevSelectStart + insertContent.length;
  mdSourceEl.selectionEnd = prevSelectEnd + insertContent.length;
}

function shiftCursor(indexDelta) {
  mdSourceEl.focus();
  const prevSelectStart = mdSourceEl.selectionStart;
  const prevSelectEnd = mdSourceEl.selectionEnd;
  mdSourceEl.setSelectionRange(prevSelectStart + indexDelta, prevSelectEnd + indexDelta);
}

const debounceProcessMd = _.debounce(() => {
  mdOutputEl.innerHTML = renderMd(mdSourceEl.value);
  postRenderMd();
}, 100, { maxWait: 300 });

function updateWindowTitle() {
  document.title = `${fileName + (fileSaved ? '' : '*')} - SparkMEMO Editor`;
}

function checkWindowTitle(event) {
  const timeStampDelta = event.timeStamp - lastKeyTimeStamp;
  if (event.key !== 'Control' && event.ctrlKey !== true && timeStampDelta > 100) {
    fileSaved = false;
  }
  lastKeyTimeStamp = event.timeStamp;
}

function initEditor() {
  applyDisplayMode('standard');
  updateWindowTitle();
}

// End of func declaration
// Add event listener
mdSourceEl.addEventListener('keyup', (event) => {
  event.preventDefault();
  if (event.key === 'Tab') {
    insertMarkdown('\t');
  }
  debounceProcessMd();
  checkWindowTitle(event);
  updateWindowTitle();
});

mdSourceEl.addEventListener('drop', (event) => {
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  for (let file of fileList) {
    const fileURL = url.pathToFileURL(file.path).href;
    insertMarkdown(`![](${fileURL})`);
    debounceProcessMd();
    fileSaved = false;
    updateWindowTitle();
  }
});

// Start to exec func
initEditor();

// IPC for Electron
// Load file
ipcRenderer.on('load-prepare-request', () => {
  ipcRenderer.send('load-prepare-reply', {
    fileSaved,
  });
});

ipcRenderer.on('load-process-request', (event, request) => {
  mdSourceEl.value = request.fileContent;
  debounceProcessMd();
  fileName = request.fileName;
  filePath = request.filePath;
  fileSaved = true;
  updateWindowTitle();
});

// Save file
ipcRenderer.on('save-prepare-request', () => {
  ipcRenderer.send('save-prepare-reply', {
    fileName,
    filePath,
    mdSource: mdSourceEl.value,
  });
});

ipcRenderer.on('save-process-request', (event, request) => {
  fileName = request.fileName;
  filePath = request.filePath;
  fileSaved = true;
  updateWindowTitle();
});

// Save as file
ipcRenderer.on('saveAs-prepare-request', () => {
  ipcRenderer.send('saveAs-prepare-reply', {
    mdSource: mdSourceEl.value,
  });
});

ipcRenderer.on('saveAs-process-request', () => {
  fileSaved = true;
  updateWindowTitle();
});

// Export to PDF
ipcRenderer.on('exportToPDF-request', () => {
  ipcRenderer.send('exportToPDF-reply');
});

// Insert Markdown
ipcRenderer.on('insertMd-request', (event, insertType) => {
  switch (insertType) {
    case 'heading1':
      insertMarkdown('# ');
      break;
    case 'heading2':
      insertMarkdown('## ');
      break;
    case 'heading3':
      insertMarkdown('### ');
      break;
    case 'heading4':
      insertMarkdown('#### ');
      break;
    case 'heading5':
      insertMarkdown('##### ');
      break;
    case 'heading6':
      insertMarkdown('###### ');
      break;
    case 'bold':
      insertMarkdown('****');
      shiftCursor(-2);
      break;
    case 'italic':
      insertMarkdown('**');
      shiftCursor(-1);
      break;
    case 'strikethrough':
      insertMarkdown('~~~~');
      shiftCursor(-2);
      break;
    case 'inlineCode':
      insertMarkdown('``');
      shiftCursor(-1);
      break;
    case 'inlineMath':
      insertMarkdown('\\\\(\\\\)');
      shiftCursor(-3);
      break;
    case 'codeBlock':
      insertMarkdown('```\n```');
      shiftCursor(-4);
      break;
    case 'mathBlock':
      insertMarkdown('$$$$');
      shiftCursor(-2);
      break;
    case 'hyperlink':
      insertMarkdown('[]()');
      shiftCursor(-3);
      break;
    case 'image':
      insertMarkdown('![]()');
      shiftCursor(-3);
      break;
    case 'quote':
      insertMarkdown('> ');
      break;
    case 'horizontalRule':
      insertMarkdown('---');
      break;
    default:
      break;
  }
  debounceProcessMd();
  fileSaved = false;
  updateWindowTitle();
});

// Close window check
ipcRenderer.on('close-prepare-request', () => {
  ipcRenderer.send('close-prepare-reply', {
    fileSaved,
  });
});
