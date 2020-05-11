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

const debounceUpdateWindowTitle = _.debounce(() => {
  document.title = `${fileName + (fileSaved ? '' : '*')} - SparkMEMO Editor`;
});

function initEditor() {
  applyDisplayMode('standard');
  debounceUpdateWindowTitle();
}

// End of func declaration
// Add event listener
mdSourceEl.addEventListener('keyup', () => {
  debounceProcessMd();
  fileSaved = false;
  debounceUpdateWindowTitle();
});

// Start to exec func
initEditor();

// IPC for Electron
ipcRenderer.on('save-request', () => {
  ipcRenderer.send('save-reply', {
    mdSource: mdSourceEl.value,
    fileName,
    filePath,
  });
});

ipcRenderer.on('save-confirm', () => {
  fileSaved = true;
  debounceUpdateWindowTitle();
});
