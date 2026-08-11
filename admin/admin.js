const API_BASE = 'http://localhost:5000/api';
let authToken = localStorage.getItem('southern_impex_admin_token') || '';
let currentInquiries = [];
let activeStatusFilter = 'all';
let activeCatFilter = 'all';

const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const btnLogout = document.getElementById('btn-logout');
const tbody = document.getElementById('inquiries-tbody');
const searchInput = document.getElementById('search-input');
const statusPills = document.querySelectorAll('.status-pill');

const notifBtn = document.getElementById('notif-btn');
const notifDropdown = document.getElementById('notif-dropdown');

// --- Toast Notification Helper ---
function showToast(message) {
  const container = document.getElementById('admin-toast-container');
  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Toggle Notifications Dropdown
if (notifBtn) {
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle('active');
  });
}

document.addEventListener('click', () => {
  if (notifDropdown) {
    notifDropdown.classList.remove('active');
  }
});

function initAuth() {
  if (authToken) {
    if (loginOverlay) loginOverlay.style.display = 'none';
    fetchInquiries();
  } else {
    if (loginOverlay) loginOverlay.style.display = 'flex';
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success && data.data.token) {
        authToken = data.data.token;
        localStorage.setItem('southern_impex_admin_token', authToken);
        if (loginOverlay) loginOverlay.style.display = 'none';
        showToast('Signed in successfully.');
        fetchInquiries();
      } else {
        alert(data.error || 'Authentication Failed');
      }
    } catch (err) {
      alert('Could not connect to server on http://localhost:5000');
    }
  });
}

if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    authToken = '';
    localStorage.removeItem('southern_impex_admin_token');
    if (loginOverlay) loginOverlay.style.display = 'flex';
  });
}

async function fetchInquiries() {
  try {
    const res = await fetch(`${API_BASE}/inquiries`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const result = await res.json();

    if (result.success) {
      currentInquiries = result.data || [];
      updateCounts();
      updateNotifications();
      renderTable();
    } else if (res.status === 401) {
      authToken = '';
      localStorage.removeItem('southern_impex_admin_token');
      if (loginOverlay) loginOverlay.style.display = 'flex';
    }
  } catch (err) {
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            Could not connect to backend server. Make sure backend is running on <code>http://localhost:5000</code>.
          </td>
        </tr>
      `;
    }
  }
}

function matchCategoryKeyword(str, catId) {
  if (catId === 'acrylic') return str.includes('acrylic');
  if (catId === 'flex') return str.includes('flex') || str.includes('banner');
  if (catId === 'vinyl') return str.includes('vinyl') || str.includes('starflex') || str.includes('sunstar');
  if (catId === 'acp') return str.includes('acp') || str.includes('composite') || str.includes('facade');
  if (catId === 'led') return str.includes('led') || str.includes('samsung');
  if (catId === 'pvc') return str.includes('pvc') || str.includes('sunboard') || str.includes('foam');
  if (catId === 'cloth') return str.includes('cloth') || str.includes('canvas');
  if (catId === 'pe') return str.includes('pe') || str.includes('polyethylene');
  return false;
}

function updateCounts() {
  const statTotal = document.getElementById('stat-total');
  const statPending = document.getElementById('stat-pending');
  const statProgress = document.getElementById('stat-progress');
  const statClosed = document.getElementById('stat-closed');

  if (statTotal) statTotal.textContent = currentInquiries.length;
  if (statPending) statPending.textContent = currentInquiries.filter(i => i.status === 'pending').length;
  if (statProgress) statProgress.textContent = currentInquiries.filter(i => i.status === 'contacted' || i.status === 'quote_sent').length;
  if (statClosed) statClosed.textContent = currentInquiries.filter(i => i.status === 'closed').length;

  const cats = ['all', 'acrylic', 'flex', 'vinyl', 'acp', 'led', 'pvc', 'cloth', 'pe'];
  cats.forEach(c => {
    const el = document.getElementById(`badge-${c}`);
    if (el) {
      const count = c === 'all' 
        ? currentInquiries.length 
        : currentInquiries.filter(i => matchCategoryKeyword((i.product + ' ' + i.category + ' ' + i.message).toLowerCase(), c)).length;
      el.textContent = count;
    }
  });
}

function updateNotifications() {
  const pendingList = currentInquiries.filter(i => i.status === 'pending');
  const badgeEl = document.getElementById('notif-count-badge');
  const textEl = document.getElementById('notif-count-text');
  const notifListEl = document.getElementById('notif-list');

  if (badgeEl) badgeEl.textContent = pendingList.length;
  if (textEl) textEl.textContent = `${pendingList.length} Pending`;

  if (notifListEl) {
    if (pendingList.length === 0) {
      notifListEl.innerHTML = `<div class="notif-item"><span>No pending notifications</span></div>`;
    } else {
      notifListEl.innerHTML = pendingList.slice(0, 5).map(item => `
        <div class="notif-item">
          <strong>${item.name} (${item.phone})</strong>
          <span>${item.product}</span>
        </div>
      `).join('');
    }
  }
}

window.selectSidebarCategory = function(catId) {
  activeCatFilter = catId;
  document.querySelectorAll('.sidebar .menu-item').forEach(el => {
    if (el.getAttribute('data-cat') === catId) el.classList.add('active');
    else el.classList.remove('active');
  });

  const catNames = {
    all: 'All Trade Inquiries',
    acrylic: 'Acrylic Sheets Inquiries',
    flex: 'Flex Media Inquiries',
    vinyl: 'Vinyl Media Inquiries',
    acp: 'ACP Facade Inquiries',
    led: 'Samsung LED Inquiries',
    pvc: 'PVC Sunboard Inquiries',
    cloth: 'Cloth & Canvas Inquiries',
    pe: 'PE Sheets Inquiries'
  };

  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = catNames[catId] || 'Inquiries';
  renderTable();
};

function renderTable() {
  if (!tbody) return;
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

  const filtered = currentInquiries.filter(item => {
    const itemText = (item.product + ' ' + item.category + ' ' + item.message).toLowerCase();
    
    const matchStatus = activeStatusFilter === 'all' || item.status === activeStatusFilter;
    const matchCat = activeCatFilter === 'all' || matchCategoryKeyword(itemText, activeCatFilter);
    const matchSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm) ||
      item.phone.toLowerCase().includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm) ||
      item.product.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm);

    return matchStatus && matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          No inquiries found for selected category or filters.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const dateStr = new Date(item.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
    const cleanPhone = item.phone.replace(/[^0-9]/g, '');

    return `
      <tr>
        <td>
          <div class="customer-name">${item.name}</div>
          <div class="customer-sub">📞 ${item.phone} ${item.email ? `| ✉️ ${item.email}` : ''}</div>
        </td>
        <td>
          <strong style="color:#0F172A">${item.product}</strong><br>
          <span class="material-tag">${item.category}</span>
        </td>
        <td style="color:#475569; font-weight:500">${item.branch}</td>
        <td style="max-width:280px; color:#64748B">${item.message}</td>
        <td style="color:var(--text-muted); white-space:nowrap">${dateStr}</td>
        <td>
          <span class="status-badge status-${item.status}">
            ● ${item.status.replace('_', ' ')}
          </span>
        </td>
        <td>
          <div class="quick-actions">
            <a href="https://wa.me/${cleanPhone}" target="_blank" class="btn-action-sm btn-wa">💬 WA</a>
            <select class="btn-action-sm" onchange="changeStatus('${item._id}', this.value)">
              <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="contacted" ${item.status === 'contacted' ? 'selected' : ''}>Contacted</option>
              <option value="quote_sent" ${item.status === 'quote_sent' ? 'selected' : ''}>Quote Sent</option>
              <option value="closed" ${item.status === 'closed' ? 'selected' : ''}>Closed</option>
            </select>
            <button class="btn-action-sm" onclick="deleteInquiry('${item._id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

if (statusPills) {
  statusPills.forEach(pill => {
    pill.addEventListener('click', () => {
      statusPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeStatusFilter = pill.getAttribute('data-status');
      renderTable();
    });
  });
}

if (searchInput) {
  searchInput.addEventListener('input', renderTable);
}

async function changeStatus(id, newStatus) {
  try {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Status updated to '${newStatus}'`);
      fetchInquiries();
    }
  } catch (err) {
    alert('Failed to update status');
  }
}

async function deleteInquiry(id) {
  if (!confirm('Delete this inquiry?')) return;
  try {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.success) {
      showToast('Inquiry deleted');
      fetchInquiries();
    }
  } catch (err) {
    alert('Failed to delete');
  }
}

initAuth();
