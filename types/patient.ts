export interface PatientContact {
  address: string | null;
  number: string | null;
  email: string | null;
}

export interface Patient {
  patient_id: number;
  patient_name: string;
  age: number;
  photo_url: string | null;
  contact: PatientContact[];
  medical_issue: string;
}

export type SortField = 'patient_id' | 'patient_name' | 'age';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'card' | 'row';

export interface PatientFiltersMeta {
  availableIssues: string[];
  ageRange: {
    min: number;
    max: number;
  };
}

export interface PatientPaginationMeta {
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PatientApiResponse {
  data: Patient[];
  pagination: PatientPaginationMeta;
  filters: PatientFiltersMeta;
}

export interface PatientQueryInput {
  page: number;
  limit: number;
  offset: number;
  search: string;
  filterIssues: string[];
  filterAgeMin: number | null;
  filterAgeMax: number | null;
  sortBy: SortField;
  sortOrder: SortOrder;
}
