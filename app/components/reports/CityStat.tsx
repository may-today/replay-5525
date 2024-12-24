import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { InfiniteSlider } from '../ui/infinite-slider'
import { selectedConcertDetailsAtom, selectedCoordAtom } from '~/stores/app'
import { concertListMap } from '~/logic/data'

const allCityList = Array.from(new Set(Object.values(concertListMap).map((concert) => concert.city)))
const allCityCoordMap = {
  '台中': [120.68, 24.15],
  '高雄': [120.31, 22.62],
  '香港': [114.17, 22.32],
  '北京': [116.36, 39.92],
  '深圳': [114.07, 22.62],
  '太原': [112.53, 37.87],
  '武漢': [114.27, 30.58],
  '成都': [104.06, 30.67],
  '上海': [121.48, 31.22],
} as Record<string, [number, number]>

const RequestSongsStat: React.FC = () => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const selectedCoord = useAtomValue(selectedCoordAtom)
  const allListenedCityList = Array.from(new Set(selectedConcertDetails.map((concert) => concert.city)))

  if (!selectedCoord) {
    return null
  }

  const listenedCityDistance = allListenedCityList.map((city) => {
    return {
      city,
      distance: getDistance(selectedCoord, allCityCoordMap[city]),
    }
  }).sort((a, b) => b.distance - a.distance)
  const nearestCity = listenedCityDistance.filter((city) => city.distance < 150)

  return (
    <div className={clsx(['flex flex-col gap-4 py-4'])}>
      <InfiniteSlider>
        {allCityList.map((city) => {
          return (
            <div
              key={city}
              className={clsx([
                'relative px-3 py-1 rounded-full',
                'border-2 border-black',
                allListenedCityList.includes(city) ? 'bg-black text-white' : '',
              ])}
            >
              {city}
            </div>
          )
        })}
      </InfiniteSlider>
      <div className="px-4">
        <div className="text-xl font-bold">你今年一共去过 <span className="text-3xl">{allListenedCityList.length}</span> 个城市</div>
        <div className="text-xl font-bold">跨越过 <span className="text-3xl">{listenedCityDistance.reduce((acc, city) => acc + city.distance, 0).toFixed(2)}</span> 公里</div>
        <div className="text-xl font-bold">最远的城市为 <span className="text-3xl">{listenedCityDistance[0].city}</span></div>
        {nearestCity.length > 0 && (
          <div className="text-xl font-bold">今年 <span className="text-3xl">{nearestCity.map((city) => `${city.city}站`).join('、')}</span> 开在了你家门口</div>
        )}
        {listenedCityDistance.map((city) => {
          return <div key={city.city} className="text-lg">GetDistance({city.city}): {city.distance}</div>
        })}
      </div>
    </div>
  )
}

const getDistance = ([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]) => {
  const radLat1 = lat1 * Math.PI / 180.0
  const radLat2 = lat2 * Math.PI / 180.0
  const a = radLat1 - radLat2
  const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
  let s = 2 * Math.asin(Math.sqrt(Math.sin(a / 2) ** 2 +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(b / 2) ** 2))
  s = s * 6378.137
  s = Math.round(s * 10000) / 10000
  return s
}

export default RequestSongsStat
