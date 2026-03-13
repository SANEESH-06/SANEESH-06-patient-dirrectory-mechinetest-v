'use client';

import { useEffect, useRef, useState } from 'react';
import { Funnel } from 'lucide-react';

import {
  DEFAULT_FILTERS_META,
  DEFAULT_PAGE_SIZE,
} from '@/lib/patient-config';
import { getErrorMessage } from '@/lib/utils';
import type {
  Patient,
  PatientApiResponse,
  PatientPaginationMeta,
  SortField,
  SortOrder,
  ViewMode,
} from '@/types/patient';

import { CardView } from './CardView';
import { FilterBar } from './FilterBar';
import { Pagination } from './Pagination';
import { RowView } from './RowView';

const initialPagination: PatientPaginationMeta = {
  total: 0,
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  offset: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export default function DataViewer() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('row');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIssues, setFilterIssues] = useState<string[]>([]);
  const [ageFilter, setAgeFilter] = useState<{ min: number | null; max: number | null }>({
    min: null,
    max: null,
  });
  const [sortBy, setSortBy] = useState<SortField>('patient_id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filtersMeta, setFiltersMeta] = useState(DEFAULT_FILTERS_META);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedSuccessfully = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPatients() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          search: searchQuery,
          sort_by: sortBy,
          sort_order: sortOrder,
        });

        if (filterIssues.length > 0) {
          params.set('filter_issues', filterIssues.join(','));
        }

        if (ageFilter.min !== null) {
          params.set('filter_age_min', String(ageFilter.min));
        }

        if (ageFilter.max !== null) {
          params.set('filter_age_max', String(ageFilter.max));
        }

        const response = await fetch(`/api/data?${params.toString()}`, {
          headers: { accept: 'application/json' },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}.`);
        }

        const result = (await response.json()) as
          | PatientApiResponse
          | { error: string };

        if ('error' in result) {
          throw new Error(result.error);
        }

        if (controller.signal.aborted) {
          return;
        }

        setPatients(result.data);
        setPagination(result.pagination);
        setFiltersMeta(result.filters);
        hasLoadedSuccessfully.current = true;
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(getErrorMessage(caughtError));

        if (!hasLoadedSuccessfully.current) {
          setPatients([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchPatients();

    return () => controller.abort();
  }, [
    ageFilter.max,
    ageFilter.min,
    filterIssues,
    limit,
    page,
    searchQuery,
    sortBy,
    sortOrder,
  ]);

  const activeFilterCount =
    filterIssues.length + (ageFilter.min !== null || ageFilter.max !== null ? 1 : 0);
  const isInitialLoad = loading && !hasLoadedSuccessfully.current;

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pagination.totalPages || nextPage === page) {
      return;
    }

    setPage(nextPage);
  };

  const handleToggleIssue = (issue: string) => {
    setFilterIssues((currentIssues) =>
      currentIssues.includes(issue)
        ? currentIssues.filter((entry) => entry !== issue)
        : [...currentIssues, issue],
    );
    setPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-[1320px] px-3 py-8 sm:px-4">
      <section className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.08)]">
        <div className="relative overflow-hidden bg-[#4a7ee9] px-4 py-3 text-white">
          <div className="absolute inset-y-0 right-0 w-[320px] plus-pattern opacity-90" />
          <div className="relative">
            <h1 className="text-[14px] font-semibold">Patient Directory</h1>
            <p className="mt-1 text-[10px] text-blue-100">
              {pagination.total || 1000} Patient Found
            </p>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 pt-3">
            <div className="flex items-center gap-5">
              <TabButton
                active={viewMode === 'row'}
                label="Table View"
                onClick={() => setViewMode('row')}
              />
              <TabButton
                active={viewMode === 'card'}
                label="Card View"
                onClick={() => setViewMode('card')}
              />
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Funnel className="h-3 w-3 text-[#4a7ee9]" />
              <span>Active Filters : {activeFilterCount}</span>
            </div>
          </div>

          <FilterBar
            ageFilter={ageFilter}
            availableIssues={filtersMeta.availableIssues}
            filterIssues={filterIssues}
            limit={limit}
            onAgeFilterChange={(value) => {
              setAgeFilter(value);
              setPage(1);
            }}
            onLimitChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
            onSearchChange={(value) => {
              setSearchInput(value);
              setPage(1);
            }}
            onSortByChange={(value) => {
              setSortBy(value);
              setPage(1);
            }}
            onSortOrderChange={(value) => {
              setSortOrder(value);
              setPage(1);
            }}
            onToggleIssue={handleToggleIssue}
            searchInput={searchInput}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />

          <div className="px-4 py-4">
            {error && !patients.length ? (
              <EmptyState
                description={error}
                title="Unable to load records"
              />
            ) : isInitialLoad ? (
              <LoadingState viewMode={viewMode} />
            ) : patients.length === 0 ? (
              <EmptyState
                description="Try changing the search, issue tags, or age filter."
                title="No patients found"
              />
            ) : viewMode === 'row' ? (
              <RowView data={patients} />
            ) : (
              <CardView data={patients} />
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-4">
            <Pagination
              currentPage={pagination.page}
              onPageChange={handlePageChange}
              totalPages={pagination.totalPages}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`border-b pb-2 text-[10px] ${
        active
          ? 'border-[#4a7ee9] font-medium text-slate-700'
          : 'border-transparent text-slate-500'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function EmptyState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded border border-dashed border-slate-200 bg-slate-50 text-center">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function LoadingState({ viewMode }: { viewMode: ViewMode }) {
  if (viewMode === 'row') {
    return (
      <div className="overflow-hidden rounded border border-slate-200">
        <div className="grid grid-cols-8 gap-0 border-b border-slate-200 bg-slate-50 px-4 py-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="skeleton h-3 w-16 rounded" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-8 gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0"
          >
            {Array.from({ length: 8 }).map((__, cellIndex) => (
              <div key={cellIndex} className="skeleton h-3 w-full rounded" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="rounded border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-2">
            <div className="skeleton h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-2 w-12 rounded" />
            </div>
            <div className="skeleton h-5 w-10 rounded-full" />
          </div>
          <div className="mt-3 skeleton h-4 w-16 rounded" />
          <div className="mt-3 space-y-2">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-4/5 rounded" />
            <div className="skeleton h-3 w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
