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

function init() {
  const allTickets = tickets;
  const allActivities = activities;

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  // הגדרת כרטיסי הדשבורד
  const cardsData = [
    {
      label: 'תקלות השבוע',
      count: filterByDateRange(allTickets, 'opened_at', weekAgo, now).length,
      onClick: () => showList('ticket', allTickets, 'opened_at', weekAgo, now),
    },
    {
      label: 'פעילויות השבוע',
      count: filterByDateRange(allActivities, 'expected_start', weekAgo, now).length,
      onClick: () => showList('activity', allActivities, 'expected_start', weekAgo, now),
    },
    {
      label: 'תקלות ב-24 שעות',
      count: filterByDateRange(allTickets, 'opened_at', yesterday, now).length,
      onClick: () => showList('ticket', allTickets, 'opened_at', yesterday, now),
    },
    {
      label: 'פעילויות ב-24 שעות',
      count: filterByDateRange(allActivities, 'expected_start', yesterday, now).length,
      onClick: () => showList('activity', allActivities, 'expected_start', yesterday, now),
    },
  ];

  // הצגת הדשבורד
  renderDashboard(cardsData);

  // מסתיר את ה-list-view עד ללחיצה
  document.getElementById('list-view').classList.add('hidden');

  // יוצר מכולת לפילטר סטטוסים מעל ה-list-view
  const filterContainer = document.createElement('div');
  filterContainer.id = 'filter-container';
  document.getElementById('list-view').before(filterContainer);
}

// מציג את רשימת התקלות או הפעילויות בהתאם לבחירה
function showList(type, items, dateField, from, to) {
  const listView = document.getElementById('list-view');
  const filterContainer = document.getElementById('filter-container');
  listView.innerHTML = '';
  filterContainer.innerHTML = '';

  // מסנן וממיין לפי תאריך
  let filtered = filterByDateRange(items, dateField, from, to);
  filtered = sortByDateDesc(filtered, dateField);

  // רינדור פילטר סטטוסים
  const statusField = type === 'ticket' ? 'state' : 'u_state';
  const statuses = getUniqueValues(filtered, statusField);
  renderFilters(statuses, 'filter-container', (value) => {
    const byStatus = filterByStatus(filtered, statusField, value);
    renderList(byStatus, type);
  });

  // הצגת הרשימה הראשונית
  renderList(filtered, type);

  // מוודא שה-list-view מוצג
  listView.classList.remove('hidden');
}

// מאתחל את האפליקציה כש-DOM מוכן
document.addEventListener('DOMContentLoaded', init);
