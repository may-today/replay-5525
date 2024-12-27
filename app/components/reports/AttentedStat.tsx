import { useAtomValue } from 'jotai'
import { Bar, BarChart } from 'recharts'
import { AnimatedNumber } from '~/components/ui/animated-number'
import { ChartContainer, type ChartConfig } from '~/components/ui/chart'
import { selectedConcertDatesAtom } from '../../stores/app'
import { concertListMap } from '../../lib/data'
import { useFocusValue } from '~/hooks/useFocus'

type ChartData = {
  month: string
  all: number
  attended: number
}[]

const AttentedStat: React.FC<{ focus: boolean }> = ({ focus }) => {
  const selectedDates = useAtomValue(selectedConcertDatesAtom)
  const chartData = getChartData(selectedDates)
  const animAmount = useFocusValue(focus, () => selectedDates.length)
  const animRate = useFocusValue(focus, () => ~~((selectedDates.length / Object.keys(concertListMap).length) * 100))
  const lastConcertAmount = selectedDates.filter((date) => concertListMap[date].last).length
  const animLastConcertAmount = useFocusValue(focus, () => lastConcertAmount)

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4">
        <div className="text-report-normal">
          2024年，你一共看了
          <AnimatedNumber className="text-report-large" value={animAmount} />场 5525
        </div>
        <div className="text-report-normal">
          出勤率
          <AnimatedNumber className="text-report-large" value={animRate} />%
          {animRate === 100 && (
            <>
              {' '}获得
              <span className="text-report-large">全勤成就</span>
            </>
          )}
        </div>
        {lastConcertAmount > 0 && (
          <div className="text-report-normal">
            共解锁
            <AnimatedNumber className="text-report-large" value={animLastConcertAmount} />
            次尾场
          </div>
        )}
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
