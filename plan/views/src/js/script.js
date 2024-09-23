document.addEventListener('DOMContentLoaded', async () => {
    const fileList = document.getElementById('fileList');

    // Fetch and display the list of files
    async function fetchFiles() {
        const response = await fetch('/files');
        const files = await response.json();
        fileList.innerHTML = '';
        files.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteFile(file);
            li.appendChild(deleteButton);
            fileList.appendChild(li);
        });
    }

    // Delete a file
    async function deleteFile(filename) {
        await fetch(`/files/${filename}`, { method: 'DELETE' });
        fetchFiles();
    }

    // Upload file
    document.getElementById('uploadForm').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        await fetch('/upload', {
            method: 'POST',
            body: formData,
        });
        fetchFiles();
        e.target.reset();
    };

    fetchFiles();
});
