import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCapacity, fetchForecast } from '../store/slices/capacitySlice';
import { RootState, AppDispatch } from '../store';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Activity, Database, Cpu, Globe, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { records, forecast, loading } = useSelector((state: RootState) => state.capacity);
  const [selectedService, setSelectedService] = useState('compute');
  const [selectedRegion, setSelectedRegion] = useState('us-east-1');

  useEffect(() => {
    dispatch(fetchCapacity({ service: selectedService, region: selectedRegion }));
    dispatch(fetchForecast({ service: selectedService, region: selectedRegion }));
  }, [selectedService, selectedRegion, dispatch]);

  const chartData = [...records, ...forecast].map(item => ({
    time: new Date(item.timestamp || item.target_date).toLocaleDateString(),
    utilization: item.utilization_percentage || item.predicted_utilization,
    isForecast: !!item.target_date
  }));

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Operations Center</h1>
          <p className="text-slate-400">Capacity Monitoring & Forecasting</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={selectedService} 
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2"
          >
            <option value="compute">Compute</option>
            <option value="storage">Storage</option>
            <option value="database">Database</option>
          </select>
          <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2"
          >
            <option value="us-east-1">US East 1</option>
            <option value="eu-west-1">EU West 1</option>
          </select>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Current Load" value="64%" icon={<Activity className="text-sky-400" />} />
        <KPICard title="Storage Use" value="1.2 PB" icon={<Database className="text-purple-400" />} />
        <KPICard title="CPU Avg" value="42%" icon={<Cpu className="text-emerald-400" />} />
        <KPICard title="Alerts" value="2" icon={<AlertTriangle className="text-amber-400" />} />
      </div>

      {/* Main Chart */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
        <h2 className="text-xl font-semibold mb-6">Utilization Trend & Forecast</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#0ea5e9' }}
              />
              <Area 
                type="monotone" 
                dataKey="utilization" 
                stroke="#0ea5e9" 
                fillOpacity={1} 
                fill="url(#colorUtil)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon }: any) => (
  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex items-center gap-4">
    <div className="p-3 bg-slate-900 rounded-xl">{icon}</div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Dashboard;
