const { ipcRenderer } = require('electron');

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
  // console.log(event);
  debounceProcessMd();
  checkWindowTitle(event);
  updateWindowTitle();
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
