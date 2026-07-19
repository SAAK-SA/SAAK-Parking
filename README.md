# SAAK Parking — نظام إدارة المواقف

نظام إدارة مواقف السيارات لشركة SAAK، مبني بـ React + TypeScript + Tailwind CSS.

## تشغيل المشروع محلياً

```bash
# 1. تثبيت الحزم
npm install

# 2. تشغيل خادم التطوير
npm run dev
```

ثم افتح المتصفح على الرابط: **http://localhost:5173**

> ⚠️ **مهم:** لا تفتح ملف `index.html` مباشرة من المجلد — يجب تشغيل `npm run dev` أولاً.

## بناء نسخة الإنتاج

```bash
npm run build
npm run preview    # لمعاينة نسخة الإنتاج
```

## هيكل المشروع

```
src/
├── components/
│   ├── layout/        # Sidebar, Header, Layout
│   ├── dashboard/     # KPI cards, occupancy chart, events
│   └── parking/       # Parking map, slot cells
├── pages/             # Dashboard, ParkingMapPage, Placeholder
├── data/              # Mock data
└── types/             # TypeScript types
```

## التقنيات المستخدمة

- **React 19** + TypeScript
- **Vite** — بيئة التطوير
- **Tailwind CSS v3** — التنسيق
- **Lucide React** — الأيقونات
- **React Router v7** — التنقل بين الصفحات

## الهوية البصرية

| اللون | الكود | الاستخدام |
|---|---|---|
| Navy Blue | `#0B2E59` | اللون الأساسي، الشريط الجانبي |
| Gold | `#C8A45D` | اللون الثانوي، الإجراءات |
| Green | `#22C55E` | موقف متاح |
| Gray | `#9CA3AF` | خارج الخدمة |
