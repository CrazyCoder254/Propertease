import { FileText, Download, Calendar, Building2, Users, DollarSign, Wrench } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const reportTypes = [
  {
    id: 'property',
    title: 'Property Report',
    description: 'Overview of all properties including occupancy status, rent amounts, and maintenance history.',
    icon: Building2,
    color: 'primary',
  },
  {
    id: 'tenant',
    title: 'Tenant Report',
    description: 'Detailed tenant information, lease terms, and payment history.',
    icon: Users,
    color: 'info',
  },
  {
    id: 'rent',
    title: 'Rent Collection Report',
    description: 'Monthly rent collection summary, payment trends, and outstanding balances.',
    icon: DollarSign,
    color: 'success',
  },
  {
    id: 'maintenance',
    title: 'Maintenance Report',
    description: 'Maintenance request history, completion rates, and average resolution time.',
    icon: Wrench,
    color: 'warning',
  },
];

const recentReports = [
  { name: 'January 2024 Rent Report', date: '2024-01-15', type: 'rent' },
  { name: 'Q4 2023 Property Summary', date: '2024-01-10', type: 'property' },
  { name: 'Annual Tenant Overview 2023', date: '2024-01-05', type: 'tenant' },
  { name: 'December 2023 Maintenance', date: '2024-01-02', type: 'maintenance' },
];

export default function Reports() {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary';
      case 'info':
        return 'bg-info/10 text-info';
      case 'success':
        return 'bg-success/10 text-success';
      case 'warning':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download detailed reports for your properties
          </p>
        </div>

        {/* Report Types */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reportTypes.map((report, index) => (
            <div
              key={report.id}
              className={cn(
                'stat-card cursor-pointer group',
                'animate-fade-in'
              )}
              style={{
                opacity: 0,
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'forwards',
              }}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110',
                  getColorClass(report.color)
                )}
              >
                <report.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <Button variant="outline" className="w-full">
                Generate Report
              </Button>
            </div>
          ))}
        </div>

        {/* Recent Reports */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Reports</h2>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>

          <div className="space-y-3">
            {recentReports.map((report, index) => {
              const reportType = reportTypes.find((r) => r.id === report.type);

              return (
                <div
                  key={index}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors',
                    'animate-fade-in'
                  )}
                  style={{
                    opacity: 0,
                    animationDelay: `${index * 0.1 + 0.4}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        getColorClass(reportType?.color || 'primary')
                      )}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Generated on{' '}
                        {new Date(report.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
