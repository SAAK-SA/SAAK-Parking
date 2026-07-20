import { LogIn, LogOut } from 'lucide-react';
import type { SessionRow } from '../../data/seed';
import { useLanguage } from '../../context/LanguageContext';

interface RecentEventsProps {
  sessions: SessionRow[];
}

function hm(iso: string): string {
  return new Date(iso).toTimeString().slice(0, 5);
}

export default function RecentEvents({ sessions }: RecentEventsProps) {
  const { t } = useLanguage();
  const rows = sessions.slice(0, 7);

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-brand-navy">{t('events.title')}</h2>
      </div>

      {rows.length === 0 ? (
        <p className="text-text-secondary text-sm py-8 text-center">{t('report.empty')}</p>
      ) : (
        <div className="space-y-2">
          {rows.map((s) => {
            const exited = Boolean(s.exit_at);
            return (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${exited ? 'bg-blue-100' : 'bg-green-100'}`}>
                  {exited ? <LogOut className="w-4 h-4 text-brand-navy" /> : <LogIn className="w-4 h-4 text-green-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-navy truncate">
                    {s.name} <span className="text-text-muted font-normal">· {t(`kind.${s.kind}`)}</span>
                  </p>
                  <p className="text-xs text-text-secondary">
                    {t('report.slot')}: <span className="font-medium">{s.slot}</span> · {t('report.plateLabel')}: <span className="font-medium">{s.plate}</span>
                  </p>
                </div>
                <div className="text-end flex-shrink-0" dir="ltr">
                  <p className="text-xs font-semibold text-brand-navy tabular-nums">{hm(s.entry_at)}{exited && ` → ${hm(s.exit_at!)}`}</p>
                  <p className={`text-[10px] font-medium ${exited ? 'text-text-muted' : 'text-brand-green'}`}>
                    {exited ? t('report.exit') : t('report.inside')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
