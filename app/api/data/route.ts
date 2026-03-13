import { NextResponse } from 'next/server';

import { buildPatientResponse, loadPatients, parsePatientQuery } from '@/lib/patients';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const patients = await loadPatients();
    const query = parsePatientQuery(url.searchParams);

    return NextResponse.json(buildPatientResponse(patients, query));
  } catch (error) {
    console.error('Error loading patient data:', error);

    return NextResponse.json(
      {
        error: 'Failed to load patient data.',
      },
      { status: 500 },
    );
  }
}
