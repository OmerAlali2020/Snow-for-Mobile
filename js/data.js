// js/data.js

// מערך תקלות (2 פריטים בלבד)
export const tickets = [
  {
    number: "INC0019991",
    short_description: "שרת נפל לפני שעה",
    state: "נפתח",
    opened_at: "2025-06-26T07:00:00Z",
    u_unit: "אחזקה",
    business_service: "DNS",
    u_impact: "השבתה מלאה",
    sys_updated_on: "2025-06-26T07:30:00Z"
  },
  {
    number: "INC0019992",
    short_description: "בעיית חיבור שנפתרה",
    state: "נפתר",
    opened_at: "2025-06-20T08:00:00Z",
    u_unit: "תקשוב",
    business_service: "VPN",
    u_impact: "השבתה חלקית",
    sys_updated_on: "2025-06-26T06:00:00Z"
  }
];

// מערך פעילויות (2 פריטים בלבד)
export const activities = [
  {
    number: "CHG0099991",
    short_description: "בדיקת תשתית רשת",
    u_state: "בתהליך",
    expected_start: "2025-06-26T07:00:00Z",
    u_end_date: "2025-06-26T10:00:00Z",
    u_unit: "פיתוח",
    business_service: "Web Server",
    u_type_change: "בדיקה שוטפת",
    sys_updated_on: "2025-06-26T09:00:00Z"
  },
  {
    number: "CHG0099992",
    short_description: "שדרוג שרת בסיס נתונים",
    u_state: "הסתיים",
    expected_start: "2025-06-25T08:00:00Z",
    u_end_date: "2025-06-26T05:00:00Z",
    u_unit: "אחזקה",
    business_service: "SQL Server",
    u_type_change: "שדרוג גרסה",
    sys_updated_on: "2025-06-26T06:00:00Z"
  }
];
