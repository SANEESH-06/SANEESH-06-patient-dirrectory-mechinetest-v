import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/lib/patient-config';
import { clamp } from '@/lib/utils';
import type {
  Patient,
  PatientApiResponse,
  PatientFiltersMeta,
  PatientQueryInput,
  SortField,
  SortOrder,
} from '@/types/patient';

const DATA_FILE_PATH = path.join(process.cwd(), 'data.json');
const SORT_FIELDS: SortField[] = ['patient_id', 'patient_name', 'age'];
const SORT_ORDERS: SortOrder[] = ['asc', 'desc'];

export async function loadPatients() {
  const fileContents = await readFile(DATA_FILE_PATH, 'utf8');
  return JSON.parse(fileContents) as Patient[];
}

export function parsePatientQuery(searchParams: URLSearchParams): PatientQueryInput {
  const limit = parseBoundedNumber(searchParams.get('limit'), DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE);

  const rawOffset = searchParams.get('offset');
  const rawPage = searchParams.get('page');

  let offset = 0;
  let page = 1;

  if (rawOffset !== null) {
    const parsedOffset = parseNonNegativeNumber(rawOffset, 0);
    offset = parsedOffset;
    page = Math.floor(parsedOffset / limit) + 1;
  } else {
    page = parsePositivePage(rawPage, 1);
    offset = (page - 1) * limit;
  }

  const search = searchParams.get('search')?.trim().toLowerCase() ?? '';
  const filterIssues =
    searchParams
      .get('filter_issues')
      ?.split(',')
      .map((issue) => issue.trim().toLowerCase())
      .filter(Boolean) ?? [];

  let filterAgeMin = parseOptionalNumber(searchParams.get('filter_age_min'));
  let filterAgeMax = parseOptionalNumber(searchParams.get('filter_age_max'));

  if (
    filterAgeMin !== null &&
    filterAgeMax !== null &&
    filterAgeMin > filterAgeMax
  ) {
    [filterAgeMin, filterAgeMax] = [filterAgeMax, filterAgeMin];
  }

  const rawSortBy = searchParams.get('sort_by');
  const rawSortOrder = searchParams.get('sort_order');

  const sortBy = SORT_FIELDS.includes(rawSortBy as SortField)
    ? (rawSortBy as SortField)
    : 'patient_id';

  const sortOrder = SORT_ORDERS.includes(rawSortOrder as SortOrder)
    ? (rawSortOrder as SortOrder)
    : 'asc';

  return {
    page,
    limit,
    offset,
    search,
    filterIssues,
    filterAgeMin,
    filterAgeMax,
    sortBy,
    sortOrder,
  };
}

export function buildPatientResponse(
  allPatients: Patient[],
  query: PatientQueryInput,
): PatientApiResponse {
  const filters = getPatientFiltersMeta(allPatients);

  const filteredPatients = sortPatients(
    allPatients.filter((patient) => {
      const matchesQuery = matchesSearch(patient, query.search);
      const matchesIssue =
        query.filterIssues.length === 0 ||
        query.filterIssues.includes(patient.medical_issue.toLowerCase());
      const matchesMinimumAge =
        query.filterAgeMin === null || patient.age >= query.filterAgeMin;
      const matchesMaximumAge =
        query.filterAgeMax === null || patient.age <= query.filterAgeMax;

      return matchesQuery && matchesIssue && matchesMinimumAge && matchesMaximumAge;
    }),
    query.sortBy,
    query.sortOrder,
  );

  const total = filteredPatients.length;
  const totalPages = Math.max(1, Math.ceil(total / query.limit));
  const maxOffset = Math.max((totalPages - 1) * query.limit, 0);
  const safeOffset = total === 0 ? 0 : clamp(query.offset, 0, maxOffset);
  const page = total === 0 ? 1 : Math.floor(safeOffset / query.limit) + 1;
  const data = filteredPatients.slice(safeOffset, safeOffset + query.limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit: query.limit,
      offset: safeOffset,
      totalPages,
      hasNextPage: total > 0 && page < totalPages,
      hasPreviousPage: page > 1,
    },
    filters,
  };
}

export function getPatientFiltersMeta(patients: Patient[]): PatientFiltersMeta {
  const issues = [...new Set(patients.map((patient) => patient.medical_issue))]
    .sort((left, right) => left.localeCompare(right));

  const ages = patients.map((patient) => patient.age);

  return {
    availableIssues: issues,
    ageRange: {
      min: Math.min(...ages),
      max: Math.max(...ages),
    },
  };
}

function matchesSearch(patient: Patient, search: string) {
  if (!search) {
    return true;
  }

  const searchableFields = [
    patient.patient_name,
    patient.medical_issue,
    ...patient.contact.flatMap((entry) =>
      [entry.address, entry.number, entry.email].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  ].map((value) => value.toLowerCase());

  return searchableFields.some((value) => value.includes(search));
}

function sortPatients(patients: Patient[], sortBy: SortField, sortOrder: SortOrder) {
  const direction = sortOrder === 'asc' ? 1 : -1;

  return [...patients].sort((left, right) => {
    if (sortBy === 'patient_name') {
      return direction * left.patient_name.localeCompare(right.patient_name);
    }

    return direction * (left[sortBy] - right[sortBy]);
  });
}

function parseNonNegativeNumber(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
}

function parsePositivePage(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function parseBoundedNumber(
  value: string | null,
  fallback: number,
  minimum: number,
  maximum: number,
) {
  const parsed = Number.parseInt(value ?? '', 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return clamp(parsed, minimum, maximum);
}

function parseOptionalNumber(value: string | null) {
  if (value === null || value.trim() === '') {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) ? parsed : null;
}
