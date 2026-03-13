import { ChevronRight } from 'lucide-react';

import { formatIssue } from '@/lib/utils';
import type { Patient } from '@/types/patient';

import { PatientAvatar } from './PatientAvatar';

export function RowView({ data }: { data: Patient[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="border-b border-slate-200">
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Name</HeaderCell>
            <HeaderCell>Age</HeaderCell>
            <HeaderCell>Medical Issue</HeaderCell>
            <HeaderCell>Address</HeaderCell>
            <HeaderCell>Phone Number</HeaderCell>
            <HeaderCell>Email ID</HeaderCell>
            <HeaderCell />
          </tr>
        </thead>
        <tbody>
          {data.map((patient) => {
            const primaryContact = patient.contact[0];

            return (
              <tr key={patient.patient_id} className="group">
                <BodyCell className="w-[96px] whitespace-nowrap">
                  <span className="text-[11px] font-medium tracking-[0.01em] text-slate-700">
                    {formatPatientId(patient.patient_id)}
                  </span>
                </BodyCell>
                <BodyCell className="min-w-[230px]">
                  <div className="flex items-center gap-2">
                    <PatientAvatar
                      name={patient.patient_name}
                      photoUrl={patient.photo_url}
                      size="sm"
                    />
                    <span className="text-[10px] font-medium text-slate-700">
                      {patient.patient_name}
                    </span>
                  </div>
                </BodyCell>
                <BodyCell className="w-[60px] text-[10px] text-slate-600">
                  {patient.age}
                </BodyCell>
                <BodyCell className="min-w-[120px]">
                  <span className={`inline-flex rounded px-1.5 py-0.5 text-[9px] font-medium ${getIssueBadgeTone(patient.medical_issue)}`}>
                    {formatIssue(patient.medical_issue)}
                  </span>
                </BodyCell>
                <BodyCell className="min-w-[180px] text-[10px] text-slate-600">
                  {primaryContact?.address ?? <span className="text-[#e55a5a]">N/A</span>}
                </BodyCell>
                <BodyCell className="min-w-[110px] text-[10px] text-slate-600">
                  {primaryContact?.number ?? <span className="text-[#e55a5a]">N/A</span>}
                </BodyCell>
                <BodyCell className="min-w-[150px] text-[10px] text-slate-600">
                  {primaryContact?.email ?? <span className="text-[#e55a5a]">N/A</span>}
                </BodyCell>
                <BodyCell className="w-[30px] text-right text-slate-400">
                  <ChevronRight className="h-3.5 w-3.5 transition group-hover:text-slate-600" />
                </BodyCell>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function HeaderCell({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <th className="border-b border-slate-200 px-4 py-3 text-left text-[10px] font-semibold text-[#4a7ee9]">
      {children}
    </th>
  );
}

function BodyCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`border-b border-slate-100 px-4 py-3 align-middle ${className ?? ''}`}>
      {children}
    </td>
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
