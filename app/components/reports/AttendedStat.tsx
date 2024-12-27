import { useAtomValue } from 'jotai'
import { Bar, BarChart } from 'recharts'
import { AnimatedNumber } from '~/components/ui/animated-number'
import { ChartContainer, type ChartConfig } from '~/components/ui/chart'
import { selectedConcertDateTypeMapAtom } from '~/stores/app'
import { concertListMap } from '~/lib/data'
import { useFocusValueMap } from '~/hooks/useFocus'
import type { ConcertSelectType } from '~/data/types'

type ChartData = {
  month: string
  all: number
  attended: number
}[]

const getPageData = (selectedConcertDateTypeMap: Record<string, ConcertSelectType>) => {
  const selectedDates = Object.keys(selectedConcertDateTypeMap)
  const selectedTypes = Object.values(selectedConcertDateTypeMap)
  const outdoorAmount = selectedTypes.filter((type) => type === 'outdoor').length
  const groundAmount = selectedTypes.filter((type) => type === 'ground').length
  const seatsAmount = selectedTypes.filter((type) => type === 'seats').length
  return {
    selectedDates,
    rate: ~~((selectedDates.length / Object.keys(concertListMap).length) * 100),
    lastConcertAmount: selectedDates.filter((date) => concertListMap[date].last).length,
    outdoorAmount,
    groundAmount,
    seatsAmount,
    groundRate: groundAmount + seatsAmount > 0 ? ~~((groundAmount / (groundAmount + seatsAmount)) * 100) : 0,
    seatsRate: groundAmount + seatsAmount > 0 ? ~~((seatsAmount / (groundAmount + seatsAmount)) * 100) : 0,
  }
}

const AttendedStat: React.FC<{ focus: boolean }> = ({ focus }) => {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const data = getPageData(selectedConcertDateTypeMap)
  console.log('AttentedStat', data)
  const chartData = getChartData(data.selectedDates)

  const animValue = useFocusValueMap(focus, () => ({
    amount: data.selectedDates.length,
    hours: data.selectedDates.length * 3,
    rate: data.rate,
    lastConcertAmount: data.lastConcertAmount,
    outdoorAmount: data.outdoorAmount,
    groundAmount: data.groundAmount,
    seatsAmount: data.seatsAmount,
  }))

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4">
        <div className="text-report-normal">
          2024年，你一共看了
          <AnimatedNumber className="text-report-large" value={animValue.amount} />场 5525
          {data.lastConcertAmount > 0 && (
            <span>
              ，解锁了
              <AnimatedNumber className="text-report-large" value={animValue.lastConcertAmount} />
              次尾场
            </span>
          )}
          ，陪五月天唱过
          <AnimatedNumber className="text-report-large" value={animValue.hours} />
          小时
        </div>
        <div className="text-report-normal">
          出勤率
          <AnimatedNumber className="text-report-large" value={animValue.rate} />%
          {animValue.rate === 100 && (
            <>
              获得
              <span className="text-report-large">全勤成就</span>
            </>
          )}
        </div>
        <GroundSeatText data={data} />
      </div>
      <Chart chartData={chartData} />
    </div>
  )
}

const GroundSeatText: React.FC<{ data: ReturnType<typeof getPageData> }> = ({ data }) => {
  return (
    <>
      {data.groundRate >= 60 && (
        <div className="text-report-normal">
          你似乎更喜欢<span className="text-report-large">内场摇滚区</span>
        </div>
      )}
      {data.seatsRate >= 60 && (
        <div className="text-report-normal">
          你似乎更喜欢<span className="text-report-large">看台区</span>
        </div>
      )}
      {data.groundRate < 60 && data.seatsRate < 60 && (
        <div className="text-report-normal">
          无论是<span className="text-report-large">内场摇滚区</span>还是
          <span className="text-report-large">看台区</span>都很快乐
        </div>
      )}
      {data.outdoorAmount > 0 && (
        <>
          <div className="text-report-normal">除此之外，你在体育场外吹着晚风</div>
          <div className="text-report-normal -mt-2">也听到了 100% 的五月天</div>
        </>
      )}
    </>
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
        <Bar dataKey="attended" stackId="a" fill="var(--chart-color-primary)" isAnimationActive={false} />
        <Bar dataKey="all" stackId="a" fill="var(--chart-color-secondary)" isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}

export default AttendedStat
