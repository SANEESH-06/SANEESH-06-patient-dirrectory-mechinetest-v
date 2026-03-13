import { ArrowDownUp, Funnel, Search } from 'lucide-react';

import { PAGE_SIZE_OPTIONS, SORT_FIELD_OPTIONS } from '@/lib/patient-config';
import { formatAgeRange, formatIssue } from '@/lib/utils';
import type { SortField, SortOrder } from '@/types/patient';

interface FilterBarProps {
  ageFilter: {
    min: number | null;
    max: number | null;
  };
  filterIssues: string[];
  onAgeFilterChange: (value: { min: number | null; max: number | null }) => void;
  onLimitChange: (value: number) => void;
  onSearchChange: (value: string) => void;
  onSortByChange: (value: SortField) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onToggleIssue: (issue: string) => void;
  availableIssues: string[];
  limit: number;
  searchInput: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

const AGE_PRESETS = [
  { label: 'All ages', min: null, max: null },
  { label: '5-17', min: 5, max: 17 },
  { label: '18-40', min: 18, max: 40 },
  { label: '41-65', min: 41, max: 65 },
  { label: '66+', min: 66, max: null },
] as const;

export function FilterBar({
  ageFilter,
  availableIssues,
  filterIssues,
  limit,
  onAgeFilterChange,
  onLimitChange,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
  onToggleIssue,
  searchInput,
  sortBy,
  sortOrder,
}: FilterBarProps) {
  return (
    <div className="space-y-3 border-b border-slate-200 px-4 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4a7ee9]" />
          <input
            className="h-9 w-full rounded border border-slate-300 bg-white pl-9 pr-12 text-[11px] text-slate-700 outline-none transition focus:border-[#4a7ee9]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search"
            type="text"
            value={searchInput}
          />
          <details className="absolute right-2 top-1/2 -translate-y-1/2">
            <summary className="list-none cursor-pointer rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-[#4a7ee9]">
              <Funnel className="h-3.5 w-3.5" />
            </summary>
            <div className="absolute right-0 top-7 z-20 w-48 rounded border border-slate-200 bg-white p-3 shadow-lg">
              <p className="text-[10px] font-semibold text-slate-600">Age Filter</p>
              <div className="mt-2 space-y-1">
                {AGE_PRESETS.map((preset) => {
                  const isActive =
                    preset.min === ageFilter.min && preset.max === ageFilter.max;

                  return (
                    <button
                      key={preset.label}
                      className={`block w-full rounded px-2 py-1 text-left text-[10px] ${
                        isActive
                          ? 'bg-[#edf4ff] text-[#4a7ee9]'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                      onClick={() =>
                        onAgeFilterChange({ min: preset.min, max: preset.max })
                      }
                      type="button"
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 border-t border-slate-100 pt-2">
                <p className="text-[9px] uppercase tracking-wide text-slate-400">
                  Page size
                </p>
                <select
                  className="mt-1 h-8 w-full rounded border border-slate-300 bg-white px-2 text-[10px] text-slate-600 outline-none focus:border-[#4a7ee9]"
                  onChange={(event) => onLimitChange(Number(event.target.value))}
                  value={limit}
                >
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option} per page
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </details>
        </div>

        <div className="flex items-center gap-2 self-end lg:self-auto">
          <span className="text-[10px] font-semibold text-[#4a7ee9]">Sort by:</span>
          <select
            className="h-9 rounded border border-slate-300 bg-white px-2 text-[10px] text-slate-600 outline-none focus:border-[#4a7ee9]"
            onChange={(event) => onSortByChange(event.target.value as SortField)}
            value={sortBy}
          >
            {SORT_FIELD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            className="flex h-9 items-center gap-1 rounded border border-slate-300 bg-white px-2 text-[10px] text-slate-600 transition hover:border-[#4a7ee9]"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            type="button"
          >
            <span>{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
            <ArrowDownUp className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableIssues.map((issue) => {
          const active = filterIssues.includes(issue);

          return (
            <button
              key={issue}
              className={`rounded border px-2 py-1 text-[10px] ${
                active
                  ? 'border-[#4a7ee9] bg-[#edf4ff] text-[#4a7ee9]'
                  : 'border-slate-300 bg-white text-slate-600'
              }`}
              onClick={() => onToggleIssue(issue)}
              type="button"
            >
              {formatIssue(issue)}
              {active ? ' ×' : ''}
            </button>
          );
        })}

        {(ageFilter.min !== null || ageFilter.max !== null) ? (
          <button
            className="rounded border border-[#4a7ee9] bg-[#edf4ff] px-2 py-1 text-[10px] text-[#4a7ee9]"
            onClick={() => onAgeFilterChange({ min: null, max: null })}
            type="button"
          >
            Age {formatAgeRange(ageFilter.min, ageFilter.max)} ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
