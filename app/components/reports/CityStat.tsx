import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { InfiniteSlider } from '../ui/infinite-slider'
import { selectedConcertDetailsAtom } from '../../stores/app'
import { concertListMap } from '../../logic/data'

const allCityList = Array.from(new Set(Object.values(concertListMap).map((concert) => concert.city)))

const RequestSongsStat: React.FC = () => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const allListenedCityList = Array.from(new Set(selectedConcertDetails.map((concert) => concert.city)))

  return (
    <div className={clsx(['flex flex-col gap-4 py-4', 'border-2 border-black'])}>
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
        <div className="text-2xl font-bold">你今年一共去过 {allListenedCityList.length} 个城市</div>
      </div>
    </div>
  )
}

export default RequestSongsStat
