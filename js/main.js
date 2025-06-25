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

// חישוב תאריכים
const now = new Date();
const weekAgo = new Date(now);
weekAgo.setDate(now.getDate() - 7);
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);

// נתוני הדשבורד
const cardsData = [
  {
    label: 'תקלות השבוע',
    count: filterByDateRange(tickets, 'opened_at', weekAgo, now).length,
    route: 'tickets',
    from: weekAgo,
    to: now,
    dateField: 'opened_at'
  },
  {
    label: 'פעילויות השבוע',
    count: filterByDateRange(activities, 'expected_start', weekAgo, now).length,
    route: 'activities',
    from: weekAgo,
    to: now,
    dateField: 'expected_start'
  },
  {
    label: 'תקלות ב-24 שעות',
    count: filterByDateRange(tickets, 'opened_at', yesterday, now).length,
    route: 'tickets',
    from: yesterday,
    to: now,
    dateField: 'opened_at'
  },
  {
    label: 'פעילויות ב-24 שעות',
    count: filterByDateRange(activities, 'expected_start', yesterday, now).length,
    route: 'activities',
    from: yesterday,
    to: now,
    dateField: 'expected_start'
  }
];

/**
 * מציג את הדשבורד ומסתיר את רשימת התקלות/פעילויות והפילטר
 */
function showDashboard() {
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('list-view').classList.add('hidden');
  document.getElementById('filter-container').classList.add('hidden');

  renderDashboard(cardsData.map(card => ({
    label: card.label,
    count: card.count,
    onClick: () => {
      window.location.hash = `#${card.route}`;
    }
  })));
}

/**
 * מציג את רשימת התקלות או הפעילויות עם שני פילטרים: סטטוס ויחידה
 */
function showListRoute(route) {
  // כיבוי ומשיכת אלמנטים
  const listView = document.getElementById('list-view');
  const filterContainer = document.getElementById('filter-container');
  document.getElementById('dashboard').classList.add('hidden');
  listView.classList.remove('hidden');
  filterContainer.classList.remove('hidden');

  // קביעת מקור ונתוני טווח הזמן
  const items = route === 'tickets' ? tickets : activities;
  const dateField = route === 'tickets' ? 'opened_at' : 'expected_start';
  const statusField = route === 'tickets' ? 'state' : 'u_state';
  const unitField = 'u_unit';

  // איפוס הטווח בהתאם לכרטיס בדשבורד
  const card = cardsData.find(c => c.route === route && c.dateField === dateField && c.from && c.to);
  const from = card ? card.from : weekAgo;
  const to = now;

  // סינון בסיסי ומיון לפי תאריך
  let baseFiltered = filterByDateRange(items, dateField, from, to);
  baseFiltered = sortByDateDesc(baseFiltered, dateField);

  // שמירת ערכי הפילטר הנוכחיים
  let currentStatus = '';
  let currentUnit = '';

  // פונקציה למעודכן הרשימה לפי שני הפילטרים
  function updateList() {
    let filtered = baseFiltered;
    if (currentStatus) filtered = filterByStatus(filtered, statusField, currentStatus);
    if (currentUnit) filtered = filterByStatus(filtered, unitField, currentUnit);
    renderList(filtered, route === 'tickets' ? 'ticket' : 'activity');
  }

  // איפוס תוכן פילטר
  filterContainer.innerHTML = '';

  // פילטר סטטוסים
  const statuses = getUniqueValues(baseFiltered, statusField);
  const statusDiv = document.createElement('div');
  statusDiv.id = 'status-filter';
  filterContainer.appendChild(statusDiv);
  renderFilters(statuses, 'status-filter', value => {
    currentStatus = value;
    updateList();
  });

  // פילטר יחידות
  const units = getUniqueValues(baseFiltered, unitField);
  const unitDiv = document.createElement('div');
  unitDiv.id = 'unit-filter';
  filterContainer.appendChild(unitDiv);
  renderFilters(units, 'unit-filter', value => {
    currentUnit = value;
    updateList();
  });

  // הצגה ראשונית של הרשימה
  updateList();
}

/**
 * ניהול ניווט מבוסס hash
 */
function navigate() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  if (hash === 'dashboard') {
    showDashboard();
  } else if (hash === 'tickets' || hash === 'activities') {
    showListRoute(hash);
  }
}

// אתחול האפליקציה
window.addEventListener('hashchange', navigate);
document.addEventListener('DOMContentLoaded', () => {
  navigate();
});
