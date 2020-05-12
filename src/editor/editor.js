const { ipcRenderer } = require('electron');

const leftEl = document.getElementById('left');
const rightEl = document.getElementById('right');
const mdSourceEl = document.getElementById('mdSource');
const mdOutputEl = document.getElementById('mdOutput');

let displayMode;

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

const debounceProcessMd = _.debounce(() => {
  mdOutputEl.innerHTML = renderMd(mdSourceEl.value);
  postRenderMd();
}, 100, { maxWait: 300 });

function updateWindowTitle() {
  document.title = `${fileName + (fileSaved ? '' : '*')} - SparkMEMO Editor`;
}

function checkWindowTitle(event) {
  if (event.key !== 'Control' && event.ctrlKey !== true) {
    fileSaved = false;
  }
}

const debounceCheckWindowTitle = _.debounce(checkWindowTitle, 100, { maxWait: 300 });

function initEditor() {
  applyDisplayMode('standard');
  updateWindowTitle();
}

// End of func declaration
// Add event listener
mdSourceEl.addEventListener('keyup', (event) => {
  // console.log(event);
  debounceProcessMd();
  debounceCheckWindowTitle(event);
  updateWindowTitle();
});

// Start to exec func
initEditor();

// IPC for Electron
ipcRenderer.on('load-prepare-request', () => {
  ipcRenderer.send('load-prepare-reply', {
    fileSaved,
  });
});

ipcRenderer.on('load-process-request', (event, req) => {
  mdSourceEl.value = req.fileContent;
  debounceProcessMd();
  fileName = req.fileName;
  filePath = req.filePath;
  fileSaved = true;
  updateWindowTitle();
});
