// js/main.js

import { tickets, activities } from './data.js';
import {
  getUniqueValues,
  filterByStatus,
  filterByDateRange,
  sortByDateDesc
} from './filters.js';
import {
  renderDashboard,
  renderFilters,
  renderList
} from './render.js';

// מיקום לאחסון הפילטרים הראשוניים מתוך הקוביה שנבחרה
let initialFilters = {};

// מחשב טווח זמן ל־24 שעות, היום או אתמול
function computeRange(preset) {
  const now = new Date();
  let start, end = new Date(now);
  switch (preset) {
    case 'today':
      start = new Date(now);
      start.setHours(0,0,0,0);
      break;
    case 'last24h':
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'yesterday':
      start = new Date(now);
      start.setDate(now.getDate() - 1);
      start.setHours(0,0,0,0);
      end = new Date(start);
      end.setHours(23,59,59,999);
      break;
    default:
      return null;
  }
  return { from: start, to: end };
}

// הגדרת קוביות סכימה עם פילטרים
const cardsData = [
  {
    label: 'תקלות שנפתחו ב-24 שעות האחרונות',
    route: 'tickets',
    filters: {
      datePreset: 'last24h',
      dateField: 'opened_at',
      statuses: ['נפתח']
    },
    count: tickets.filter(t => {
      const range = computeRange('last24h');
      const d = new Date(t.opened_at);
      return d >= range.from && d <= range.to && t.state === 'נפתח';
    }).length
  },
  {
    label: 'תקלות שנסגרו ב-24 שעות האחרונות',
    route: 'tickets',
    filters: {
      datePreset: 'last24h',
      dateField: 'sys_updated_on',
      statuses: ['נפתר', 'הסתיים']
    },
    count: tickets.filter(t => {
      const range = computeRange('last24h');
      const d = new Date(t.sys_updated_on);
      return d >= range.from && d <= range.to && (t.state === 'נפתר' || t.state === 'הסתיים');
    }).length
  },
  {
    label: 'פעילויות בביצוע',
    route: 'activities',
    filters: { statuses: ['בתהליך'] },
    count: activities.filter(a => a.u_state === 'בתהליך').length
  },
  {
    label: 'פעילויות שהסתיימו ב-24 שעות האחרונות',
    route: 'activities',
    filters: {
      datePreset: 'last24h',
      dateField: 'sys_updated_on',
      statuses: ['הסתיים']
    },
    count: activities.filter(a => {
      const range = computeRange('last24h');
      const d = new Date(a.sys_updated_on);
      return d >= range.from && d <= range.to && a.u_state === 'הסתיים';
    }).length
  }
];

function showDashboard() {
  const dashboard = document.getElementById('dashboard');
  dashboard.classList.remove('hidden');
  document.getElementById('list-view').classList.add('hidden');
  document.getElementById('filter-container').classList.add('hidden');

  renderDashboard(
    cardsData.map(card => ({
      label: card.label,
      count: card.count,
      onClick: () => {
        initialFilters = card.filters;
        window.location.hash = `#${card.route}`;
      }
    }))
  );
}

function showListRoute(route) {
  document.getElementById('dashboard').classList.add('hidden');
  const listView = document.getElementById('list-view');
  const filterContainer = document.getElementById('filter-container');
  listView.classList.remove('hidden');
  filterContainer.classList.remove('hidden');

  const items = route === 'tickets' ? tickets : activities;
  const dateField = initialFilters.dateField || (route === 'tickets' ? 'opened_at' : 'expected_start');
  const statusField = route === 'tickets' ? 'state' : 'u_state';

  let baseFiltered = items.slice();

  if (initialFilters.datePreset) {
    const range = computeRange(initialFilters.datePreset);
    baseFiltered = baseFiltered.filter(item => {
      const d = new Date(item[initialFilters.dateField]);
      return d >= range.from && d <= range.to;
    });
  }

  if (initialFilters.statuses) {
    baseFiltered = baseFiltered.filter(item =>
      initialFilters.statuses.includes(item[statusField])
    );
  }

  // אתחול שאר הפילטרים
  let currentStatus = '';
  let currentUnit = '';
  let currentType = '';
  let searchQuery = '';

  function updateList() {
    let filtered = baseFiltered;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (currentStatus) {
      filtered = filterByStatus(filtered, statusField, currentStatus);
    }

    if (currentUnit) {
      filtered = filterByStatus(filtered, 'u_unit', currentUnit);
    }

    if (route === 'activities' && currentType) {
      filtered = filterByStatus(filtered, 'u_type_change', currentType);
    }

    filtered = sortByDateDesc(filtered, dateField);
    renderList(filtered, route === 'tickets' ? 'ticket' : 'activity');
  }

  filterContainer.innerHTML = '';

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'חפש לפי מספר';
  searchInput.addEventListener('input', e => { searchQuery = e.target.value.trim(); updateList(); });
  filterContainer.appendChild(searchInput);

  if (!initialFilters.datePreset && route === 'tickets') {
    const dateSelect = document.createElement('select');
    dateSelect.innerHTML = `
      <option value="">הכל</option>
      <option value="today">היום</option>
      <option value="last24h">24 שעות</option>
      <option value="yesterday">אתמול</option>
    `;
    dateSelect.addEventListener('change', e => {
      initialFilters.datePreset = e.target.value;
      initialFilters.dateField = 'opened_at';
      updateList();
    });
    filterContainer.appendChild(dateSelect);
  }

  const statuses = getUniqueValues(items, statusField);
  const statusDiv = document.createElement('div');
  statusDiv.id = 'status-filter';
  filterContainer.appendChild(statusDiv);
  renderFilters(statuses, 'status-filter', v => { currentStatus = v; updateList(); });

  const units = getUniqueValues(items, 'u_unit');
  const unitDiv = document.createElement('div');
  unitDiv.id = 'unit-filter';
  filterContainer.appendChild(unitDiv);
  renderFilters(units, 'unit-filter', v => { currentUnit = v; updateList(); });

  if (route === 'activities') {
    const types = getUniqueValues(items, 'u_type_change');
    const typeDiv = document.createElement('div');
    typeDiv.id = 'type-filter';
    filterContainer.appendChild(typeDiv);
    renderFilters(types, 'type-filter', v => { currentType = v; updateList(); });
  }

  updateList();
  initialFilters = {}; // נקה את הפילטרים שלא יישמרו למעבר הבא
}

function navigate() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  if (hash === 'dashboard') {
    showDashboard();
  } else {
    showListRoute(hash);
  }
}

window.addEventListener('hashchange', navigate);
document.addEventListener('DOMContentLoaded', navigate);
