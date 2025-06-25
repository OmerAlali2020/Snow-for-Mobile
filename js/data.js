// js/data.js

// מערך תקלות (tickets)
export const tickets = [
    {
      number: "INC0012345",
      short_description: "שרת לא מגיב",
      state: "פתוח",
      opened_at: "2025-06-20T10:15:00Z",
      u_unit: "תקשוב",
      business_service: "Active Directory"
    },
    {
      number: "INC0012346",
      short_description: "בעיית התחברות לבסיס נתונים",
      state: "בתהליך",
      opened_at: "2025-06-21T14:30:00Z",
      u_unit: "אחזקה",
      business_service: "SQL Server"
    },
    {
      number: "INC0012347",
      short_description: "אי זמינות שירות דואר",
      state: "הושלם",
      opened_at: "2025-06-19T08:45:00Z",
      u_unit: "אחזקה",
      business_service: "Exchange"
    },
    {
      number: "INC0012348",
      short_description: "זמן תגובה איטי בשרת ווב",
      state: "פתוח",
      opened_at: "2025-06-22T09:05:00Z",
      u_unit: "תקשוב",
      business_service: "Web Server"
    },
    {
      number: "INC0012349",
      short_description: "תקלה ב-GitLab runner",
      state: "בתהליך",
      opened_at: "2025-06-18T11:20:00Z",
      u_unit: "פיתוח",
      business_service: "GitLab"
    },
    {
      number: "INC0012350",
      short_description: "DNS לא מתעדכן",
      state: "פתוח",
      opened_at: "2025-06-17T16:00:00Z",
      u_unit: "תקשוב",
      business_service: "DNS"
    },
    {
      number: "INC0012351",
      short_description: "גישה לחומת אש נחסמה",
      state: "מושהה",
      opened_at: "2025-06-16T12:30:00Z",
      u_unit: "אחזקה",
      business_service: "Firewall"
    },
    {
      number: "INC0012352",
      short_description: "בעיית קונפיגורציית VPN",
      state: "בתהליך",
      opened_at: "2025-06-15T14:00:00Z",
      u_unit: "תמיכה",
      business_service: "VPN"
    },
    {
      number: "INC0012353",
      short_description: "שירות SharePoint יורד לעיתים קרובות",
      state: "פתוח",
      opened_at: "2025-06-14T09:50:00Z",
      u_unit: "אחזקה",
      business_service: "SharePoint"
    },
    {
      number: "INC0012354",
      short_description: "בעיית גיבוי אוטומטי",
      state: "הושלם",
      opened_at: "2025-06-13T07:25:00Z",
      u_unit: "אחזקה",
      business_service: "Backup"
    }
  ];
  
  // מערך פעילויות (activities)
  export const activities = [
    {
      number: "TASK0023456",
      u_type_change: "עדכון תוכנה",
      u_state: "בתהליך",
      expected_start: "2025-06-22T09:00:00Z",
      u_end_date: "2025-06-22T11:00:00Z",
      u_unit: "אחזקה",
      business_service: "Exchange",
      short_description: "שדרוג אבטחת דוא\"ל"
    },
    {
      number: "TASK0023457",
      u_type_change: "בדיקת חומרה",
      u_state: "מתוזמן",
      expected_start: "2025-06-23T08:00:00Z",
      u_end_date: "2025-06-23T09:30:00Z",
      u_unit: "תקשוב",
      business_service: "VPN",
      short_description: "בדיקה שוטפת של נתבים"
    },
    {
      number: "TASK0023458",
      u_type_change: "בדיקת אבטחה",
      u_state: "בתהליך",
      expected_start: "2025-06-21T10:00:00Z",
      u_end_date: "2025-06-21T12:00:00Z",
      u_unit: "אחזקה",
      business_service: "Firewall",
      short_description: "סקירת הגדרות חומת אש"
    },
    {
      number: "TASK0023459",
      u_type_change: "שדרוג גרסה",
      u_state: "הושלם",
      expected_start: "2025-06-20T14:00:00Z",
      u_end_date: "2025-06-20T16:00:00Z",
      u_unit: "פיתוח",
      business_service: "Web Server",
      short_description: "שדרוג גרסה ל-Node.js"
    },
    {
      number: "TASK0023460",
      u_type_change: "גיבוי",
      u_state: "בתהליך",
      expected_start: "2025-06-22T18:00:00Z",
      u_end_date: "2025-06-22T19:00:00Z",
      u_unit: "אחזקה",
      business_service: "Backup",
      short_description: "גיבוי מערכות יומיות"
    },
    {
      number: "TASK0023461",
      u_type_change: "התקנת רכיב",
      u_state: "מתוזמן",
      expected_start: "2025-06-24T09:00:00Z",
      u_end_date: "2025-06-24T10:00:00Z",
      u_unit: "תקשוב",
      business_service: "Active Directory",
      short_description: "התקנת DC חדש"
    },
    {
      number: "TASK0023462",
      u_type_change: "הגדרת רשת",
      u_state: "בתהליך",
      expected_start: "2025-06-19T11:30:00Z",
      u_end_date: "2025-06-19T12:30:00Z",
      u_unit: "תמיכה",
      business_service: "DNS",
      short_description: "הקמת VLAN חדש"
    },
    {
      number: "TASK0023463",
      u_type_change: "אימות משתמש",
      u_state: "פתוח",
      expected_start: "2025-06-23T13:00:00Z",
      u_end_date: "2025-06-23T13:30:00Z",
      u_unit: "תמיכה",
      business_service: "Active Directory",
      short_description: "אימות הרשאות משתמש"
    },
    {
      number: "TASK0023464",
      u_type_change: "העברת נתונים",
      u_state: "בתהליך",
      expected_start: "2025-06-18T10:00:00Z",
      u_end_date: "2025-06-18T12:00:00Z",
      u_unit: "פיתוח",
      business_service: "SQL Server",
      short_description: "העברת DB לשרת חדש"
    },
    {
      number: "TASK0023465",
      u_type_change: "בדיקה שוטפת",
      u_state: "הושלם",
      expected_start: "2025-06-17T15:00:00Z",
      u_end_date: "2025-06-17T16:00:00Z",
      u_unit: "אחזקה",
      business_service: "Exchange",
      short_description: "בדיקת שירות הדואר"
    }
  ];
  