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

// מסתייע ביצירת טווח מ־datePreset
function computeRange(preset) {
  const now = new Date();
  let start, end = new Date(now);
  switch (preset) {
    case 'today':
      start = new Date(now);
      start.setHours(0,0,0,0);
      break;
    case 'yesterday':
      start = new Date(now);
      start.setDate(now.getDate() - 1);
      start.setHours(0,0,0,0);
      end = new Date(start);
      end.setHours(23,59,59,999);
      break;
    case 'week':
      start = new Date(now);
      start.setDate(now.getDate() - 7);
      start.setHours(0,0,0,0);
      break;
    default:
      return null;
  }
  return { from: start, to: end };
}

// קובצי הדשבורד שלנו
const cardsData = [
  { label: 'תקלות השבוע',       count: filterByDateRange(tickets,    'opened_at',       computeRange('week').from, computeRange('week').to).length,       route: 'tickets' },
  { label: 'תקלות ב-24 שעות',    count: filterByDateRange(tickets,    'opened_at',       computeRange('today').from, computeRange('today').to).length,    route: 'tickets' },
  { label: 'פעילויות השבוע',     count: filterByDateRange(activities, 'expected_start',  computeRange('week').from, computeRange('week').to).length,     route: 'activities' },
  { label: 'פעילויות ב-24 שעות', count: filterByDateRange(activities, 'expected_start',  computeRange('today').from, computeRange('today').to).length, route: 'activities' }
];

/** מציג את הדשבורד */
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

/** מציג ועורך את הרשימה לפי route */
function showListRoute(route) {
  const items       = route === 'tickets' ? tickets    : activities;
  const dateField   = route === 'tickets' ? 'opened_at' : 'expected_start';
  const statusField = route === 'tickets' ? 'state'     : 'u_state';
  const unitField   = 'u_unit';
  const typeField   = 'u_type_change';

  // למקרה שרוצים filter-container & list-view
  document.getElementById('dashboard').classList.add('hidden');
  const listView       = document.getElementById('list-view');
  const filterContainer = document.getElementById('filter-container');
  listView.classList.remove('hidden');
  filterContainer.classList.remove('hidden');

  // הפילטרים בדינמיקה
  let searchQuery = '';
  let currentStatus = '';
  let currentUnit = '';
  let currentType = '';
  let datePreset = '';

  // הפונקציה שמעדכנת ומציגה
  function updateList() {
    let filtered = items.slice(); // start from raw

    // סינון תאריכים
    if (route === 'tickets') {
      // תקלות לפי opened_at
      filtered = filterByDatePreset(filtered, dateField, datePreset);
    } else { // activities
      if (datePreset) {
        const range = computeRange(datePreset);
        filtered = filtered.filter(item => {
          const start = new Date(item.expected_start);
          const endD  = new Date(item.u_end_date);
          return start <= range.to && endD >= range.from;
        });
      }
    }

    // חיפוש free-text על number
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // פילטר סטטוס
    if (currentStatus) {
      filtered = filterByStatus(filtered, statusField, currentStatus);
    }

    // פילטר יחידה
    if (currentUnit) {
      filtered = filterByStatus(filtered, unitField, currentUnit);
    }

    // פילטר סוג (רק ב-activities)
    if (route === 'activities' && currentType) {
      filtered = filterByStatus(filtered, typeField, currentType);
    }

    // מיון לפי תאריך יורד
    filtered = sortByDateDesc(filtered, dateField);

    renderList(filtered, route === 'tickets' ? 'ticket' : 'activity');
  }

  // בונים את ממשק הפילטרים
  filterContainer.innerHTML = '';

  // 1. search
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'חפש לפי מספר';
  searchInput.addEventListener('input', e => { searchQuery = e.target.value.trim(); updateList(); });
  filterContainer.appendChild(searchInput);

  // 2. date preset selector
  const dateDiv = document.createElement('div');
  const dateSel = document.createElement('select');
  dateSel.innerHTML = `
    <option value="">הכל</option>
    <option value="today">היום</option>
    <option value="yesterday">אתמול</option>
    <option value="week">השבוע</option>
  `;
  dateSel.addEventListener('change', e => { datePreset = e.target.value; updateList(); });
  dateDiv.appendChild(dateSel);
  filterContainer.appendChild(dateDiv);

  // 3. status
  const statuses = getUniqueValues(items, statusField);
  const statusDiv = document.createElement('div');
  statusDiv.id = 'status-filter';
  filterContainer.appendChild(statusDiv);
  renderFilters(statuses, 'status-filter', v => { currentStatus = v; updateList(); });

  // 4. unit
  const units = getUniqueValues(items, unitField);
  const unitDiv = document.createElement('div');
  unitDiv.id = 'unit-filter';
  filterContainer.appendChild(unitDiv);
  renderFilters(units, 'unit-filter', v => { currentUnit = v; updateList(); });

  // 5. type (activities only)
  if (route === 'activities') {
    const types = getUniqueValues(items, typeField);
    const typeDiv = document.createElement('div');
    typeDiv.id = 'type-filter';
    filterContainer.appendChild(typeDiv);
    renderFilters(types, 'type-filter', v => { currentType = v; updateList(); });
  }

  // הצגה ראשונית
  updateList();
}

/** ניהול ניווט מבוסס hash */
function navigate() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  if (hash === 'dashboard') {
    showDashboard();
  } else if (hash === 'tickets' || hash === 'activities') {
    showListRoute(hash);
  }
}

// מאזינים
window.addEventListener('hashchange', navigate);
document.addEventListener('DOMContentLoaded', navigate);

/** מייביא את הפונקציה של תקלות מ־filters.js **/
function filterByDatePreset(items, field, preset) {
  if (!preset) return items;
  const range = computeRange(preset);
  return filterByDateRange(items, field, range.from, range.to);
}
