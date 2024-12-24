import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { Bar, BarChart } from 'recharts'
import { ChartContainer, type ChartConfig } from '~/components/ui/chart'
import { selectedConcertDatesAtom } from '../../stores/app'
import { concertListMap } from '../../logic/data'

type ChartData = {
  month: string
  all: number
  attended: number
}[]

const AttentedStat: React.FC = () => {
  const selectedDates = useAtomValue(selectedConcertDatesAtom)
  const chartData = getChartData(selectedDates)

  return (
    <div className={clsx(['flex flex-col gap-4 p-4'])}>
      <div>
        <div className="text-xl font-bold">你参加了<span className="text-2xl">{selectedDates.length}</span> 场演唱会</div>
        <div className="text-xl font-bold">出勤率 <span className="text-2xl">{((selectedDates.length / Object.keys(concertListMap).length) * 100).toFixed(2)}%</span></div>
      </div>
      <Chart chartData={chartData} />
    </div>
  )
}

const getChartData = (selectedDates: string[]) => {
  const allConcertMonths = Object.keys(concertListMap).map((date) => date.split('.')[1])
  const selectedDatesMonths = selectedDates.map((date) => date.split('.')[1])
  return [...Array(12).keys()].map((index) => {
    const thisMonth = (index + 1).toString().padStart(2, '0')
    return {
      month: thisMonth,
      all: allConcertMonths.filter((month) => month === thisMonth).length,
      attended: selectedDatesMonths.filter((month) => month === thisMonth).length,
    }
  })
}

const chartConfig = {
  all: {
    label: 'all',
    color: 'var(--chart-color-secondary)',
  },
  attended: {
    label: 'attended',
    color: 'var(--chart-color-primary)',
  },
} satisfies ChartConfig

const Chart: React.FC<{ chartData: ChartData }> = ({ chartData }) => {
  return (
    <ChartContainer config={chartConfig} className="h-[200px]">
      <BarChart accessibilityLayer data={chartData}>
        {/* <CartesianGrid vertical={false} /> */}
        {/* <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        /> */}
        {/* <ChartTooltip content={<ChartTooltipContent hideLabel />} /> */}
        {/* <ChartLegend content={<ChartLegendContent />} /> */}
        <Bar dataKey="attended" stackId="a" fill="var(--chart-color-primary)" isAnimationActive={false} />
        <Bar dataKey="all" stackId="a" fill="var(--chart-color-secondary)" isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}

export default AttentedStat
