const API_BASE = '/api/images';

document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('upload-form');
  const imageInput = document.getElementById('image-input');
  const uploadStatus = document.getElementById('upload-status');

  const imagesContainer = document.getElementById('images-container');
  const galleryStatus = document.getElementById('gallery-status');
  const refreshBtn = document.getElementById('refresh-btn');

  // 初始化片
  fetchImages();

  // Refresh
  refreshBtn.addEventListener('click', () => {
    fetchImages();
  });

  // submit
  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!imageInput.files || imageInput.files.length === 0) {
      uploadStatus.textContent = 'Please select an image first.';
      return;
    }

    const file = imageInput.files[0];
    const formData = new FormData();
    formData.append('image', file);

    uploadStatus.textContent = 'Uploading...';

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Upload failed');
      }

      const result = await response.json();
      console.log('Uploaded image:', result);

      uploadStatus.textContent = 'Upload success.';
      imageInput.value = '';

      // 重新載入圖片
      fetchImages();
    } catch (error) {
      console.error('Upload error:', error);
      uploadStatus.textContent = `Upload failed: ${error.message}`;
    }
  });

  // 所有圖片＋labels
  async function fetchImages() {
    galleryStatus.textContent = 'Loading images...';

    try {
      const response = await fetch(API_BASE);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const images = await response.json();
      renderImages(images);
      galleryStatus.textContent =
        images.length === 0 ? 'No images yet.' : '';
    } catch (error) {
      console.error('Fetch images error:', error);
      galleryStatus.textContent = `Failed to load images: ${error.message}`;
    }
  }

  // 渲染到畫面上
  function renderImages(images) {
    imagesContainer.innerHTML = '';

    if (!images || images.length === 0) {
      return;
    }

    images.forEach((img) => {
      const card = document.createElement('div');
      card.className = 'image-card';

      // 圖片
      const imageEl = document.createElement('img');
      imageEl.src = img.file_path;
      imageEl.alt = img.original_name;

      // 資訊
      const meta = document.createElement('div');
      meta.className = 'image-meta';
      meta.textContent = `ID: ${img.id} • ${img.original_name} • ${Math.round(
        (img.file_size || 0) / 1024,
      )} KB`;

      // label
      const labelsList = document.createElement('div');
      labelsList.className = 'labels-list';

      if (img.labels && img.labels.length > 0) {
        img.labels.forEach((label) => {
          const chip = document.createElement('span');
          chip.className = 'label-chip';
          chip.textContent = label.name;
          labelsList.appendChild(chip);
        });
      } else {
        const noLabel = document.createElement('span');
        noLabel.className = 'label-chip';
        noLabel.textContent = '(no labels)';
        labelsList.appendChild(noLabel);
      }

      // label 表單
      const addLabelForm = document.createElement('form');
      addLabelForm.className = 'add-label-form';

      const labelInput = document.createElement('input');
      labelInput.type = 'text';
      labelInput.placeholder = 'Add label...';

      const addButton = document.createElement('button');
      addButton.type = 'submit';
      addButton.textContent = 'Add';

      addLabelForm.appendChild(labelInput);
      addLabelForm.appendChild(addButton);

      addLabelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const labelName = labelInput.value.trim();
        if (!labelName) return;

        try {
          const response = await fetch(`${API_BASE}/${img.id}/labels`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              label_name: labelName,
              confidence: 1.0,
            }),
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to add label');
          }

          labelInput.value = '';

          // 更新列表
          fetchImages();
        } catch (error) {
          console.error('Add label error:', error);
          alert(`Failed to add label: ${error.message}`);
        }
      });

      // 刪除按鈕
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'danger';
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'Delete image';

      deleteBtn.addEventListener('click', async () => {
        const ok = confirm(`Delete image ID ${img.id}?`);
        if (!ok) return;

        try {
          const response = await fetch(`${API_BASE}/${img.id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to delete image');
          }

          // 刪除後重載
          fetchImages();
        } catch (error) {
          console.error('Delete image error:', error);
          alert(`Failed to delete image: ${error.message}`);
        }
      });

      // card
      card.appendChild(imageEl);
      card.appendChild(meta);
      card.appendChild(labelsList);
      card.appendChild(addLabelForm);
      card.appendChild(deleteBtn);

      imagesContainer.appendChild(card);
    });
  }
});
