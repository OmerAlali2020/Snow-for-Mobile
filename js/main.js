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
 * הצגת דשבורד
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
      // when hash changes, navigate() will handle showList
    }
  })));
}

/**
 * הצגת רשימה לפי נתיב ('tickets' או 'activities')
 */
function showListRoute(route) {
  // קביעת מקורות
  const items = route === 'tickets' ? tickets : activities;
  const dateField = route === 'tickets' ? 'opened_at' : 'expected_start';
  const from = cardsData.find(c => c.route === route && c.from === weekAgo)?.from || weekAgo;
  const to = now;

  // מסנן וממיין
  let filtered = filterByDateRange(items, dateField, from, to);
  filtered = sortByDateDesc(filtered, dateField);

  // רינדור פילטר סטטוסים
  const statusField = route === 'tickets' ? 'state' : 'u_state';
  const statuses = getUniqueValues(filtered, statusField);
  renderFilters(statuses, 'filter-container', (value) => {
    const byStatus = filterByStatus(filtered, statusField, value);
    renderList(byStatus, route === 'tickets' ? 'ticket' : 'activity');
  });

  // רינדור ראשוני של הרשימה
  renderList(filtered, route === 'tickets' ? 'ticket' : 'activity');
  document.getElementById('dashboard').classList.add('hidden');
  const listView = document.getElementById('list-view');
  listView.classList.remove('hidden');
  document.getElementById('filter-container').classList.remove('hidden');

}

/**
 * ניהול ניווט על בסיס hash
 */
function navigate() {
    console.log('navigate() called, hash=', window.location.hash);

  const hash = window.location.hash.slice(1) || 'dashboard';
  if (hash === 'dashboard') {
    showDashboard();
  } else if (hash === 'tickets' || hash === 'activities') {
    showListRoute(hash);
  }
}

// התחלת האפליקציה
window.addEventListener('hashchange', navigate);
document.addEventListener('DOMContentLoaded', () => {
  // צור מכולת לפילטר לפני list-view
  const filterContainer = document.createElement('div');
  filterContainer.id = 'filter-container';
  document.getElementById('list-view').before(filterContainer);
  navigate();
});
