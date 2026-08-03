// ─────────────────────────────────────────────────────────────────────────────
// قائمة المسموح لهم بالدخول إلى لوحة الأدمن
// أضف أو احذف حسب الحاجة. للتعطيل اجعل enabled=false.
// ⚠️ هذه القائمة تعمل من جهة العميل فقط — للحماية الحقيقية استخدم مصادقة على الخادم.
// Allowed admin sign-ins. Add/remove entries as needed. Client-side only —
// use a real server-side auth flow for production.
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminUser {
  username: string;
  password: string;
  enabled: boolean;
}

export const ADMIN_USERS: AdminUser[] = [
  { username: 'saak',    password: 'SAAK2024',  enabled: true },
  { username: 'manager', password: 'SAAK2024!', enabled: true },
];

export function isAllowedAdmin(username: string, password: string): boolean {
  const u = username.trim().toLowerCase();
  return ADMIN_USERS.some(
    (a) => a.enabled && a.username.toLowerCase() === u && a.password === password,
  );
}
