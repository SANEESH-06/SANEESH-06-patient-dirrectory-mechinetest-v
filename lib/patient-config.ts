import type { PatientFiltersMeta, SortField } from '@/types/patient';

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 40;
export const PAGE_SIZE_OPTIONS = [10, 20, 40] as const;

export const SORT_FIELD_OPTIONS: Array<{ label: string; value: SortField }> = [
  { label: 'Patient ID', value: 'patient_id' },
  { label: 'Name', value: 'patient_name' },
  { label: 'Age', value: 'age' },
];

export const DEFAULT_FILTERS_META: PatientFiltersMeta = {
  availableIssues: [],
  ageRange: {
    min: 5,
    max: 100,
  },
};
