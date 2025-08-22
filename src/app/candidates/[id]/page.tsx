'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, BriefcaseIcon, ArrowLeftIcon, UserIcon, StarIcon } from '@heroicons/react/24/outline';
import type { Candidate, Submission } from '@/types/database';

interface CandidateWithCounts extends Candidate {
  submission_count?: number;
}

export default function CandidateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [candidate, setCandidate] = useState<CandidateWithCounts | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [subsLoading, setSubsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/candidates/${id}`);
        if (!res.ok) throw new Error('Candidate not found');
        const data = await res.json();
        setCandidate(data);
      } catch (e) {
        setError('Failed to load candidate');
      } finally {
        setLoading(false);
      }
    };
    const loadSubs = async () => {
      try {
        const res = await fetch(`/api/submissions?candidate_id=${id}`);
        if (res.ok) {
          const json = await res.json();
          setSubmissions(json.submissions || []);
        }
      } catch {
        // ignore
      } finally {
        setSubsLoading(false);
      }
    };
    load();
    loadSubs();
  }, [id]);

  const fullName = candidate?.full_name || [candidate?.first_name, candidate?.last_name].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-6">Loading candidate…</div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-700 mb-4">{error || 'Candidate not found'}</p>
          <button onClick={() => router.push('/candidates')} className="px-4 py-2 bg-blue-600 text-white rounded">
            Back to Candidates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-5 w-5" /> Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <UserIcon className="h-7 w-7 text-gray-500" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900">{fullName || 'Unnamed Candidate'}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  {candidate.current_title && (
                    <span className="inline-flex items-center gap-1"><BriefcaseIcon className="h-4 w-4" />{candidate.current_title}</span>
                  )}
                  {candidate.location && (
                    <span className="inline-flex items-center gap-1"><MapPinIcon className="h-4 w-4" />{candidate.location}</span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  {candidate.email && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700"><EnvelopeIcon className="h-4 w-4" />{candidate.email}</span>
                  )}
                  {candidate.phone && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700"><PhoneIcon className="h-4 w-4" />{candidate.phone}</span>
                  )}
                </div>
              </div>
            </div>

            {candidate.skills?.length ? (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.slice(0, 20).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{s}</span>
                  ))}
                  {candidate.skills.length > 20 && (
                    <span className="px-2 py-0.5 text-gray-500 text-xs">+{candidate.skills.length - 20} more</span>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Submissions</h2>
              <span className="text-sm text-gray-500">{candidate.submission_count || 0} total</span>
            </div>

            {subsLoading ? (
              <div className="py-6 text-gray-500">Loading…</div>
            ) : submissions.length === 0 ? (
              <div className="py-6 text-gray-500">No submissions yet</div>
            ) : (
              <div className="space-y-3">
                {submissions.map((s) => (
                  <div key={s.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                        <span>{s.match_score != null ? `${Math.round((s.match_score as number) * 100)}% match` : 'No score'}</span>
                      </div>
                      <span className="text-xs text-gray-500">{s.stage}</span>
                    </div>
                    {s.match_reasons && s.match_reasons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {s.match_reasons.slice(0, 4).map((r, idx) => {
                          let label: string;
                          if (typeof r === 'string' || typeof r === 'number') {
                            label = String(r);
                          } else if (r && typeof r === 'object') {
                            const rr = (r as any).reason ?? (r as any).message ?? '';
                            const w = (r as any).weight;
                            label = rr ? (w != null ? `${rr} (${Math.round(Number(w) * 100)}%)` : rr) : JSON.stringify(r);
                          } else {
                            label = String(r);
                          }
                          return (
                            <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{label}</span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <div className="space-y-2 text-sm text-gray-700">
              {candidate.current_company && (
                <div><span className="text-gray-500">Company:</span> <span className="ml-1">{candidate.current_company}</span></div>
              )}
              {candidate.years_experience != null && (
                <div><span className="text-gray-500">Experience:</span> <span className="ml-1">{candidate.years_experience} years</span></div>
              )}
              {candidate.linkedin_url && (
                <div>
                  <a href={candidate.linkedin_url} target="_blank" className="text-blue-600 hover:text-blue-800">LinkedIn Profile</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
