import { Cell, Pie, PieChart } from 'recharts';
import { useWindowSize } from 'usehooks-ts';
import { ChartToken } from '../types';

type Props = {
  data: ChartToken[];
  totalTokensAmount: number;
};

export const Chart: React.FC<Props> = ({ data, totalTokensAmount }) => {
  const { width } = useWindowSize();

  const isMobile = width <= 992;
  return (
    <PieChart width={210} height={210}>
      <Pie
        data={[{ value: 1 }]}
        cx="50%"
        cy="50%"
        innerRadius={67}
        outerRadius={67.5}
        fill="transparent"
        stroke="#FFFFFF1A"
        strokeWidth={0.5}
        dataKey="value"
      />
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={73}
        outerRadius={80}
        dataKey="value"
        startAngle={90}
        endAngle={-270}
        paddingAngle={5}
        cornerRadius={10}
      >
        {data?.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
        ))}
      </Pie>
      <text
        x="50%"
        y="45%"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#C9C9E280"
        fontSize={isMobile ? '20px' : '14px'}
        dy="-12"
      >
        Tokens
      </text>
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#C9C9E2"
        fontSize={isMobile ? '36px' : '26px'}
        fontWeight="400"
      >
        {totalTokensAmount}
      </text>
    </PieChart>
  );
};
