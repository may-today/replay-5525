import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { InfiniteSlider } from '~/components/ui/infinite-slider'
import { AnimatedNumber } from '~/components/ui/animated-number'
import { selectedConcertDetailsAtom, selectedCoordAtom } from '~/stores/app'
import { concertListMap } from '~/lib/data'
import { useFocusValue } from '~/hooks/useFocus'
import type { Concert } from '~/data/types'

const allCityList = Array.from(new Set(Object.values(concertListMap).map((concert) => concert.city)))
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

const getPageData = (selectedConcertDetails: Concert[], selectedCoord: [number, number]) => {
  const allListenedCityList = Array.from(new Set(selectedConcertDetails.map((concert) => concert.city)))
  const listenedCityDistance = allListenedCityList
    .map((city) => {
      return {
        city,
        distance: getDistance(selectedCoord, allCityCoordMap[city]),
      }
    })
    .sort((a, b) => b.distance - a.distance)
  const homeCity = listenedCityDistance.filter((city) => city.distance < 150)
  const allDistance = listenedCityDistance.reduce((acc, city) => acc + city.distance, 0)
  return {
    allListenedCityList,
    listenedCityDistance,
    homeCity,
    allDistance,
  }
}

const CityStat: React.FC<{
  focus: boolean
}> = ({ focus }) => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const selectedCoord = useAtomValue(selectedCoordAtom) || [0, 0]
  const data = getPageData(selectedConcertDetails, selectedCoord)
  const animDistance = useFocusValue(focus, () => data.allDistance)
  const animCityAmount = useFocusValue(focus, () => data.allListenedCityList.length)

  return (
    <div className="py-4">
      <InfiniteSlider className="rotate-6 mt-12 w-[150%] ml-[-25%]" reverse>
        {allCityList.map((city) => {
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
        <div className="text-report-normal">
          今年你跨越了
          <AnimatedNumber className="text-report-large" value={animDistance} />
          公里
        </div>
        <div className="text-report-normal">
          来到 <AnimatedNumber className="text-report-large" value={animCityAmount} /> 个城市
        </div>
        <div className="text-report-normal">
          最远的城市为 <span className="text-report-large">{data.listenedCityDistance[0].city}</span>
        </div>
        {data.homeCity.length > 0 && (
          <div className="text-report-normal">
            今年 <span className="text-report-large">{data.homeCity.map((city) => `${city.city}站`).join('、')}</span>{' '}
            开在了你家门口
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

export default CityStat
