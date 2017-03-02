export default jest.mock('recharts', () => ({
  BarChart: 'BarChart',
  Bar: 'Bar',
  XAxis: 'XAxis',
  YAxis: 'YAxis',
  Tooltip: 'Tooltip',
  Legend: 'Legend',
  ResponsiveContainer: 'ResponsiveContainer',
  Pie: 'Pie',
  PieChart: 'PieChart'
}))
