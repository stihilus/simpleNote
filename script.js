const editor = document.getElementById('editor');
const headerList = document.getElementById('header-list');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const downloadLink = document.getElementById('download-link');
const uploadLink = document.getElementById('upload-link');
const fileInput = document.getElementById('file-input');

let headers = [];

function updateHeaders() {
    const lines = editor.value.split('\n');
    headers = [];
    headerList.innerHTML = '';

    lines.forEach((line, index) => {
        if (line.startsWith('# ')) {
            const headerText = line.substring(2);
            headers.push({ text: headerText, index: index });
            const li = document.createElement('li');
            li.textContent = headerText;
            li.addEventListener('click', () => scrollToHeader(index));
            headerList.appendChild(li);
        }
    });
}

function scrollToHeader(index) {
    const lines = editor.value.split('\n');
    const position = lines.slice(0, index).join('\n').length;
    editor.setSelectionRange(position, position);
    editor.focus();
}

function saveContent() {
    localStorage.setItem('leftContent', editor.value);
}

function loadContent() {
    const savedContent = localStorage.getItem('leftContent');
    if (savedContent) {
        editor.value = savedContent;
        updateHeaders();
    }
}

function updateCounters() {
    const text = editor.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;

    wordCount.textContent = `${words.length} words`;
    charCount.textContent = `${characters} characters`;
}

function downloadNote() {
    const text = editor.value;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'note.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function uploadNote(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        editor.value = e.target.result;
        updateHeaders();
        updateCounters();
        saveContent();
    };
    reader.readAsText(file);
}

editor.addEventListener('input', () => {
    updateHeaders();
    updateCounters();
    saveContent();
});

window.addEventListener('load', () => {
    loadContent();
    updateCounters();
});

downloadLink.addEventListener('click', (e) => {
    e.preventDefault();
    downloadNote();
});

uploadLink.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        uploadNote(file);
    }
});
