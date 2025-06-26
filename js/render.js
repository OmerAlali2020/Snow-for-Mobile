// js/render.js

/**
 * בונה ומציג קוביות סכימה בדשבורד
 * @param {Array<{ label: string, count: number, onClick: function}>} cardsData
 */
export function renderDashboard(cardsData) {
  const dashboard = document.getElementById('dashboard');
  dashboard.innerHTML = '';
  cardsData.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${card.label}</h3>
      <p>${card.count}</p>
    `;
    div.addEventListener('click', () => {
      card.onClick();
    });
    dashboard.appendChild(div);
  });
}

/**
 * בונה תפריט סינון (dropdown) עם תווית
 * @param {string[]} statuses
 * @param {string} containerId - מזהה ה-DOM שבו יופיע הפילטר
 * @param {(value: string) => void} onChange
 */
export function renderFilters(statuses, containerId, onChange) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  // תרגום מזהה הפילטר לתווית קריאה למשתמש
  const labelMap = {
    'status-filter': 'סטטוס',
    'unit-filter': 'יחידה',
    'type-filter': 'סוג פעילות'
  };
  const labelText = labelMap[containerId] || '';
  if (labelText) {
    const labelEl = document.createElement('label');
    labelEl.textContent = labelText;
    container.appendChild(labelEl);
  }

  // בניית ה-select
  const select = document.createElement('select');
  select.innerHTML = `
    <option value="">הכל</option>
    ${statuses.map(status => `<option value="${status}">${status}</option>`).join('')}
  `;
  select.addEventListener('change', e => onChange(e.target.value));
  container.appendChild(select);
}

/**
 * בונה רשימת פריטים (תקלות או פעילויות) ככרטיסים עם פירוט נוסף ב־inline-expand
 * @param {Object[]} items
 * @param {'ticket'|'activity'} type
 */
export function renderList(items, type) {
  const listView = document.getElementById('list-view');
  listView.innerHTML = '';
  listView.classList.remove('hidden');

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'list-card card';
    let content = '';

    if (type === 'ticket') {
      content = `
        <h4>${item.number}</h4>
        <p>${item.short_description}</p>
        <p><strong>סטטוס:</strong> ${item.state}</p>
        <p><strong>נפתח ב־:</strong> ${new Date(item.opened_at).toLocaleString()}</p>
      `;
    } else {
      content = `
        <h4>${item.number}</h4>
        <p>${item.short_description}</p>
        <p><strong>סטטוס:</strong> ${item.u_state}</p>
        <p><strong>מתוכננת:</strong> ${new Date(item.expected_start).toLocaleString()} - ${new Date(item.u_end_date).toLocaleString()}</p>
      `;
    }

    // הצגת התוכן התמציתי
    div.innerHTML = content;

    // בניית המידע הנוסף (hidden by default)
    const extraInfo = document.createElement('div');
    extraInfo.className = 'extra-info';
    extraInfo.style.display = 'none';

    // רשימת שדות שכבר הוצגו ברשימה הראשית
    const shownFields = type === 'ticket'
      ? ['number', 'short_description', 'state', 'opened_at']
      : ['number', 'short_description', 'u_state', 'expected_start', 'u_end_date'];

    // מיפוי שמות שדות לטקסט קריא
    const labels = {
      number: 'מספר',
      short_description: 'תיאור',
      state: 'סטטוס',
      u_state: 'סטטוס',
      opened_at: 'נפתח ב־',
      expected_start: 'מתוכננת ל־',
      u_end_date: 'עד ל־',
      u_unit: 'יחידה',
      business_service: 'שירות',
      u_impact: 'השפעה',
      sys_updated_on: 'עודכן ב־',
      u_type_change: 'סוג פעילות'
    };

    // הוספת שדות נוספים שלא הוצגו קודם
    Object.entries(item).forEach(([key, value]) => {
      if (!shownFields.includes(key) && value != null) {
        const p = document.createElement('p');
        let displayValue = value;
        // פורמט לתאריכים
        if (['opened_at', 'expected_start', 'u_end_date', 'sys_updated_on'].includes(key)) {
          displayValue = new Date(value).toLocaleString();
        }
        p.innerHTML = `<strong>${labels[key] || key}:</strong> ${displayValue}`;
        extraInfo.appendChild(p);
      }
    });

    div.appendChild(extraInfo);

    // Toggle expansion on click
    div.addEventListener('click', () => {
      const isHidden = extraInfo.style.display === 'none';
      extraInfo.style.display = isHidden ? 'block' : 'none';
      div.classList.toggle('expanded', isHidden);
    });

    listView.appendChild(div);
  });
}
