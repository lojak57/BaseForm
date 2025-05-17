import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SalesTrendChartProps {
  data: { date: string; amount: number }[];
}

const SalesTrendChart = ({ data }: SalesTrendChartProps) => {
  // Format currency for the tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          tickFormatter={(value) => {
            if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
            return `$${value}`;
          }} 
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          width={60}
        />
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), "Revenue"]}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{ 
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)"
          }}
        />
        <Area 
          type="monotone" 
          dataKey="amount" 
          stroke="var(--primary)" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorRevenue)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesTrendChart; 