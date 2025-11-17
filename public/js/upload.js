document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = '/api/images';

  const form = document.getElementById('upload-form');
  const input = document.getElementById('image-input');
  const statusEl = document.getElementById('upload-status');
  const linkEl = document.getElementById('upload-link');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    linkEl.textContent = '';

    if (!input.files || input.files.length === 0) {
      statusEl.textContent = 'Please select an image first.';
      return;
    }

    const file = input.files[0];
    const fd = new FormData();
    fd.append('image', file);

    statusEl.textContent = 'Uploading...';

    try {
      const resp = await fetch(API_BASE, {
        method: 'POST',
        body: fd,
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }

      const img = await resp.json();
      statusEl.textContent = `Upload success. Image ID = ${img.id}`;
      input.value = '';

      const url = `/image_detail.html?id=${img.id}`;
      linkEl.innerHTML = `View this image: <a href="${url}">${url}</a>`;
    } catch (err) {
      console.error(err);
      statusEl.textContent = `Upload failed: ${err.message}`;
    }
  });
});
