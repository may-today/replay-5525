import { memo, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { Area, ComposedChart } from 'recharts'
import { Eye, EyeClosed } from 'lucide-react'
import { useToggle } from '@uidotdev/usehooks'
import { AnimatedNumber } from '~/components/ui/animated-number'
import { ChartContainer, type ChartConfig } from '~/components/ui/chart'
import { selectedConcertDateTypeMapAtom } from '~/stores/app'
import { concertListMap } from '~/lib/data'
import { useFocusValueMap } from '~/hooks/useFocus'
import type { ConcertSelectType } from '~/data/types'

const getPageData = (selectedConcertDateTypeMap: Record<string, ConcertSelectType>) => {
  const selectedDates = Object.keys(selectedConcertDateTypeMap)
  const selectedTypes = Object.values(selectedConcertDateTypeMap)
  const estimateCost = Object.values(selectedConcertDateTypeMap).reduce((acc, type) => {
    if (!type || type === 'outdoor') {
      return acc + 0
    }
    if (type === 'unknown') {
      return acc + 1036
    }
    if (type === 'ground') {
      return acc + 1450
    }
    if (type === 'seats') {
      return acc + 622
    }
    return acc
  }, 0)
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
    estimateCost,
  }
}

const AttendedStat: React.FC<{ focus: boolean }> = ({ focus }) => {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const data = useMemo(() => getPageData(selectedConcertDateTypeMap), [selectedConcertDateTypeMap])
  console.log('AttendedStat', data)
  const chartData = getChartData(data.selectedDates)

  const animValue = useFocusValueMap(focus, () => ({
    amount: data.selectedDates.length,
    hours: data.selectedDates.length * 3,
    rate: data.rate,
    lastConcertAmount: data.lastConcertAmount,
    outdoorAmount: data.outdoorAmount,
    groundAmount: data.groundAmount,
    seatsAmount: data.seatsAmount,
    estimateCost: data.estimateCost,
  }))

  return (
    <div className="relative h-full">
      <div className="flex-1 p-4">
        <div className="text-report-normal">
          <span>2024年，你一共看了</span>
          <AnimatedNumber className="text-report-large" value={animValue.amount} />
          <span>场</span>
          {data.lastConcertAmount > 0 && (
            <>
              <span>，解锁了</span>
              <AnimatedNumber className="text-report-large" value={animValue.lastConcertAmount} />
              <span>次尾场</span>
            </>
          )}
          <span>，陪五月天唱过</span>
          <AnimatedNumber className="text-report-large" value={animValue.hours} />
          <span>小时</span>
        </div>
        <div className="text-report-normal">
          <span>出勤率</span>
          <AnimatedNumber className="text-report-large" value={animValue.rate} />%
          {animValue.rate === 100 && (
            <>
              <span className="ml-2">获得</span>
              <span className="text-report-large">全勤成就</span>
            </>
          )}
        </div>
        <EstimateCostText data={data} animValue={animValue} />
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
          <span>你似乎更喜欢</span>
          <span className="text-report-large">内场摇滚区</span>
        </div>
      )}
      {data.seatsRate >= 60 && (
        <div className="text-report-normal">
          <span>你似乎更喜欢</span>
          <span className="text-report-large">看台区</span>
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

const EstimateCostText: React.FC<{
  data: ReturnType<typeof getPageData>
  animValue: ReturnType<typeof useFocusValueMap>
}> = ({ data, animValue }) => {
  const [show, toggleShow] = useToggle(true)
  return (
    <div className="text-report-normal">
      <span>花费约</span>
      {show ? (
        <AnimatedNumber className="text-report-large" value={animValue.estimateCost} />
      ) : (
        <span className="text-report-large">{data.estimateCost.toString().replace(/\d/g, '*')}</span>
      )}
      <span>元</span>
      {show ? (
        <Eye onClick={() => toggleShow(false)} className="inline-block ml-2 cursor-pointer" />
      ) : (
        <EyeClosed onClick={() => toggleShow(true)} className="inline-block ml-2 cursor-pointer" />
      )}
    </div>
  )
}

type ChartData = {
  month: string
  all: number
  attended: number
}[]

const getChartData = (selectedDates: string[]) => {
  const allConcertMonths = Object.keys(concertListMap).map((date) => date.split('.')[1])
  const selectedDatesMonths = selectedDates.filter((date) => date !== '2023.12.31').map((date) => date.split('.')[1])
  return [...Array(12).keys()].map((index) => {
    const thisMonth = (index + 1).toString().padStart(2, '0')
    return {
      month: thisMonth,
      all: allConcertMonths.filter((month) => month === thisMonth).length,
      attended: selectedDatesMonths.filter((month) => month === thisMonth).length,
    } as ChartData[number]
  })
}

const chartConfig = {
  all: {
    label: 'all',
  },
  attended: {
    label: 'attended',
  },
} satisfies ChartConfig

const Chart: React.FC<{ chartData: ChartData }> = ({ chartData }) => {
  return (
    <ChartContainer config={chartConfig} className="absolute bottom-0 left-0 w-full h-[40vh]">
      <ComposedChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        barCategoryGap={0}
        barGap={0}
      >
        {/* <Bar dataKey="all" stackId="a" fill="var(--chart-color-secondary)" isAnimationActive={false} /> */}
        <Area type="step" dataKey="all" fill="var(--chart-color-secondary)" stroke="none" />
        <Area type="step" dataKey="attended" fill="var(--chart-color-primary)" stroke="none" />
      </ComposedChart>
    </ChartContainer>
  )
}

export default memo(AttendedStat)
