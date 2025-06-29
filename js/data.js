// js/data.js

// מערך תקלות: 2 'נפתח' בתוך 24 שעות, 2 'נפתר'/'הסתיים' בתוך 24 שעות
export const tickets = [
  {
    number: "INC0030001",
    short_description: "שגיאת גישה למסד נתונים",
    state: "נפתח",
    opened_at: "2025-06-28T09:15:00Z",
    u_unit: "אחסון",
    business_service: "SQL Server",
    u_impact: "השבתה חלקית",
    sys_updated_on: "2025-06-28T09:15:00Z"
  },
  {
    number: "INC0030002",
    short_description: "קריסת שירות ווב",
    state: "נפתח",
    opened_at: "2025-06-28T17:45:00Z",
    u_unit: "פיתוח",
    business_service: "Web UI",
    u_impact: "השבתה מלאה",
    sys_updated_on: "2025-06-28T17:45:00Z"
  },
  {
    number: "INC0030003",
    short_description: "תקלה ברשת פנימית",
    state: "הסתיים",
    opened_at: "2025-06-27T22:00:00Z",
    u_unit: "תקשוב",
    business_service: "LAN",
    u_impact: "השבתה חלקית",
    sys_updated_on: "2025-06-28T14:20:00Z"
  },
  {
    number: "INC0030004",
    short_description: "עדכון גיבוי כושל",
    state: "נפתר",
    opened_at: "2025-06-27T20:00:00Z",
    u_unit: "אחזקה",
    business_service: "Backup Service",
    u_impact: "השבתה חלקית",
    sys_updated_on: "2025-06-28T14:20:00Z"
  }
];

// מערך פעילויות: 2 'בביצוע', 2 'הסתיים' בתוך 24 שעות
export const activities = [
  {
    number: "CHG0110001",
    short_description: "בדיקת עדכוני אבטחה",
    u_state: "בביצוע",
    expected_start: "2025-06-27T10:00:00Z",
    u_end_date: "2025-06-27T12:00:00Z",
    u_unit: "אבטחה",
    business_service: "Identity Service",
    u_type_change: "בדיקה שוטפת",
    sys_updated_on: "2025-06-27T12:00:00Z"
  },
  {
    number: "CHG0110002",
    short_description: "שדרוג רכיב רשת",
    u_state: "בביצוע",
    expected_start: "2025-06-28T08:00:00Z",
    u_end_date: "2025-06-28T10:00:00Z",
    u_unit: "תקשוב",
    business_service: "Firewall",
    u_type_change: "שדרוג גרסה",
    sys_updated_on: "2025-06-28T10:00:00Z"
  },
  {
    number: "CHG0110003",
    short_description: "התקנת מערכת ניטור",
    u_state: "הסתיים",
    expected_start: "2025-06-27T14:00:00Z",
    u_end_date: "2025-06-27T16:00:00Z",
    u_unit: "אחזקה",
    business_service: "Monitoring",
    u_type_change: "התקנה חדשה",
    sys_updated_on: "2025-06-28T09:00:00Z"
  },
  {
    number: "CHG0110004",
    short_description: "בדיקת שרת ווב",
    u_state: "הסתיים",
    expected_start: "2025-06-28T06:00:00Z",
    u_end_date: "2025-06-28T08:00:00Z",
    u_unit: "פיתוח",
    business_service: "Web Server",
    u_type_change: "בדיקה שוטפת",
    sys_updated_on: "2025-06-28T11:30:00Z"
  }
];
