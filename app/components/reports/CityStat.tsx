import { memo, useMemo } from 'react'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { InfiniteSlider } from '~/components/ui/infinite-slider'
import { AnimatedNumber } from '~/components/ui/animated-number'
import { selectedConcertDetailsAtom, selectedCoordAtom } from '~/stores/app'
import { concertListMap } from '~/lib/data'
import { useFocusValueMap } from '~/hooks/useFocus'
import type { Concert } from '~/data/types'

const allCityAmountMap = Object.values(concertListMap).reduce(
  (acc, concert) => {
    acc[concert.city] = (acc[concert.city] || 0) + 1
    return acc
  },
  {} as Record<string, number>
)
const allCityCoordMap = {
  台中: [120.68, 24.15],
  高雄: [120.31, 22.62],
  香港: [114.17, 22.32],
  北京: [116.36, 39.92],
  深圳: [114.07, 22.62],
  太原: [112.53, 37.87],
  武漢: [114.27, 30.58],
  成都: [104.06, 30.67],
  上海: [121.48, 31.22],
} as Record<string, [number, number]>

const getPageData = (selectedConcertDetails: Concert[], selectedCoord: [number, number] | null) => {
  const allListenedAmountMap = selectedConcertDetails.reduce(
    (acc, concert) => {
      acc[concert.city] = (acc[concert.city] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  const allListenedCityList = Object.keys(allListenedAmountMap)
  const fullAttendedCityList = Object.entries(allListenedAmountMap)
    .filter(([city, amount]) => amount === allCityAmountMap[city])
    .map(([city]) => city)
  const listenedCityDistance = allListenedCityList
    .map((city) => {
      return {
        city,
        distance: selectedCoord ? getDistance(selectedCoord, allCityCoordMap[city]) : 0,
      }
    })
    .sort((a, b) => b.distance - a.distance)
  const homeCity = listenedCityDistance.filter((city) => city.distance < 150)
  const allDistance = listenedCityDistance.reduce((acc, city) => acc + city.distance, 0) * 2
  return {
    allListenedCityList,
    fullAttendedCityList,
    listenedCityDistance,
    homeCity,
    allDistance,
  }
}

const CityStat: React.FC<{
  focus: boolean
}> = ({ focus }) => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const selectedCoord = useAtomValue(selectedCoordAtom)
  const data = useMemo(
    () => getPageData(selectedConcertDetails, selectedCoord),
    [selectedConcertDetails, selectedCoord]
  )
  console.log('CityStat', data)

  const animValue = useFocusValueMap(focus, () => ({
    distance: data.allDistance,
    top1Distance: data.listenedCityDistance[0].distance,
    cityAmount: data.allListenedCityList.length,
  }))

  return (
    <div className="relative h-full py-4 w-full overflow-hidden">
      <InfiniteSlider className="rotate-6 mt-12 w-[150%] ml-[-25%]" reverse>
        {Object.keys(allCityAmountMap).map((city) => {
          return (
            <div
              key={city}
              className={clsx([
                'relative px-6 py-3 rounded-full text-6xl',
                'border-2 border-black',
                data.allListenedCityList.includes(city) ? 'bg-black text-white' : '',
              ])}
            >
              {city}
            </div>
          )
        })}
      </InfiniteSlider>
      <div className="absolute bottom-0 left-0 right-0 px-4 py-4">
        {data.allDistance > 100 ? (
          <>
            <div className="text-report-normal">
              <span>今年你累计奔波</span>
              <AnimatedNumber className="text-report-large" value={animValue.distance} />
              <span>公里</span>
            </div>
            <div className="text-report-normal">
              <span>去了</span>
              <AnimatedNumber className="text-report-large" value={animValue.cityAmount} />
              <span>个城市</span>
            </div>
          </>
        ) : (
          <div className="text-report-normal">
            <span>今年你一共去了</span>
            <AnimatedNumber className="text-report-large" value={animValue.cityAmount} />
            <span>个城市</span>
          </div>
        )}
        {selectedCoord && data.listenedCityDistance.length > 1 && (
          <div className="text-report-normal">
            <span>最远去过</span>
            <AnimatedNumber className="text-report-large" value={animValue.top1Distance} />
            <span>公里外的</span>
            <span className="text-report-large">{data.listenedCityDistance[0].city}</span>
          </div>
        )}
        {selectedCoord && data.homeCity.length > 0 && (
          <div className="text-report-normal">
            <span>去了开在了家门口的</span>
            <span className="text-report-large">{data.homeCity.map((city) => `${city.city}站`).join('、')}</span>
          </div>
        )}
        {data.fullAttendedCityList.length > 0 && (
          <div className="text-report-normal">
            <span>在</span>
            <span className="text-report-large">{data.fullAttendedCityList.join('、')}</span>
            <span>全勤</span>
          </div>
        )}
      </div>
    </div>
  )
}

const getDistance = ([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]) => {
  const radLat1 = (lat1 * Math.PI) / 180.0
  const radLat2 = (lat2 * Math.PI) / 180.0
  const a = radLat1 - radLat2
  const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
  let s = 2 * Math.asin(Math.sqrt(Math.sin(a / 2) ** 2 + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(b / 2) ** 2))
  s = s * 6378.137
  s = Math.round(s * 10000) / 10000
  return s
}

export default memo(CityStat)
