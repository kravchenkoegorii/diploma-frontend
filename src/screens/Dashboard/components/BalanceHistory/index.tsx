import { useState } from 'react';
import useSWR from 'swr';
import './index.css';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useWindowSize } from 'usehooks-ts';
import { userService } from '@/services/userService';
import { Address } from 'viem';
import { formatNumber } from '@/utilities/number';
import { CgSpinnerAlt } from 'react-icons/cg';
import { usePrivy } from '@privy-io/react-auth';
import { useUserStore } from '@/stores/user';
import { useShallow } from 'zustand/shallow';
import { useAppStore } from '@/stores/app';
import { chains } from '@/constants/chains';

const ranges = [
  {
    title: '1H',
    id: 1,
  },
  {
    title: '24H',
    id: 2,
  },
  {
    title: '7D',
    id: 3,
  },
  {
    title: '30D',
    id: 4,
  },
];

export const BalanceHistory = () => {
  const defaultWallet = useUserStore(
    useShallow(s => s.userData?.wallets.find(w => w.isDefault))
  );
  const { user } = usePrivy();
  const [range, setRange] = useState<string>('24H');
  const { width } = useWindowSize();
  const isMobile = width <= 992;
  const isTablet = width >= 992 && width < 1400;
  const currentChain = useAppStore(useShallow(s => s.currentChain));

  const { data, isLoading } = useSWR(
    defaultWallet && currentChain
      ? `/api/balances/history?walletAddress=${defaultWallet.address}&interval=${range}&chains=${
          currentChain.id === -1
            ? chains
                .filter(n => n.id !== -1)
                .map(n => n.id)
                .join('&chains=')
            : currentChain.id
        }`
      : null,
    () =>
      userService.getBalanceHistory(
        defaultWallet?.address as Address,
        range,
        currentChain.id === -1
          ? chains.filter(n => n.id !== -1).map(n => n.id)
          : [currentChain.id]
      )
  );

  const series = [
    {
      name: 'Balance',
      data:
        data && Array.isArray(data)
          ? data.map((point: { date: number; totalBalanceUsd: number }) => ({
              x: point.date,
              y: formatNumber(point.totalBalanceUsd, 'en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              }),
            }))
          : [],
    },
  ];

  const formatXAxisLabel = (value: number, range: string) => {
    const date = new Date(value);

    if (range === '7D' || range === '30D' || range === '1Y') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
      });
    } else {
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const options: ApexOptions = {
    chart: {
      id: 'area-datetime',
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: ['#FFFFFF'],
      width: 3,
      dashArray: 0,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: value => formatXAxisLabel(+value, range),
        style: { colors: '#A0A0A0', fontSize: '10px' },
      },
      crosshairs: {
        stroke: { color: '#FFFFFF1A', width: 1, dashArray: 4 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tickAmount: 7,
    },
    yaxis: {
      labels: {
        style: { colors: '#A0A0A0', fontSize: '10px' },
      },
      axisTicks: { show: false },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0,
        colorStops: [
          { offset: 0, color: '#FFFFFF', opacity: 0.1 },
          { offset: 70, color: '#FFFFFF', opacity: 0 },
        ],
      },
    },
    grid: { show: false },
    tooltip: {
      theme: 'dark',
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const value = series[seriesIndex][dataPointIndex];
        const date = new Date(
          w.globals.seriesX[seriesIndex][dataPointIndex]
        ).toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return `<div style="
          padding: 16px;
          border-radius: 13px;
          background-color:#303032;
          margin-bottom: 6px
        ">
          <div style="font-size: 14px; font-weight: 400; color: #fff;">$${value.toFixed(2)}</div>
          <div style="font-size: 10px; color: #C9C9E299">${date}</div>
        </div>`;
      },
    },
    markers: {
      size: 0,
      colors: ['#FFFFFF'],
      strokeWidth: 1,
      strokeColors: '#fff',
      hover: { size: 5 },
    },
    dataLabels: { enabled: false },
  };

  return (
    <div className="w-full max-992px:h-[374px] h-[400px] text-white rounded-lg">
      <div className="flex justify-between items-center border-b-[0.5px] border-white/10 max-992px:py-[27.5px] py-6 max-992px:px-[22px] px-8">
        <p className="text-[24px] leading-[26.4px] ">History</p>

        <div className="flex justify-center bg-white rounded-[10px] bg-opacity-[0.03] my-2">
          {ranges.map(r => (
            <button
              key={r.id}
              className={`cursor-pointer hover:opacity-70 transition-all duration-300 max-992px:px-[10px] px-4 py-1 rounded-[10px] max-992px:text-[10px] transition-colors duration-300 ${
                range === r.title &&
                'bg-gradient-to-r from-white to-[#C9C9E2] text-[#171717]'
              }`}
              onClick={() => setRange(r.title)}
            >
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !user || data.length === 0 ? (
        <div className="flex justify-center mt-10">
          <CgSpinnerAlt className="text-[35px] animate-spin" />
        </div>
      ) : (
        <div className="relative w-[100.7%] max-992px:h-[296px] h-[363px]">
          <span className="absolute top-[10px] left-[50px] font-bold text-white text-[10px]">
            Amount
          </span>

          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={isMobile ? 266 : isTablet ? 290 : 363}
          />

          <span className="absolute tablet:bottom-[75px] tablet:right-5 max-992px:bottom-[32px] bottom-1 font-bold right-4 text-white text-[10px]">
            {range}
          </span>
        </div>
      )}
    </div>
  );
};
