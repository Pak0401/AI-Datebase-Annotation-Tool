document.addEventListener('DOMContentLoaded', () => {
  const API_LABELS = '/api/labels';

  const form = document.getElementById('label-form');
  const input = document.getElementById('new-label-input');
  const statusEl = document.getElementById('labels-status');
  const tbody = document.getElementById('labels-tbody');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;

    try {
      const resp = await fetch(API_LABELS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to add label');
      }
      input.value = '';
      await loadLabels(); // 新增後重載列表
    } catch (err) {
      alert(`Failed to add label: ${err.message}`);
    }
  });

  async function loadLabels() {
    statusEl.textContent = 'Loading labels...';
    tbody.innerHTML = '';

    try {
      const resp = await fetch(API_LABELS);
      if (!resp.ok) throw new Error('Failed to fetch labels');
      const labels = await resp.json();

      if (!labels.length) {
        statusEl.textContent = 'No labels yet.';
        return;
      }

      statusEl.textContent = '';
      labels.forEach((label) => {
        const tr = document.createElement('tr');

        // 第一欄：label 名字
        const tdName = document.createElement('td');
        tdName.textContent = label.name;

        // 第二欄：action 按鈕（靠右）
        const tdActions = document.createElement('td');
        tdActions.style.textAlign = 'right';

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.textContent = 'edit';
        editBtn.style.marginRight = '8px';
        editBtn.addEventListener('click', () => editLabel(label.id, label.name));

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'danger';
        removeBtn.textContent = 'remove';
        removeBtn.addEventListener('click', () => removeLabel(label.id));

        tdActions.appendChild(editBtn);
        tdActions.appendChild(removeBtn);

        tr.appendChild(tdName);
        tr.appendChild(tdActions);
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      statusEl.textContent = `Error: ${err.message}`;
    }
  }

  async function editLabel(id, oldName) {
    const next = window.prompt('Edit label name:', oldName);
    if (next == null) return; // user cancel
    const name = next.trim();
    if (!name) return;

    try {
      const resp = await fetch(`${API_LABELS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to edit label');
      }
      await loadLabels();
    } catch (err) {
      alert(`Failed to edit label: ${err.message}`);
    }
  }

  async function removeLabel(id) {
    if (!confirm('Delete this label (and all its annotations)?')) return;
    try {
      const resp = await fetch(`${API_LABELS}/${id}`, {
        method: 'DELETE',
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete label');
      }
      await loadLabels();
    } catch (err) {
      alert(`Failed to delete label: ${err.message}`);
    }
  }

  // 初始載入
  loadLabels();
});