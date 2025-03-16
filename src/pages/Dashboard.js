import ResourceChart from '../components/ResourceChart';
import WeeklyHours from '../components/WeeklyHours';
import AuditLogs from '../components/AuditLogs';

const Dashboard = () => {
  return (
    <div>
      <h1>Resource Management Dashboard</h1>
      <ResourceChart />
      <WeeklyHours />
      <AuditLogs />
    </div>
  );
};

export default Dashboard;
