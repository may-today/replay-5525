import { memo, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { Rain } from 'react-rainfall'
import { selectedConcertDateTypeMapAtom, selectedConcertDetailsAtom } from '~/stores/app'
import type { Concert, ConcertSelectType } from '~/data/types'
import { useFocusValueMap } from '~/hooks/useFocus'
import { AnimatedNumber } from '~/components/ui/animated-number'
import ConcertTitle from '../ConcertTitle'

const stormRainDateList = ['2024.04.30', '2024.05.04', '2024.08.04', '2024.10.04']
const normalRainDateList = ['2024.05.24', '2024.09.11', '2024.11.16']

export const shouldShowRainStat = (
  selectedConcertDetails: Concert[],
  selectedConcertDateTypeMap: Record<string, ConcertSelectType>
) => {
  return selectedConcertDetails.some((concert) => isRainConcert(concert, selectedConcertDateTypeMap, 'all'))
}

const isRainConcert = (
  concert: Concert,
  selectedConcertDateTypeMap: Record<string, ConcertSelectType>,
  rainType: 'storm' | 'normal' | 'all'
) => {
  const rainDateList =
    rainType === 'all'
      ? [...stormRainDateList, ...normalRainDateList]
      : rainType === 'storm'
        ? stormRainDateList
        : rainType === 'normal'
          ? normalRainDateList
          : []
  return (
    rainDateList.includes(concert.date) &&
    (concert.city === '香港' || selectedConcertDateTypeMap[concert.date] !== 'seats')
  )
}

const getPageData = (
  selectedConcertDetails: Concert[],
  selectedConcertDateTypeMap: Record<string, ConcertSelectType>
) => {
  const listenedRainAmount = selectedConcertDetails.filter((concert) =>
    isRainConcert(concert, selectedConcertDateTypeMap, 'all')
  ).length
  const listenedStormRainList = selectedConcertDetails.filter((concert) =>
    isRainConcert(concert, selectedConcertDateTypeMap, 'storm')
  )

  return {
    listenedRainAmount,
    listenedStormRainList,
  }
}

const RainStat: React.FC<{ focus: boolean }> = ({ focus }) => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const data = useMemo(
    () => getPageData(selectedConcertDetails, selectedConcertDateTypeMap),
    [selectedConcertDetails, selectedConcertDateTypeMap]
  )
  console.log('RainStat', data)

  const animValue = useFocusValueMap(focus, () => ({
    listenedRainAmount: data.listenedRainAmount,
    listenedStormRainAmount: data.listenedStormRainList.length,
  }))

  return (
    <div className="relative h-full p-4">
      <div className="absolute inset-0">
        <Rain numDrops={120} dropletColor="rgb(60, 60, 60)" dropletOpacity={0.8} />
      </div>
      <div className="text-report-normal text-right">「当夏日的雨开始怒吼」</div>
      <div className="text-report-normal">今年，你陪五月天淋了</div>
      <div className="text-report-normal">
        <AnimatedNumber className="text-report-large" value={animValue.listenedRainAmount} />
        <span>场雨</span>
        {data.listenedStormRainList.length > 0 && (
          <>
            <span>，其中</span>
            <AnimatedNumber className="text-report-large" value={animValue.listenedStormRainAmount} />
            <span>场暴雨在</span>
            <div className="mt-2 text-right">
              {data.listenedStormRainList.map((concert) => (
                <div key={concert.date}>
                  <ConcertTitle className="text-report-large" concert={concert} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {data.listenedStormRainList.length === stormRainDateList.length && (
        <div className="text-report-normal">
          <span>获得成就</span>
          <span className="text-report-large">暴雨全勤</span>
        </div>
      )}
      <div className="text-report-normal">又浪漫又疯狂</div>
    </div>
  )
}

export default memo(RainStat)
