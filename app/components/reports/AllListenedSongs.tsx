import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { selectedConcertDatesAtom } from '../../stores/app'
import { selectedConcertDetailsAtom } from '../../stores/app'
import { concertListMap } from '../../logic/data'

const allSongs = 170
const allLiveAmount = Array.from(
  new Set(Object.values(concertListMap).reduce((acc, concert) => {
    // TODO: 需要考虑encore和guest的歌曲
    return acc.concat(concert.requestSongList)
  }, [] as string[]))
).length + 32

const AllListenedSongs: React.FC = () => {
  const selectedDates = useAtomValue(selectedConcertDatesAtom)
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)

  const allListenedSpecialSongList = Array.from(
    new Set(selectedConcertDetails.reduce((acc, concert) => {
      // TODO: 需要考虑encore和guest的歌曲
      return acc.concat(concert.requestSongList)
    }, [] as string[]))
  )
  const allListenedSongAmount = allListenedSpecialSongList.length + 32

  return (
    <div className={clsx(['flex flex-col gap-4 p-4', 'border-2 border-black'])}>
      <div className="text-2xl font-bold">你今年一共听过</div>
      <div className="text-2xl font-bold">{allListenedSongAmount} 首现场</div>
      <div className="text-2xl font-bold">
        占比：{((allListenedSongAmount / allSongs) * 100).toFixed(2)}%
      </div>
      <div className="text-2xl font-bold">
        现场数目：{allLiveAmount}
      </div>
    </div>
  )
}

export default AllListenedSongs
