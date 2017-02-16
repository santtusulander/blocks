export default jest.mock('recharts', () => ({
  AreaChart: 'AreaChart',
  Area: 'Area',
  BarChart: 'BarChart',
  Bar: 'Bar',
  XAxis: 'XAxis',
  YAxis: 'YAxis',
  Tooltip: 'Tooltip',
  Legend: 'Legend',
  ResponsiveContainer: 'ResponsiveContainer',
  Text: 'Text',
  Pie: 'Pie',
  PieChart: 'PieChart',
  ReactLineCharts: 'ReactLineCharts',
  Line: 'Line'
}))
