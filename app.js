import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Firebase Init ──
const firebaseConfig = {
  apiKey: "AIzaSyAc5epxhtS9VP4g2FAwOt3jgjwOHxBakB4",
  authDomain: "final-cs50-project-8ac2a.firebaseapp.com",
  projectId: "final-cs50-project-8ac2a",
  storageBucket: "final-cs50-project-8ac2a.firebasestorage.app",
  messagingSenderId: "760452680369",
  appId: "1:760452680369:web:2b47d1b5f4d7fa1c8af090",
  measurementId: "G-CF510G7W62"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ── App State ──
let currentUser = null;
let projects = [];
let tasks = [];
let activeProjectId = null;
let editingTaskId = null;
let activeFilter = 'all';
let unsubTasks = null;
let selectedColor = '#e8ff47';
let pendingDeleteId = null;   // holds the task id waiting for confirm

const PROJECT_COLORS = ['#e8ff47','#47c8ff','#ff5f5f','#b47fff','#ff914d','#47ffb4','#ff47b4','#fff047'];

// ── Auth State Observer ──
onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    showApp(user);
    loadProjects();
  } else {
    currentUser = null;
    showAuth();
  }
});

function showApp(user) {
  document.getElementById('auth-screen').style.display = 'none';
  const appEl = document.getElementById('app-screen');
  appEl.style.display = 'flex';
  document.getElementById('user-name-display').textContent = user.displayName || user.email.split('@')[0];
  document.getElementById('user-avatar').textContent = (user.displayName || user.email)[0].toUpperCase();
}

function showAuth() {
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('app-screen').style.display = 'none';
}

// ── Auth Handlers ──
window.switchTab = (tab) => {
  document.getElementById('form-login').style.display = tab === 'login' ? '' : 'none';
  document.getElementById('form-signup').style.display = tab === 'signup' ? '' : 'none';
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
};

window.handleLogin = async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('btn-login');
  const err = document.getElementById('login-error');
  err.textContent = '';
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch(e) {
    err.textContent = friendlyError(e.code);
    btn.innerHTML = 'Sign In';
    btn.disabled = false;
  }
};

window.handleSignup = async () => {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const btn = document.getElementById('btn-signup');
  const err = document.getElementById('signup-error');
  err.textContent = '';
  if (!name) { err.textContent = 'Please enter your name.'; return; }
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    cred.user.displayName = name;
  } catch(e) {
    err.textContent = friendlyError(e.code);
    btn.innerHTML = 'Create Account';
    btn.disabled = false;
  }
};

window.handleLogout = async () => {
  if (unsubTasks) unsubTasks();
  await signOut(auth);
};

function friendlyError(code) {
  const map = {
    'auth/user-not-found': 'No account with that email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'Email already registered.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/invalid-credential': 'Incorrect email or password.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

// ── Projects ──
async function loadProjects() {
  const snap = await getDocs(collection(db, 'projects'));
  projects = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(p => p.uid === currentUser.uid);
  renderSidebar();
  loadTasks();
}

function renderSidebar() {
  const list = document.getElementById('project-list');
  list.innerHTML = `
    <div class="project-item ${activeProjectId === null ? 'active' : ''}" onclick="selectProject(null)">
      <span class="project-dot" style="background:#888"></span> All Projects
      <span class="project-count">${tasks.length}</span>
    </div>
  `;
  projects.forEach(p => {
    const count = tasks.filter(t => t.projectId === p.id).length;
    list.innerHTML += `
      <div class="project-item ${activeProjectId === p.id ? 'active' : ''}" onclick="selectProject('${p.id}')">
        <span class="project-dot" style="background:${p.color}"></span>
        <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.name}</span>
        <span class="project-count">${count}</span>
      </div>
    `;
  });
}

window.selectProject = (id) => {
  activeProjectId = id;
  const proj = projects.find(p => p.id === id);
  document.getElementById('project-title').textContent = proj ? proj.name : 'All Tasks';
  document.getElementById('project-desc').textContent = proj?.description || '';
  renderSidebar();
  renderKanban();
};

window.openProjectModal = () => {
  renderColorSwatches();
  document.getElementById('project-modal-overlay').classList.add('open');
};

window.closeProjectModal = () => {
  document.getElementById('project-modal-overlay').classList.remove('open');
  document.getElementById('proj-name-input').value = '';
  document.getElementById('proj-desc-input').value = '';
};

function renderColorSwatches() {
  const container = document.getElementById('color-swatches');
  container.innerHTML = PROJECT_COLORS.map(c => `
    <div class="swatch ${c === selectedColor ? 'selected' : ''}" style="background:${c}"
         onclick="pickColor('${c}')"></div>
  `).join('');
}

window.pickColor = (c) => {
  selectedColor = c;
  renderColorSwatches();
};

window.saveProject = async () => {
  const name = document.getElementById('proj-name-input').value.trim();
  if (!name) { showToast('Project name required', 'error'); return; }
  const desc = document.getElementById('proj-desc-input').value.trim();
  await addDoc(collection(db, 'projects'), {
    uid: currentUser.uid,
    name, description: desc,
    color: selectedColor,
    createdAt: Date.now()
  });
  closeProjectModal();
  showToast('Project created!', 'success');
  loadProjects();
};

// ── Tasks ──
function loadTasks() {
  if (unsubTasks) unsubTasks();
  // Listen to entire tasks collection, filter by uid client-side
  // This avoids ALL Firestore index requirements
  unsubTasks = onSnapshot(collection(db, 'tasks'), snap => {
    tasks = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(t => t.uid === currentUser.uid)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    updateStats();
    renderSidebar();
    renderKanban();
  }, err => {
    console.error('Firestore error:', err);
    showToast('Error loading tasks: ' + err.message, 'error');
  });
}

function renderKanban() {
  const board = document.getElementById('kanban-board');
  const filtered = tasks
    .filter(t => activeProjectId === null || t.projectId === activeProjectId)
    .filter(t => activeFilter === 'all' || t.priority === activeFilter);

  const cols = [
    { key: 'todo',       label: 'To Do',      color: '#888' },
    { key: 'inprogress', label: 'In Progress', color: '#47c8ff' },
    { key: 'done',       label: 'Done',        color: '#e8ff47' },
  ];

  board.innerHTML = cols.map(col => {
    const colTasks = filtered.filter(t => t.status === col.key);
    const cards = colTasks.length
      ? colTasks.map(task => taskCard(task)).join('')
      : `<div class="empty-col">No tasks here</div>`;

    return `
      <div class="kanban-col">
        <div class="col-header">
          <span class="col-dot" style="background:${col.color}"></span>
          <span class="col-title">${col.label}</span>
          <span class="col-badge">${colTasks.length}</span>
        </div>
        ${cards}
      </div>
    `;
  }).join('');
}

function taskCard(task) {
  const proj = projects.find(p => p.id === task.projectId);
  const projTag = proj
    ? `<span class="tag" style="background:${proj.color}22;color:${proj.color}">${proj.name}</span>`
    : '';
  const dueStr = task.dueDate ? `<span class="task-date">📅 ${task.dueDate}</span>` : '';
  const nextStatuses = { todo: 'inprogress', inprogress: 'done', done: 'todo' };
  const nextLabel    = { todo: '→ Start',    inprogress: '→ Done', done: '↩ Reopen' };
  return `
    <div class="task-card priority-${task.priority}">
      <div class="task-title">${escHtml(task.title)}</div>
      ${task.notes
        ? `<div style="font-size:12px;color:var(--muted);margin-bottom:8px;line-height:1.5">${escHtml(task.notes)}</div>`
        : ''}
      <div class="task-meta">
        <span class="tag tag-priority-${task.priority}">${task.priority}</span>
        ${projTag}
        ${dueStr}
      </div>
      <div class="task-actions">
        <button class="btn-task-action" onclick="moveTask('${task.id}','${nextStatuses[task.status]}')">${nextLabel[task.status]}</button>
        <button class="btn-task-action" onclick="editTask('${task.id}')">Edit</button>
        <button class="btn-task-action del" onclick="confirmDelete('${task.id}','${escHtml(task.title)}')">Delete</button>
      </div>
    </div>
  `;
}

// ── Task Modal ──
window.openTaskModal = () => {
  editingTaskId = null;
  document.getElementById('task-modal-title').textContent = 'New Task';
  document.getElementById('task-title-input').value = '';
  document.getElementById('task-priority').value = 'medium';
  document.getElementById('task-status').value = 'todo';
  document.getElementById('task-notes').value = '';
  document.getElementById('task-due').value = '';
  document.getElementById('task-modal-overlay').classList.add('open');
};

window.closeTaskModal = () => {
  document.getElementById('task-modal-overlay').classList.remove('open');
};

window.editTask = (id) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  editingTaskId = id;
  document.getElementById('task-modal-title').textContent = 'Edit Task';
  document.getElementById('task-title-input').value = task.title;
  document.getElementById('task-priority').value = task.priority;
  document.getElementById('task-status').value = task.status;
  document.getElementById('task-notes').value = task.notes || '';
  document.getElementById('task-due').value = task.dueDate || '';
  document.getElementById('task-modal-overlay').classList.add('open');
};

window.saveTask = async () => {
  const title = document.getElementById('task-title-input').value.trim();
  if (!title) { showToast('Task title required', 'error'); return; }
  const data = {
    uid: currentUser.uid,
    title,
    priority: document.getElementById('task-priority').value,
    status: document.getElementById('task-status').value,
    notes: document.getElementById('task-notes').value.trim(),
    dueDate: document.getElementById('task-due').value,
    projectId: activeProjectId || null,
  };
  const btn = document.getElementById('btn-save-task');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    if (editingTaskId) {
      await updateDoc(doc(db, 'tasks', editingTaskId), data);
      showToast('Task updated!', 'success');
    } else {
      data.createdAt = Date.now();
      await addDoc(collection(db, 'tasks'), data);
      showToast('Task added!', 'success');
    }
    closeTaskModal();
  } finally {
    btn.innerHTML = 'Save Task';
    btn.disabled = false;
  }
};

window.moveTask = async (id, newStatus) => {
  await updateDoc(doc(db, 'tasks', id), { status: newStatus });
  showToast('Task moved', 'success');
};

// ── Delete Confirmation ──
window.confirmDelete = (id, title) => {
  pendingDeleteId = id;
  document.getElementById('confirm-task-name').textContent = `"${title}"`;
  document.getElementById('confirm-modal-overlay').classList.add('open');
};

window.closeConfirmModal = () => {
  document.getElementById('confirm-modal-overlay').classList.remove('open');
  pendingDeleteId = null;
};

window.executeDelete = async () => {
  if (!pendingDeleteId) return;
  await deleteDoc(doc(db, 'tasks', pendingDeleteId));
  showToast('Task deleted', 'error');
  closeConfirmModal();
};

window.setFilter = (filter, btn) => {
  activeFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderKanban();
};

// ── Utilities ──
function updateStats() {
  document.getElementById('stat-total').textContent = tasks.length;
  document.getElementById('stat-progress').textContent = tasks.filter(t => t.status === 'inprogress').length;
  document.getElementById('stat-done').textContent = tasks.filter(t => t.status === 'done').length;
}

function escHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 2600);
}

// ── Close modals on overlay click ──
document.getElementById('task-modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeTaskModal();
});
document.getElementById('project-modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeProjectModal();
});
document.getElementById('confirm-modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeConfirmModal();
});