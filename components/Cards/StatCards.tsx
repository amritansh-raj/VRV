import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | null | undefined;
  icon: LucideIcon;
  description: string;
  gradient: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  gradient,
}: StatCardProps) {
  if (value === null || value === undefined) return null;

  return (
    <Card className={`${gradient} text-white`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-white/70" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value ?? 'N/A'}</div>
        <p className="text-xs text-white/70">{description}</p>
      </CardContent>
    </Card>
  );
}
