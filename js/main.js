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

// לוגיקת סינון לפי טווח תאריכים מתוך רשימת תקלות
function filterByDatePreset(items, dateField, preset) {
  if (!preset) return items;
  const end = new Date();
  let start;
  switch (preset) {
    case 'today':
      start = new Date(end);
      start.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      start = new Date(end);
      start.setDate(end.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      const endY = new Date(start);
      endY.setHours(23, 59, 59, 999);
      return filterByDateRange(items, dateField, start, endY);
    case 'week':
      start = new Date(end);
      start.setDate(end.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      return items;
  }
  return filterByDateRange(items, dateField, start, end);
}

// נתוני הדשבורד
const cardsData = [
  { label: 'תקלות השבוע',    count: filterByDateRange(tickets, 'opened_at', weekAgo, now).length,    route: 'tickets',    from: weekAgo,    to: now,    dateField: 'opened_at' },
  { label: 'פעילויות השבוע', count: filterByDateRange(activities, 'expected_start', weekAgo, now).length, route: 'activities', from: weekAgo, to: now, dateField: 'expected_start' },
  { label: 'תקלות ב-24 שעות',count: filterByDateRange(tickets, 'opened_at', yesterday, now).length,  route: 'tickets',    from: yesterday, to: now, dateField: 'opened_at' },
  { label: 'פעילויות ב-24 שעות',count: filterByDateRange(activities, 'expected_start', yesterday, now).length, route: 'activities',from: yesterday,to: now,dateField: 'expected_start' }
];

/**
 * מציג את הדשבורד ומסתיר את רשימות והפילטרים
 */
function showDashboard() {
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('list-view').classList.add('hidden');
  document.getElementById('filter-container').classList.add('hidden');

  renderDashboard(
    cardsData.map(card => ({
      label: card.label,
      count: card.count,
      onClick: () => window.location.hash = `#${card.route}`
    }))
  );
}

/**
 * מציג רשימות עם חיפוש, סטטוס, יחידה, סוג ובתקלות – סינון לפי תאריך
 */
function showListRoute(route) {
  const listView = document.getElementById('list-view');
  const filterContainer = document.getElementById('filter-container');

  // הסתרת הדשבורד והצגת הרשימה והפילטרים
  document.getElementById('dashboard').classList.add('hidden');
  listView.classList.remove('hidden');
  filterContainer.classList.remove('hidden');

  // הגדרת נתונים ושדות
  const items       = route === 'tickets' ? tickets    : activities;
  const dateField   = route === 'tickets' ? 'opened_at' : 'expected_start';
  const statusField = route === 'tickets' ? 'state'     : 'u_state';
  const unitField   = 'u_unit';
  const typeField   = 'u_type_change';

  // קביעת טווח לפי הכרטיס
  const cardConfig = cardsData.find(c => c.route === route && c.dateField === dateField);
  const from       = cardConfig ? cardConfig.from : weekAgo;
  const to         = now;

  // סינון ראשוני ומיון
  let baseFiltered = filterByDateRange(items, dateField, from, to);
  baseFiltered     = sortByDateDesc(baseFiltered, dateField);

  // משתני פילטר
  let currentStatus = '';
  let currentUnit   = '';
  let currentType   = '';
  let datePreset    = '';
  let searchQuery   = '';

  // פונקציה לעדכון הרשימה לפי כל הפילטרים
  function updateList() {
    let filtered = baseFiltered;
    // סינון לפי תאריך רק בתקלות
    if (route === 'tickets') {
      filtered = filterByDatePreset(filtered, dateField, datePreset);
    }
    if (currentStatus) filtered = filterByStatus(filtered, statusField, currentStatus);
    if (currentUnit)   filtered = filterByStatus(filtered, unitField,   currentUnit);
    if (currentType && route === 'activities') {
      filtered = filterByStatus(filtered, typeField, currentType);
    }
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    renderList(filtered, route === 'tickets' ? 'ticket' : 'activity');
  }

  // איפוס הפילטרים
  filterContainer.innerHTML = '';

  // שורת חיפוש
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'חפש לפי מספר';
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value.trim();
    updateList();
  });
  filterContainer.appendChild(searchInput);

  // פילטר תאריך פתיחה רק בתקלות
  if (route === 'tickets') {
    const dateDiv = document.createElement('div');
    dateDiv.id = 'date-filter';
    filterContainer.appendChild(dateDiv);
    const select = document.createElement('select');
    select.innerHTML = `
      <option value="">הכל</option>
      <option value="today">היום</option>
      <option value="yesterday">אתמול</option>
      <option value="week">השבוע</option>
    `;
    select.addEventListener('change', e => {
      datePreset = e.target.value;
      updateList();
    });
    dateDiv.appendChild(select);
  }

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

  // פילטר סוג פעילות
  if (route === 'activities') {
    const types = getUniqueValues(baseFiltered, typeField);
    const typeDiv = document.createElement('div');
    typeDiv.id = 'type-filter';
    filterContainer.appendChild(typeDiv);
    renderFilters(types, 'type-filter', value => {
      currentType = value;
      updateList();
    });
  }

  // רינדור ראשוני
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
