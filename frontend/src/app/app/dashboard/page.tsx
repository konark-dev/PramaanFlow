'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { projectsApi } from '@/lib/api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CardSkeleton, EmptyState, ErrorState } from '@/components/ui/States';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Circle,
  Zap,
  Bell,
  ChevronRight,
  TrendingUp,
  Gift,
  Calendar,
  FileQuestion,
  MoreVertical,
  Check
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const DEMO_PROJECT_ID = 'proj-abc-foods-001';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6"><CardSkeleton lines={4} /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId') || DEMO_PROJECT_ID;

  const { data: cc, isLoading, error, refetch } = useQuery({
    queryKey: ['control-centre', projectId],
    queryFn: () => projectsApi.getControlCentre(projectId),
    refetchInterval: 10000, // Auto-sync every 10 seconds
    refetchOnWindowFocus: true, // Sync when user returns to tab
  });

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#f8f9fa] min-h-[calc(100vh-64px)] animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] ?? 'Entrepreneur'} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {isLoading ? 'Loading your investment proposal status…' : cc
              ? `Here's the status of your permissions, approvals and next steps.`
              : 'Welcome to the Industrial Approvals Platform.'}
          </p>
        </div>
        {cc && (
          <div className="text-right bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{cc.project.organization.legal_name}</p>
            <p className="text-sm font-extrabold text-gray-800 mt-0.5">{cc.project.name}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{cc.project.sector} · {cc.project.district}</p>
          </div>
        )}
      </div>

      {error && <ErrorState message={(error as Error).message} onRetry={() => refetch()} />}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} lines={2} />)}
        </div>
      )}

      {cc && (
        <>
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="Permissions & Approvals"
              value={cc.approvals.total}
              sub="View all clearances →"
              href="/app/approvals?filter=ALL"
              color="blue"
              icon={<Circle className="w-5 h-5 text-white" />}
            />
            <StatCard
              label="In Progress"
              value={cc.approvals.in_progress}
              sub="View in progress →"
              href="/app/approvals?filter=IN_PROGRESS"
              color="amber"
              icon={<Clock className="w-5 h-5 text-white" />}
            />
            <StatCard
              label="Completed"
              value={cc.approvals.completed}
              sub="Granted clearances →"
              href="/app/approvals?filter=COMPLETED"
              color="green"
              icon={<CheckCircle2 className="w-5 h-5 text-white" />}
            />
            <StatCard
              label="Pending Action"
              value={cc.approvals.blocked + cc.pending_queries.length}
              sub="Take action on blockers →"
              href="/app/approvals?filter=BLOCKED"
              color="red"
              icon={<AlertCircle className="w-5 h-5 text-white" />}
            />
          </div>

          {/* Setup Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-800">Your Setup Progress</h2>
                <p className="text-sm text-gray-500 mt-1">{cc.readiness.label}</p>
              </div>
              <div className="mt-2 md:mt-0 text-right">
                <span className="text-3xl font-extrabold text-gray-900">{cc.readiness.percent}%</span>
              </div>
            </div>
            
            <div className="relative z-10 h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-gray-800 to-gray-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${cc.readiness.percent}%` }}
              />
            </div>
            <div className="relative z-10 flex items-center justify-between mt-4 text-sm">
              <span className="text-gray-500 font-medium">
                <span className="text-gray-800 font-bold">{cc.approvals.completed}</span> of {cc.approvals.total} permissions & approvals obtained
              </span>
              <Link href={`/app/projects/${projectId}?tab=dependency-graph`} className="text-gray-800 hover:text-gray-600 font-semibold transition-colors flex items-center">
                View permission dependency map <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Recent Apps & Deadlines (2 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Applications */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="px-6 pt-6 pb-4 flex justify-between items-center border-b border-gray-50">
                <div>
                  <h3 className="text-base font-bold text-gray-800">Recent Permission Applications</h3>
                </div>
                <Link href="/app/approvals" className="text-xs font-bold text-gray-400 hover:text-gray-600">
                  View all
                </Link>
              </div>
              <div className="flex-1 divide-y divide-gray-50">
                {cc.sla_alerts.length === 0 && cc.pending_queries.length === 0 ? (
                  <EmptyState title="No active applications" description="Run regulatory analysis to identify required permissions & approvals." />
                ) : (
                  <>
                    {cc.sla_alerts.slice(0, 3).map((a) => (
                      <Link
                        key={a.application_number}
                        href={a.application_id ? `/app/applications/${a.application_id}` : '/app/approvals'}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                          <Clock className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{a.approval_name}</p>
                          <p className="text-xs text-gray-500 mt-1 font-medium">App #{a.application_number} • Open workspace →</p>
                        </div>
                        <StatusBadge status={a.sla_status ?? 'AT_RISK'} />
                      </Link>
                    ))}
                    {cc.pending_queries.slice(0, 2).map((q) => (
                      <Link
                        key={q.query_id}
                        href={q.application_id ? `/app/applications/${q.application_id}?tab=queries` : '/app/approvals'}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-red-50/40 transition-colors cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                          <FileQuestion className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{q.approval_name}</p>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Query: {q.subject} • Respond →</p>
                        </div>
                        <StatusBadge status="QUERY_RAISED" />
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Deadlines */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="px-6 pt-6 pb-4 flex justify-between items-center border-b border-gray-50">
                <div>
                  <h3 className="text-base font-bold text-gray-800">Upcoming Deadlines</h3>
                </div>
                <Link href="/app/compliance" className="text-xs font-bold text-gray-400 hover:text-gray-600">
                  View all
                </Link>
              </div>
              <div className="flex-1 divide-y divide-gray-50">
                {cc.upcoming_renewals.length === 0 ? (
                  <EmptyState title="No upcoming renewals" description="Your compliance & renewal schedule is clear for now." />
                ) : (
                  cc.upcoming_renewals.slice(0, 4).map((r) => {
                    const daysLeft = Math.ceil((new Date(r.next_due_date).getTime() - Date.now()) / 86_400_000);
                    const isUrgent = daysLeft <= 30;
                    return (
                      <div key={r.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isUrgent ? 'bg-red-50' : daysLeft <= 60 ? 'bg-orange-50' : 'bg-gray-50'
                        }`}>
                          <Calendar className={`w-5 h-5 ${isUrgent ? 'text-red-500' : daysLeft <= 60 ? 'text-orange-500' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{r.name}</p>
                          <p className="text-xs text-gray-500 mt-1 font-medium">{r.authority}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-sm font-bold ${isUrgent ? 'text-red-600' : 'text-gray-800'}`}>
                            {daysLeft}d left
                          </p>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">{formatDate(r.next_due_date)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Next Action & Incentives (2 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Next best action */}
            {cc.next_best_action && (
              <div className="bg-gray-900 rounded-2xl shadow-sm p-6 relative overflow-hidden text-white flex flex-col justify-center">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Next Best Action</p>
                    <p className="text-base font-bold text-white mt-1.5 leading-snug">{cc.next_best_action}</p>
                    <Link
                      href={cc.next_best_action_link ?? '/app/approvals'}
                      className="inline-flex items-center gap-1 mt-4 text-sm font-bold text-gray-300 hover:text-white transition-colors"
                    >
                      Take action <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Incentives */}
            {cc.incentive_matches.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-gray-700" />
                    <h2 className="text-base font-bold text-gray-800">Potentially Applicable Incentives</h2>
                  </div>
                  <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                    {cc.incentive_matches.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {cc.incentive_matches.slice(0, 3).map((m) => (
                    <div key={m.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{m.scheme_name}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{m.authority}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-4 italic font-medium">{cc.incentive_matches[0]?.label}</p>
              </div>
            )}
          </div>

          {/* Blocked approvals alert */}
          {cc.blocked_approvals.length > 0 && (
            <div className="bg-red-50 rounded-2xl p-5 border border-red-100 flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800 mb-2">
                  {cc.blocked_approvals.length} approval{cc.blocked_approvals.length > 1 ? 's' : ''} blocked
                </p>
                <div className="space-y-2">
                  {cc.blocked_approvals.map((b) => (
                    <div key={b.id} className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">{b.approval_name}</span>
                      <span className="text-xs font-medium text-red-600">{b.blocked_reason ?? 'Prerequisites not met'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Project info footer */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-x divide-gray-50">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sector</p>
                <p className="text-base font-bold text-gray-800 mt-2">{cc.project.sector}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Investment</p>
                <p className="text-base font-bold text-gray-800 mt-2">{formatCurrency(cc.project.investment_amount)}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Employees</p>
                <p className="text-base font-bold text-gray-800 mt-2">{cc.project.employee_count}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">District</p>
                <p className="text-base font-bold text-gray-800 mt-2">{cc.project.district}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label, value, sub, href, color, icon,
}: {
  label: string; value: number; sub: string; href: string;
  color: 'blue' | 'amber' | 'green' | 'red'; icon: React.ReactNode;
}) {
  const cls = {
    blue:  { text: 'text-blue-500',  hover: 'group-hover:text-blue-600' },
    amber: { text: 'text-amber-500', hover: 'group-hover:text-amber-600' },
    green: { text: 'text-green-500', hover: 'group-hover:text-green-600' },
    red:   { text: 'text-red-500',   hover: 'group-hover:text-red-600' },
  }[color];

  return (
    <Link href={href} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-36">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-bold text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-extrabold text-gray-800">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-md shadow-gray-900/10 transform group-hover:scale-105 transition-transform duration-300 flex-shrink-0 border border-gray-700">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className={`text-xs font-bold ${cls.text} ${cls.hover} transition-colors flex items-center`}>
          {sub}
        </p>
      </div>
    </Link>
  );
}
