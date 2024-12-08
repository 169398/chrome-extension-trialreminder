import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalTrials: number;
  activeTrials: number;
  cancelledTrials: number;
  expiredTrials: number;
  upcomingExpirations: number;
  potentialSavings: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTrials: 0,
    activeTrials: 0,
    cancelledTrials: 0,
    expiredTrials: 0,
    upcomingExpirations: 0,
    potentialSavings: 0
  });

  useEffect(() => {
    chrome.storage.sync.get('trials', (data) => {
      const trials = data.trials || [];
      const now = new Date();
      
      const stats = trials.reduce((acc: { [x: string]: number; totalTrials: number; upcomingExpirations: number; }, trial: { status: string; startDate: string | number | Date; duration: number; }) => {
        acc.totalTrials++;
        acc[`${trial.status}Trials`]++;
        
        const expirationDate = new Date(trial.startDate);
        expirationDate.setDate(expirationDate.getDate() + trial.duration);
        
        if (trial.status === 'active' && 
            expirationDate.getTime() - now.getTime() <= 172800000) { // 2 days
          acc.upcomingExpirations++;
        }
        
        return acc;
      }, {
        totalTrials: 0,
        activeTrials: 0,
        cancelledTrials: 0,
        expiredTrials: 0,
        upcomingExpirations: 0,
        potentialSavings: trials.length * 10 // Assuming average $10 saving per trial
      });
      
      setStats(stats);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Trial Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              dataKey="value"
              data={[
                { name: 'Active', value: stats.activeTrials },
                { name: 'Cancelled', value: stats.cancelledTrials },
                { name: 'Expired', value: stats.expiredTrials }
              ]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              <Cell fill="#22c55e" />
              <Cell fill="#64748b" />
              <Cell fill="#ef4444" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold">Quick Stats</h3>
        <dl className="mt-2 space-y-2">
          <div className="flex justify-between">
            <dt>Total Trials</dt>
            <dd>{stats.totalTrials}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Active Trials</dt>
            <dd>{stats.activeTrials}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Upcoming Expirations</dt>
            <dd>{stats.upcomingExpirations}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Potential Savings</dt>
            <dd>${stats.potentialSavings}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
} 