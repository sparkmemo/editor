const { ipcRenderer } = require('electron');

const leftEl = document.getElementById('left');
const rightEl = document.getElementById('right');
const mdSourceEl = document.getElementById('mdSource');
const mdOutputEl = document.getElementById('mdOutput');

let displayMode;
let prevKeyTimeStamp;

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

const debounceResetFileSaved = _.debounce(() => {
  fileSaved = false;
  updateWindowTitle();
}, 100);

function initEditor() {
  applyDisplayMode('standard');
  updateWindowTitle();
}

// End of func declaration
// Add event listener
mdSourceEl.addEventListener('keyup', (event) => {
  // console.log(event);
  debounceProcessMd();
  if (event.key !== 'Control' && event.ctrlKey !== true && (event.timeStamp - prevKeyTimeStamp) > 100) {
    debounceResetFileSaved();
  }
  prevKeyTimeStamp = event.timeStamp;
});

// Start to exec func
initEditor();

// IPC for Electron
