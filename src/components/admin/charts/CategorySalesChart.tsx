import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface CategorySalesChartProps {
  data: {
    category: string;
    value: number;
    percentage: number;
    color: string;
  }[];
}

const CategorySalesChart = ({ data }: CategorySalesChartProps) => {
  // Format currency for the tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <ResponsiveContainer width={180} height={180}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          nameKey="category"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), "Revenue"]}
          contentStyle={{ 
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)"
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategorySalesChart; 