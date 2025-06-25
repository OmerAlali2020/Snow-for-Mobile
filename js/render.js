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
   * בונה תפריט סינון (dropdown) לסטטוסים
   * @param {string[]} statuses
   * @param {string} containerId - מזהה ה-DOM שבו יופיע הפילטר
   * @param {(value: string) => void} onChange
   */
  export function renderFilters(statuses, containerId, onChange) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const select = document.createElement('select');
    select.innerHTML = `
      <option value="">הכל</option>
      ${statuses.map(status => `<option value="${status}">${status}</option>`).join('')}
    `;
    select.addEventListener('change', e => onChange(e.target.value));
    container.appendChild(select);
  }
  
  /**
   * בונה רשימת פריטים (תקלות או פעילויות) ככרטיסים
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
  
      div.innerHTML = content;
      listView.appendChild(div);
    });
  }
  