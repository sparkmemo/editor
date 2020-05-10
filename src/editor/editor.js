const leftEl = document.getElementById('left');
const rightEl = document.getElementById('right');
const mdSourceEl = document.getElementById('mdSource');
const mdOutputEl = document.getElementById('mdOutput');

let displayMode;

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

function initEditor() {
  applyDisplayMode('standard');
}

// End of func declaration
// Add event listener
mdSourceEl.addEventListener('keyup', () => {
  debounceProcessMd();
});

// Start to exec func
initEditor();
