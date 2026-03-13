# Patient Directory Assignment

A single-page patient directory built with Next.js App Router, TypeScript, and Tailwind CSS. The app reads from a local `data.json` file through a Route Handler and presents the data in both card and row layouts with search, filters, sorting, pagination, loading states, and error handling.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React

## What is implemented

- Local API endpoint at `app/api/data/route.ts`
- Shared patient types used by both API and frontend
- API-backed pagination with `page`, `limit`, and `offset` support
- Search across patient name, issue, and contact fields
- Multi-select filtering by medical issue
- Age-range filtering
- Sorting by patient ID, name, and age
- Card view and row view
- Debounced search input
- Loading, empty, and error states
- Responsive layout

## Project structure

- `app/page.tsx`: page entry
- `components/DataViewer.tsx`: stateful client container
- `components/FilterBar.tsx`: search, filter, sort, and page-size controls
- `components/CardView.tsx`: card layout
- `components/RowView.tsx`: table layout
- `components/Pagination.tsx`: custom pagination
- `components/PatientAvatar.tsx`: image/fallback avatar handling
- `app/api/data/route.ts`: local JSON API
- `lib/patients.ts`: API query parsing and dataset processing
- `types/patient.ts`: shared TypeScript models

## API query parameters

`GET /api/data`

Supported query params:

- `page`
- `limit`
- `offset`
- `search`
- `filter_issues`
- `filter_age_min`
- `filter_age_max`
- `sort_by`
- `sort_order`

Example:

```bash
/api/data?page=2&limit=12&search=zoe&filter_issues=fever,rash&filter_age_min=18&sort_by=patient_name&sort_order=asc
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```

## Architecture notes

- The API is responsible for filtering, sorting, and pagination so the UI stays thin and assignment-friendly.
- The frontend keeps local view state only, then requests exactly the slice of data it needs.
- Shared config and types remove duplication between the route handler and the client.
- The UI keeps both layouts available from the same data source to satisfy the bonus view requirement.
# patient-directory
# patient-dirrectory-mechinetest
# patient-dirrectory-mechinetest
# patient-dirrectory-mechinetest-V2
# patient-directory-machine-test
# SANEESH-06-patient-dirrectory-mechinetest-v
