document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = '/api/images';

    const listEl = document.getElementById('images-list');
    const statusEl = document.getElementById('images-status');

    fetchImages();

    async function fetchImages() {
        statusEl.textContent = 'Loading images...';
        listEl.innerHTML = '';

        try {
            const resp = await fetch(API_BASE);
            if (!resp.ok) throw new Error('Failed to fetch images');
            const images = await resp.json();

            if (!images.length) {
                statusEl.textContent = 'No images yet.';
                return;
            }

            statusEl.textContent = '';
            images.forEach((img) => renderRow(img));
        } catch (err) {
            console.error(err);
            statusEl.textContent = `Error: ${err.message}`;
        }
    }

    function renderRow(img) {
        const row = document.createElement('div');
        row.className = 'image-row';

        const thumb = document.createElement('img');
        thumb.src = img.file_path;
        thumb.alt = img.original_name;

        const main = document.createElement('div');
        main.className = 'image-row-main';

        const title = document.createElement('div');
        title.className = 'image-row-title';
        title.textContent = img.original_name;

        const meta = document.createElement('div');
        meta.className = 'image-row-meta';
        const labelsCount = img.labels ? img.labels.length : 0;
        meta.textContent = `ID: ${img.id} • ${Math.round(
            (img.file_size || 0) / 1024,
        )} KB • labels: ${labelsCount}`;

        const footer = document.createElement('div');
        footer.className = 'image-row-footer';

        const labelsPreview = document.createElement('div');
        labelsPreview.className = 'labels-list';
        if (!labelsCount) {
            const chip = document.createElement('span');
            chip.className = 'label-chip';
            chip.textContent = '(no labels)';
            labelsPreview.appendChild(chip);
        } else {
            img.labels.slice(0, 3).forEach((label) => {
                const chip = document.createElement('span');
                chip.className = 'label-chip';
                chip.textContent = label.name;
                labelsPreview.appendChild(chip);
            });
        }

        // View / Edit + Delete
        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '8px';

        const detailLink = document.createElement('a');
        detailLink.href = `/image_detail.html?id=${img.id}`;
        detailLink.className = 'link-button';
        detailLink.textContent = 'View / Edit';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteImage(img.id));

        actions.appendChild(detailLink);
        actions.appendChild(deleteBtn);

        footer.appendChild(labelsPreview);
        footer.appendChild(actions);

        main.appendChild(title);
        main.appendChild(meta);
        main.appendChild(footer);

        row.appendChild(thumb);
        row.appendChild(main);

        listEl.appendChild(row);
    }

    async function deleteImage(id) {
    if (!confirm(`Delete image #${id}? This cannot be undone.`)) return;

    try {
      const resp = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete image');
      }
      // 刪完後重載
      await fetchImages();
    } catch (err) {
      alert(`Failed to delete image: ${err.message}`);
    }
  }
});
