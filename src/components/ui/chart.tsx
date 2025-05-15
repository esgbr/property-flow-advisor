import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Sector,
  Label,
} from 'recharts';

interface SimpleAreaChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const SimpleAreaChart: React.FC<SimpleAreaChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="uv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#uv)" />
        <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#pv)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

interface SimpleLineChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

interface SimpleBarChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#8884d8" />
        <Bar dataKey="uv" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

interface SimplePieChartProps {
  data: { name: string; value: number }[];
  colors: string[];
}

const SimplePieChart: React.FC<SimplePieChartProps> = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface AdvancedPieChartProps {
  data: { name: string; value: number }[];
}

const AdvancedPieChart: React.FC<AdvancedPieChartProps> = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface DoughnutChartProps {
  data: { name: string; value: number }[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          labelLine={false}
          label={renderCustomizedLabel}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface TwoLevelPieChartProps {
  data: { name: string; value: number }[];
}

const TwoLevelPieChart: React.FC<TwoLevelPieChartProps> = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={90}
          outerRadius={110}
          fill="#82ca9d"
          label
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface CustomActiveShapePieChartProps {
  data: { name: string; value: number }[];
}

const CustomActiveShapePieChart: React.FC<CustomActiveShapePieChartProps> = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const [activeIndex, setActiveIndex] = React.useState(0);

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={-4} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Value ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={(_, index) => {
            setActiveIndex(index);
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface LineBarAreaComposedChartProps {
  data: { name: string; uv: number; pv: number; amt: number; cnt: number }[];
}

const LineBarAreaComposedChart: React.FC<LineBarAreaComposedChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* ComposedChart implementation here */}
      <div>LineBarAreaComposedChart</div>
    </ResponsiveContainer>
  );
};

interface VerticalComposedChartProps {
  data: { name: string; uv: number; pv: number; amt: number; cnt: number }[];
}

const VerticalComposedChart: React.FC<VerticalComposedChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* VerticalComposedChart implementation here */}
      <div>VerticalComposedChart</div>
    </ResponsiveContainer>
  );
};

interface RadarChartProps {
  data: { subject: string; A: number; B: number; fullMark: number }[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* RadarChart implementation here */}
      <div>RadarChart</div>
    </ResponsiveContainer>
  );
};

interface PolarChartProps {
  data: { subject: string; A: number; B: number, C: number }[];
}

const PolarChart: React.FC<PolarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* PolarChart implementation here */}
      <div>PolarChart</div>
    </ResponsiveContainer>
  );
};

interface BrushChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const BrushChart: React.FC<BrushChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* BrushChart implementation here */}
      <div>BrushChart</div>
    </ResponsiveContainer>
  );
};

interface TinyLineChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const TinyLineChart: React.FC<TinyLineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* TinyLineChart implementation here */}
      <div>TinyLineChart</div>
    </ResponsiveContainer>
  );
};

interface CustomizedDotLineChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const CustomizedDotLineChart: React.FC<CustomizedDotLineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* CustomizedDotLineChart implementation here */}
      <div>CustomizedDotLineChart</div>
    </ResponsiveContainer>
  );
};

interface StackedAreaChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const StackedAreaChart: React.FC<StackedAreaChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* StackedAreaChart implementation here */}
      <div>StackedAreaChart</div>
    </ResponsiveContainer>
  );
};

interface процентильAreaChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const процентильAreaChart: React.FC<процентильAreaChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* процентильAreaChart implementation here */}
      <div>процентильAreaChart</div>
    </ResponsiveContainer>
  );
};

interface MixBarChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const MixBarChart: React.FC<MixBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* MixBarChart implementation here */}
      <div>MixBarChart</div>
    </ResponsiveContainer>
  );
};

interface StackedBarChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* StackedBarChart implementation here */}
      <div>StackedBarChart</div>
    </ResponsiveContainer>
  );
};

interface PositiveAndNegativeBarChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const PositiveAndNegativeBarChart: React.FC<PositiveAndNegativeBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* PositiveAndNegativeBarChart implementation here */}
      <div>PositiveAndNegativeBarChart</div>
    </ResponsiveContainer>
  );
};

interface BiaxialBarChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const BiaxialBarChart: React.FC<BiaxialBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* BiaxialBarChart implementation here */}
      <div>BiaxialBarChart</div>
    </ResponsiveContainer>
  );
};

interface CustomShapeBarChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const CustomShapeBarChart: React.FC<CustomShapeBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* CustomShapeBarChart implementation here */}
      <div>CustomShapeBarChart</div>
    </ResponsiveContainer>
  );
};

interface LineChartWithReferenceLinesProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const LineChartWithReferenceLines: React.FC<LineChartWithReferenceLinesProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* LineChartWithReferenceLines implementation here */}
      <div>LineChartWithReferenceLines</div>
    </ResponsiveContainer>
  );
};

interface LineChartWithIconProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const LineChartWithIcon: React.FC<LineChartWithIconProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* LineChartWithIcon implementation here */}
      <div>LineChartWithIcon</div>
    </ResponsiveContainer>
  );
};

interface CustomizedLabelLineChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const CustomizedLabelLineChart: React.FC<CustomizedLabelLineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* CustomizedLabelLineChart implementation here */}
      <div>CustomizedLabelLineChart</div>
    </ResponsiveContainer>
  );
};

interface DashedLineChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const DashedLineChart: React.FC<DashedLineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* DashedLineChart implementation here */}
      <div>DashedLineChart</div>
    </ResponsiveContainer>
  );
};

interface ZoomableLineChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const ZoomableLineChart: React.FC<ZoomableLineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* ZoomableLineChart implementation here */}
      <div>ZoomableLineChart</div>
    </ResponsiveContainer>
  );
};

interface SimpleRadialBarChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const SimpleRadialBarChart: React.FC<SimpleRadialBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* SimpleRadialBarChart implementation here */}
      <div>SimpleRadialBarChart</div>
    </ResponsiveContainer>
  );
};

interface CustomizedLabelRadialBarChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const CustomizedLabelRadialBarChart: React.FC<CustomizedLabelRadialBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* CustomizedLabelRadialBarChart implementation here */}
      <div>CustomizedLabelRadialBarChart</div>
    </ResponsiveContainer>
  );
};

interface трееMapChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const трееMapChart: React.FC<трееMapChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* трееMapChart implementation here */}
      <div>трееMapChart</div>
    </ResponsiveContainer>
  );
};

interface CompositionChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const CompositionChart: React.FC<CompositionChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* CompositionChart implementation here */}
      <div>CompositionChart</div>
    </ResponsiveContainer>
  );
};

interface VerticalBarChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const VerticalBarChart: React.FC<VerticalBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* VerticalBarChart implementation here */}
      <div>VerticalBarChart</div>
    </ResponsiveContainer>
  );
};

interface SimpleScatterChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const SimpleScatterChart: React.FC<SimpleScatterChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* SimpleScatterChart implementation here */}
      <div>SimpleScatterChart</div>
    </ResponsiveContainer>
  );
};

interface ScatterChartWithCategoricalDomainProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const ScatterChartWithCategoricalDomain: React.FC<ScatterChartWithCategoricalDomainProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* ScatterChartWithCategoricalDomain implementation here */}
      <div>ScatterChartWithCategoricalDomain</div>
    </ResponsiveContainer>
  );
};

interface BubbleChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* BubbleChart implementation here */}
      <div>BubbleChart</div>
    </ResponsiveContainer>
  );
};

interface SameDataComposedChartProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const SameDataComposedChart: React.FC<SameDataComposedChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* SameDataComposedChart implementation here */}
      <div>SameDataComposedChart</div>
    </ResponsiveContainer>
  );
};

interface CustomizedLabelProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const CustomizedLabel: React.FC<CustomizedLabelProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* CustomizedLabel implementation here */}
      <div>CustomizedLabel</div>
    </ResponsiveContainer>
  );
};

interface CustomContentProps {
  data: { name: string; uv: number; pv: number; amt: number }[];
}

const CustomContent: React.FC<CustomContentProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* CustomContent implementation here */}
      <div>CustomContent</div>
    </ResponsiveContainer>
  );
};

// Example placeholder (please adjust to actual context in file around line 287):
const CustomLabel = ({ payload }: { payload: any[] }) => (
  <div>
    {payload.map((item, idx) => (
      <div key={idx}>
        {/* Use the most appropriate, existing key */}
        {String(
          item.value ??
          item.payload?.label ??
          item.payload?.name ??
          item.dataKey ??
          ''
        )}
      </div>
    ))}
  </div>
);

export {
  SimpleAreaChart,
  SimpleLineChart,
  SimpleBarChart,
  SimplePieChart,
  AdvancedPieChart,
  DoughnutChart,
  TwoLevelPieChart,
  CustomActiveShapePieChart,
  LineBarAreaComposedChart,
  VerticalComposedChart,
  RadarChart,
  PolarChart,
  BrushChart,
  TinyLineChart,
  CustomizedDotLineChart,
  StackedAreaChart,
  процентильAreaChart,
  MixBarChart,
  StackedBarChart,
  PositiveAndNegativeBarChart,
  BiaxialBarChart,
  CustomShapeBarChart,
  LineChartWithReferenceLines,
  LineChartWithIcon,
  CustomizedLabelLineChart,
  DashedLineChart,
  ZoomableLineChart,
  SimpleRadialBarChart,
  CustomizedLabelRadialBarChart,
  трееMapChart,
  CompositionChart,
  VerticalBarChart,
  SimpleScatterChart,
  ScatterChartWithCategoricalDomain,
  BubbleChart,
  SameDataComposedChart,
  CustomizedLabel,
  CustomContent
};
