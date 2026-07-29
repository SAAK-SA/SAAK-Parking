import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Users, UserCheck, UserMinus, Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import type { Employee } from '../types/parking';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../data/db';
import { useLanguage } from '../context/LanguageContext';

interface EmpForm {
  id: string;
  nameAr: string;
  department: string;
  plate: string;
  assignedSlot: string;
}

interface ImportRow {
  id: string;
  nameAr: string;
  department: string;
  plate: string;
  assignedSlot: string;
  error?: string;
}

const EMPTY: EmpForm = { id: '', nameAr: '', department: '', plate: '', assignedSlot: '' };

const CSV_HEADERS = ['id', 'name', 'department', 'plate', 'slot'];
const TEMPLATE_ROWS = [
  ['EMP010', 'خالد محمد العتيبي', 'الإنتاج', 'أ ب ج ١٢٣٤', 'D05'],
  ['EMP011', 'سلمى أحمد القحطاني', 'الجودة', 'د هـ و ٥٦٧٨', 'D06'],
];

function parseCSV(text: string): ImportRow[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  // skip header row
  return lines.slice(1).map((line) => {
    // handle quoted fields
    const cols: string[] = [];
    let cur = '';
    let inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { cols.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur.trim());

    const [id = '', nameAr = '', department = '', plate = '', assignedSlot = ''] = cols;
    const row: ImportRow = {
      id: id.trim().toUpperCase(),
      nameAr: nameAr.trim(),
      department: department.trim(),
      plate: plate.trim(),
      assignedSlot: assignedSlot.trim().toUpperCase(),
    };
    if (!row.id) row.error = 'رقم الموظف مطلوب';
    else if (!row.nameAr) row.error = 'الاسم مطلوب';
    return row;
  }).filter((r) => r.id || r.nameAr);
}

function downloadTemplate() {
  const rows = [CSV_HEADERS, ...TEMPLATE_ROWS];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'employees-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function EmployeesPage() {
  const { lang } = useLanguage();
  const ar = lang === 'ar';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<null | 'add' | 'edit' | 'import'>(null);
  const [form, setForm] = useState<EmpForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<EmpForm>>({});
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importDone, setImportDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setEmployees(await getEmployees());
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return !q
      || e.id.toLowerCase().includes(q)
      || e.nameAr.includes(q)
      || (e.plate ?? '').includes(q)
      || (e.department ?? '').toLowerCase().includes(q);
  });

  const openAdd = () => { setForm(EMPTY); setErrors({}); setModal('add'); };
  const openEdit = (e: Employee) => {
    setForm({ id: e.id, nameAr: e.nameAr, department: e.department ?? '', plate: e.plate ?? '', assignedSlot: e.assignedSlot ?? '' });
    setErrors({});
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setForm(EMPTY); setImportRows([]); setImportDone(false); };

  const validate = (): boolean => {
    const e: Partial<EmpForm> = {};
    if (!form.id.trim()) e.id = ar ? 'مطلوب' : 'Required';
    if (!form.nameAr.trim()) e.nameAr = ar ? 'مطلوب' : 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const emp: Employee = {
      id: form.id.trim().toUpperCase(),
      nameAr: form.nameAr.trim(),
      department: form.department.trim(),
      plate: form.plate.trim(),
      assignedSlot: form.assignedSlot.trim().toUpperCase(),
      buildingId: 'factory',
    };
    if (modal === 'add') await addEmployee(emp);
    else await updateEmployee(emp);
    await refresh();
    setSaving(false);
    closeModal();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteEmployee(deleteId);
    await refresh();
    setDeleteId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      setImportRows(rows);
      setImportDone(false);
      setModal('import');
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  const handleImport = async () => {
    setSaving(true);
    const valid = importRows.filter((r) => !r.error);
    for (const r of valid) {
      const emp: Employee = {
        id: r.id, nameAr: r.nameAr, department: r.department,
        plate: r.plate, assignedSlot: r.assignedSlot, buildingId: 'factory',
      };
      await addEmployee(emp);
    }
    await refresh();
    setSaving(false);
    setImportDone(true);
  };

  const withSlot = employees.filter((e) => e.assignedSlot).length;
  const validImport = importRows.filter((r) => !r.error);
  const invalidImport = importRows.filter((r) => r.error);

  return (
    <Layout titleKey="nav.employees" subtitleKey="emp.mgmt.subtitle">
      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={ar ? 'بحث بالاسم أو الرقم أو اللوحة…' : 'Search by name, ID or plate…'}
            className="field ps-9 w-full"
          />
        </div>
        <button onClick={downloadTemplate} className="btn-ghost gap-2 whitespace-nowrap" title={ar ? 'تحميل نموذج CSV' : 'Download CSV template'}>
          <Download className="w-4 h-4" />
          {ar ? 'نموذج' : 'Template'}
        </button>
        <button onClick={() => fileRef.current?.click()} className="btn-secondary gap-2 whitespace-nowrap">
          <Upload className="w-4 h-4" />
          {ar ? 'استيراد ملف' : 'Import file'}
        </button>
        <button onClick={openAdd} className="btn-primary gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          {ar ? 'إضافة موظف' : 'Add employee'}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Users,     cls: 'bg-brand-navy/10 text-brand-navy',  val: employees.length,            label: ar ? 'إجمالي الموظفين' : 'Total employees' },
          { icon: UserCheck, cls: 'bg-brand-green/10 text-brand-green', val: withSlot,                   label: ar ? 'لديهم موقف مخصص' : 'With assigned slot' },
          { icon: UserMinus, cls: 'bg-blue-50 text-brand-sky',          val: employees.length - withSlot, label: ar ? 'بدون موقف مخصص' : 'Without slot' },
        ].map(({ icon: Icon, cls, val, label }) => (
          <div key={label} className="kpi-card">
            <div className={`w-10 h-10 rounded-xl ${cls} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-brand-navy tabular-nums">{val}</p>
            <p className="text-xs text-text-secondary mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <section className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-surface border-b border-border text-text-secondary">
                <th className="text-start font-semibold px-5 py-3">{ar ? 'الرقم الوظيفي' : 'ID'}</th>
                <th className="text-start font-semibold px-4 py-3">{ar ? 'الاسم' : 'Name'}</th>
                <th className="text-start font-semibold px-4 py-3">{ar ? 'القسم' : 'Department'}</th>
                <th className="text-start font-semibold px-4 py-3">{ar ? 'رقم اللوحة' : 'Plate'}</th>
                <th className="text-start font-semibold px-4 py-3">{ar ? 'الموقف المخصص' : 'Slot'}</th>
                <th className="text-start font-semibold px-4 py-3">{ar ? 'إجراء' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-text-muted">{ar ? 'جاري التحميل…' : 'Loading…'}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-text-muted">{ar ? 'لا يوجد موظفون مطابقون' : 'No employees found'}</td></tr>
              ) : filtered.map((emp) => (
                <tr key={emp.id} className="border-b border-border/60 hover:bg-surface/60 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-brand-navy font-bold" dir="ltr">{emp.id}</td>
                  <td className="px-4 py-3 font-semibold text-brand-navy">{emp.nameAr}</td>
                  <td className="px-4 py-3 text-text-secondary">{emp.department || '—'}</td>
                  <td className="px-4 py-3 text-xs font-mono text-text-secondary" dir="rtl">{emp.plate || '—'}</td>
                  <td className="px-4 py-3">
                    {emp.assignedSlot
                      ? <span className="badge bg-brand-navy/10 text-brand-navy font-bold" dir="ltr">{emp.assignedSlot}</span>
                      : <span className="text-text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(emp)} className="btn-ghost !py-1.5 !px-2.5 text-xs gap-1">
                        <Edit2 className="w-3.5 h-3.5" />
                        {ar ? 'تعديل' : 'Edit'}
                      </button>
                      <button onClick={() => setDeleteId(emp.id)} className="btn-destructive !py-1.5 !px-2.5 text-xs gap-1">
                        <Trash2 className="w-3.5 h-3.5" />
                        {ar ? 'حذف' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Import modal ───────────────────────────────────────────────── */}
      {modal === 'import' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-7 animate-scale-in max-h-[90vh] flex flex-col">
            <button onClick={closeModal} className="absolute top-4 end-4 btn-ghost !p-2"><X className="w-4 h-4" /></button>

            {importDone ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center py-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-brand-navy font-bold text-xl mb-2">{ar ? 'تم الاستيراد بنجاح' : 'Import complete'}</h3>
                <p className="text-text-secondary text-sm mb-6">
                  {ar ? `تم إضافة ${validImport.length} موظف بنجاح` : `${validImport.length} employees added successfully`}
                </p>
                <button onClick={closeModal} className="btn-primary">{ar ? 'إغلاق' : 'Close'}</button>
              </div>
            ) : (
              <>
                <h3 className="text-brand-navy font-bold text-xl mb-1">{ar ? 'استيراد من ملف CSV' : 'Import from CSV'}</h3>
                <p className="text-text-secondary text-sm mb-5">
                  {ar
                    ? `تم قراءة ${importRows.length} صف — ${validImport.length} صالح، ${invalidImport.length} يحتوي على خطأ`
                    : `Read ${importRows.length} rows — ${validImport.length} valid, ${invalidImport.length} with errors`}
                </p>

                {/* Preview table */}
                <div className="overflow-auto flex-1 rounded-xl border border-border mb-5">
                  <table className="w-full text-xs min-w-[480px]">
                    <thead>
                      <tr className="bg-surface border-b border-border text-text-secondary">
                        <th className="text-start font-semibold px-4 py-2.5"></th>
                        <th className="text-start font-semibold px-3 py-2.5">{ar ? 'الرقم' : 'ID'}</th>
                        <th className="text-start font-semibold px-3 py-2.5">{ar ? 'الاسم' : 'Name'}</th>
                        <th className="text-start font-semibold px-3 py-2.5">{ar ? 'القسم' : 'Dept.'}</th>
                        <th className="text-start font-semibold px-3 py-2.5">{ar ? 'اللوحة' : 'Plate'}</th>
                        <th className="text-start font-semibold px-3 py-2.5">{ar ? 'الموقف' : 'Slot'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importRows.map((r, i) => (
                        <tr key={i} className={`border-b border-border/60 ${r.error ? 'bg-red-50/50' : ''}`}>
                          <td className="px-4 py-2.5">
                            {r.error
                              ? <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                              : <CheckCircle className="w-3.5 h-3.5 text-brand-green" />}
                          </td>
                          <td className="px-3 py-2.5 font-mono font-bold text-brand-navy" dir="ltr">{r.id || '—'}</td>
                          <td className="px-3 py-2.5">{r.nameAr || <span className="text-red-400">{r.error}</span>}</td>
                          <td className="px-3 py-2.5 text-text-secondary">{r.department || '—'}</td>
                          <td className="px-3 py-2.5 font-mono" dir="rtl">{r.plate || '—'}</td>
                          <td className="px-3 py-2.5">
                            {r.assignedSlot
                              ? <span className="badge bg-brand-navy/10 text-brand-navy font-bold" dir="ltr">{r.assignedSlot}</span>
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {invalidImport.length > 0 && (
                  <p className="text-xs text-red-500 mb-4 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {ar
                      ? `${invalidImport.length} صف يحتوي على أخطاء وسيتم تجاهله`
                      : `${invalidImport.length} row(s) with errors will be skipped`}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleImport}
                    disabled={saving || validImport.length === 0}
                    className="btn-primary flex-1 gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {saving
                      ? (ar ? 'جاري الاستيراد…' : 'Importing…')
                      : (ar ? `استيراد ${validImport.length} موظف` : `Import ${validImport.length} employees`)}
                  </button>
                  <button onClick={closeModal} className="btn-secondary">{ar ? 'إلغاء' : 'Cancel'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Add / Edit modal ───────────────────────────────────────────── */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 animate-scale-in">
            <button onClick={closeModal} className="absolute top-4 end-4 btn-ghost !p-2"><X className="w-4 h-4" /></button>
            <h3 className="text-brand-navy font-bold text-xl mb-6">
              {modal === 'add' ? (ar ? 'إضافة موظف جديد' : 'Add employee') : (ar ? 'تعديل بيانات الموظف' : 'Edit employee')}
            </h3>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-text-secondary mb-1.5 block">
                  {ar ? 'الرقم الوظيفي' : 'Employee ID'} <span className="text-red-400">*</span>
                </span>
                <input className={`field w-full ${errors.id ? 'border-red-400' : ''}`} placeholder="EMP010" dir="ltr"
                  value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={modal === 'edit'} />
                {errors.id && <p className="text-xs text-red-500 mt-1">{errors.id}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-text-secondary mb-1.5 block">
                  {ar ? 'الاسم بالعربية' : 'Full name (Arabic)'} <span className="text-red-400">*</span>
                </span>
                <input className={`field w-full ${errors.nameAr ? 'border-red-400' : ''}`} placeholder="خالد محمد العتيبي" dir="rtl"
                  value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
                {errors.nameAr && <p className="text-xs text-red-500 mt-1">{errors.nameAr}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-text-secondary mb-1.5 block">{ar ? 'القسم' : 'Department'}</span>
                <input className="field w-full" placeholder={ar ? 'الإنتاج' : 'Production'}
                  value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-text-secondary mb-1.5 block">{ar ? 'رقم لوحة المركبة' : 'Plate number'}</span>
                <input className="field w-full" placeholder="أ ب ج ١٢٣٤" dir="rtl"
                  value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-text-secondary mb-1.5 block">{ar ? 'رقم الموقف المخصص' : 'Assigned slot'}</span>
                <input className="field w-full" placeholder="D05" dir="ltr"
                  value={form.assignedSlot} onChange={(e) => setForm({ ...form, assignedSlot: e.target.value })} />
                <p className="text-xs text-text-muted mt-1">{ar ? 'مواقف الموظفين: D01–D18' : 'Employee slots: D01–D18'}</p>
              </label>
            </div>

            <div className="flex gap-3 mt-7">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 gap-2">
                <Save className="w-4 h-4" />
                {saving ? (ar ? 'جاري الحفظ…' : 'Saving…') : (ar ? 'حفظ' : 'Save')}
              </button>
              <button onClick={closeModal} className="btn-secondary">{ar ? 'إلغاء' : 'Cancel'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ─────────────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 animate-scale-in text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-brand-navy font-bold text-lg mb-2">{ar ? 'حذف الموظف؟' : 'Delete employee?'}</h3>
            <p className="text-text-secondary text-sm mb-6">
              {ar ? 'سيتم حذف بيانات الموظف نهائياً ولا يمكن التراجع.' : 'This employee will be permanently deleted.'}
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="btn-destructive flex-1">{ar ? 'نعم، احذف' : 'Yes, delete'}</button>
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">{ar ? 'إلغاء' : 'Cancel'}</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
