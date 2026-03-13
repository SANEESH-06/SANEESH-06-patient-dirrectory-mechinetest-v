import { Mail, MapPin, Phone } from 'lucide-react';

import { formatIssue } from '@/lib/utils';
import type { Patient } from '@/types/patient';

import { PatientAvatar } from './PatientAvatar';

export function CardView({ data }: { data: Patient[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.map((patient) => {
        const primaryContact = patient.contact[0];

        return (
          <article
            key={patient.patient_id}
            className="rounded-md border border-slate-200 bg-white p-3 shadow-[0_1px_4px_rgba(15,23,42,0.12)]"
          >
            <div className="flex items-start gap-2">
              <PatientAvatar
                name={patient.patient_name}
                photoUrl={patient.photo_url}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[11px] font-semibold text-slate-800">
                  {patient.patient_name}
                </h3>
                <p className="mt-0.5 text-[10px] font-medium tracking-[0.01em] text-slate-600">
                  {formatPatientId(patient.patient_id)}
                </p>
              </div>
              <span className="rounded-full bg-[#4a7ee9] px-2 py-0.5 text-[8px] font-medium text-white">
                Age {patient.age}
              </span>
            </div>

            <div className="mt-3">
              <span className={`inline-flex rounded px-1.5 py-0.5 text-[9px] font-medium ${getIssueBadgeTone(patient.medical_issue)}`}>
                {formatIssue(patient.medical_issue)}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-[9px] text-slate-600">
              <InfoLine
                icon={<MapPin className="h-3 w-3 text-slate-500" />}
                value={primaryContact?.address ?? 'N/A'}
              />
              <InfoLine
                icon={<Phone className="h-3 w-3 text-slate-500" />}
                value={primaryContact?.number ?? 'N/A'}
                danger={!primaryContact?.number}
              />
              <InfoLine
                icon={<Mail className="h-3 w-3 text-slate-500" />}
                value={primaryContact?.email ?? 'N/A'}
                danger={!primaryContact?.email}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function InfoLine({
  danger = false,
  icon,
  value,
}: {
  danger?: boolean;
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <span className="mt-0.5">{icon}</span>
      <span className={danger ? 'text-[#e55a5a]' : 'text-slate-600'}>{value}</span>
    </div>
  );
}

function formatPatientId(patientId: number) {
  return `ID-${String(patientId).padStart(4, '0')}`;
}

function getIssueBadgeTone(issue: string) {
  const tones: Record<string, string> = {
    fever: 'bg-[#ffe4e4] text-[#b32828]',
    headache: 'bg-[#ffe7c9] text-[#9a5b00]',
    'sore throat': 'bg-[#fff2bd] text-[#8a6700]',
    'sprained ankle': 'bg-[#d9f7ea] text-[#08784f]',
    rash: 'bg-[#ffd9ef] text-[#a12a72]',
    'ear infection': 'bg-[#dcecff] text-[#1f60c2]',
    sinusitis: 'bg-[#e7f0ff] text-[#44638d]',
    'allergic reaction': 'bg-[#fbe8c7] text-[#9b5e00]',
    'stomach ache': 'bg-[#e3f8d8] text-[#4b7d22]',
    'broken arm': 'bg-[#ece7ff] text-[#5f42ba]',
  };

  return tones[issue.toLowerCase()] ?? 'bg-slate-100 text-slate-700';
}
