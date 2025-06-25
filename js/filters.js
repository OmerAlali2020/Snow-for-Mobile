// js/filters.js

/**
 * מחזיר מערך הערכים הייחודיים של שדה מסוים מתוך רשימת פריטים
 * @param {Array<Object>} items 
 * @param {string} fieldName 
 * @returns {string[]}
 */
export function getUniqueValues(items, fieldName) {
    return [...new Set(items.map(item => item[fieldName]))];
  }
  
  /**
   * מסנן מערך פריטים לפי סטטוס מסוים
   * @param {Array<Object>} items 
   * @param {string} statusFieldName – שם השדה (state או u_state)
   * @param {string} statusValue 
   * @returns {Array<Object>}
   */
  export function filterByStatus(items, statusFieldName, statusValue) {
    if (!statusValue) return items;
    return items.filter(item => item[statusFieldName] === statusValue);
  }
  
  /**
   * מסנן מערך פריטים לטווח תאריכים (opened_at או expected_start)
   * @param {Array<Object>} items 
   * @param {string} dateFieldName 
   * @param {Date} from 
   * @param {Date} to 
   * @returns {Array<Object>}
   */
  export function filterByDateRange(items, dateFieldName, from, to) {
    return items.filter(item => {
      const d = new Date(item[dateFieldName]);
      return d >= from && d <= to;
    });
  }
  
  /**
   * ממיין מערך פריטים לפי שדה תאריך בסדר יורד (החדשים קודם)
   * @param {Array<Object>} items 
   * @param {string} dateFieldName 
   * @returns {Array<Object>}
   */
  export function sortByDateDesc(items, dateFieldName) {
    return [...items].sort((a, b) => new Date(b[dateFieldName]) - new Date(a[dateFieldName]));
  }
  