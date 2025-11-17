document.addEventListener('DOMContentLoaded', () => {
  const API_IMAGES = '/api/images';

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const statusEl = document.getElementById('detail-status');
  const titleEl = document.getElementById('detail-title');
  const layoutEl = document.getElementById('detail-layout');
  const imgEl = document.getElementById('detail-image');
  const metaEl = document.getElementById('detail-meta');
  const labelsEl = document.getElementById('detail-labels');
  const addForm = document.getElementById('add-label-form');
  const labelInput = document.getElementById('label-input');
  const deleteBtn = document.getElementById('delete-image-btn');

  if (!id) {
    statusEl.textContent = 'Missing image id.';
    return;
  }

  titleEl.textContent = `Image #${id}`;

  if (deleteBtn) {
    deleteBtn.addEventListener('click', onDeleteImage);
  }

  loadImage();

  async function loadImage() {
    statusEl.textContent = 'Loading image...';
    layoutEl.style.display = 'none';

    try {
      const resp = await fetch(`${API_IMAGES}/${id}`);
      if (!resp.ok) throw new Error('Image not found');

      const img = await resp.json();
      render(img);
      statusEl.textContent = '';
      layoutEl.style.display = 'grid';
    } catch (err) {
      console.error(err);
      statusEl.textContent = `Error: ${err.message}`;
    }
  }

  function render(img) {
    imgEl.src = img.file_path;
    imgEl.alt = img.original_name;

    metaEl.textContent = `${img.original_name} • ${Math.round(
      (img.file_size || 0) / 1024,
    )} KB • uploaded at ${img.uploaded_at}`;

    labelsEl.innerHTML = '';
    const labels = img.labels || [];

    if (!labels.length) {
      const chip = document.createElement('span');
      chip.className = 'label-chip';
      chip.textContent = '(no labels)';
      labelsEl.appendChild(chip);
    } else {
      labels.forEach((label) => {
        const chip = document.createElement('span');
        chip.className = 'label-chip';
        chip.textContent = label.name;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'danger';
        btn.style.marginLeft = '6px';
        btn.style.fontSize = '0.7rem';
        btn.textContent = 'remove';
        btn.addEventListener('click', () => removeLabel(label.id));

        const wrapper = document.createElement('span');
        wrapper.style.marginRight = '6px';
        wrapper.appendChild(chip);
        wrapper.appendChild(btn);
        labelsEl.appendChild(wrapper);
      });
    }
  }

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = labelInput.value.trim();
    if (!name) return;

    try {
      const resp = await fetch(`${API_IMAGES}/${id}/labels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label_name: name, confidence: 1 }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to add label');
      }
      const updated = await resp.json();
      labelInput.value = '';
      render(updated);
    } catch (err) {
      alert(`Failed to add label: ${err.message}`);
    }
  });

  async function removeLabel(labelId) {
    if (!confirm('Remove this label from image?')) return;
    try {
      const resp = await fetch(
        `${API_IMAGES}/${id}/labels/${labelId}`,
        { method: 'DELETE' },
      );
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to remove label');
      }
      const updated = await resp.json();
      render(updated);
    } catch (err) {
      alert(`Failed to remove label: ${err.message}`);
    }
  }

  async function onDeleteImage() {
    if (!confirm(`Delete image #${id}? This cannot be undone.`)) return;
    try {
      const resp = await fetch(`${API_IMAGES}/${id}`, {
        method: 'DELETE',
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete image');
      }
      // 刪除回到 Images
      window.location.href = '/images.html';
    } catch (err) {
      alert(`Failed to delete image: ${err.message}`);
    }
  }
});

