import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { AnimatedNumber } from '~/components/ui/animated-number'
import { AnimatedGroup } from '~/components/ui/animated-group'
import { selectedConcertDetailsAtom } from '~/stores/app'
import { concertListMap } from '~/lib/data'
import crown from '~/assets/crown.svg'
import type { Concert } from '~/data/types'
import { useFocusValue } from '~/hooks/useFocus'
import ConcertTitle from '~/components/ConcertTitle'

const allRequestSongListRaw = Object.values(concertListMap).reduce((acc, concert) => {
  return acc.concat(concert.requestSongList)
}, [] as string[])
const allRequestSongList = Array.from(new Set(allRequestSongListRaw))
const allRequestSongAmountMap = Object.fromEntries(
  Object.entries(
    allRequestSongListRaw.reduce(
      (acc, song) => {
        acc[song] = (acc[song] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
  ).sort(([, a], [, b]) => b - a)
)

const getPageData = (selectedConcertDetails: Concert[]) => {
  const listenedRequestSongListRaw = selectedConcertDetails.reduce((acc, concert) => {
    return acc.concat(concert.requestSongList)
  }, [] as string[])
  const listenedRequestSongList = Array.from(new Set(listenedRequestSongListRaw))
  const listenedRequestSongAmountMap = Object.fromEntries(
    Object.entries(
      listenedRequestSongListRaw.reduce(
        (acc, song) => {
          acc[song] = (acc[song] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).sort(([, a], [, b]) => b - a)
  )
  const maxRequestCount = Object.values(listenedRequestSongAmountMap)[0]
  const topRequestSongs = Object.entries(listenedRequestSongAmountMap)
    .filter(([, count]) => count === maxRequestCount)
    .map(([song]) => song)
  const top1RequestSong = topRequestSongs[0]
  const top1RequestSongConcertList = selectedConcertDetails.filter(
    (concert) => concert.requestSongList.includes(top1RequestSong) || concert.encoreSongList.includes(top1RequestSong)
  )

  return {
    listenedRequestSongList,
    listenedRequestSongAmountMap,
    listenedRequestSongRate: ~~((listenedRequestSongList.length / allRequestSongList.length) * 100),
    topRequestSongs,
    top1RequestSong,
    top1RequestSongConcertList,
  }
}

const RequestSongsStat: React.FC<{ focus: boolean }> = ({ focus }) => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const data = getPageData(selectedConcertDetails)

  const animListenedRequestSongAmount = useFocusValue(focus, () => data.listenedRequestSongList.length)
  const animListenedRequestSongRate = useFocusValue(focus, () => data.listenedRequestSongRate)
  const animTop1RequestSongDateListLength = useFocusValue(focus, () => data.top1RequestSongConcertList.length)

  return (
    <div className="p-4">
      <div>
        <div className="text-report-normal">
          今年一共听过
          <AnimatedNumber className="text-report-large" value={animListenedRequestSongAmount} />
          首点歌
        </div>
        <div className="text-report-normal">
          覆盖今年点歌
          <AnimatedNumber className="text-report-large" value={animListenedRequestSongRate} />
          <span className="text-report-large">%</span>
        </div>
        {data.top1RequestSongConcertList.length > 1 && (
        <div className="text-report-normal">
          <div>
            <ConcertTitle className="text-report-large" concert={data.top1RequestSongConcertList[0]} />
            是你今年你第一次听到
            <span className="text-report-large">《{data.top1RequestSong}》</span>
          </div>
          <div>
            今年在随机曲目中听到
            <AnimatedNumber className="text-report-large" value={animTop1RequestSongDateListLength} />
            次，是专属于你的点歌 top1
          </div>
          </div>
        )}
      </div>
      {focus && (
        <AnimatedGroup className="flex flex-wrap gap-2 my-8" preset="scale">
          {Object.keys(allRequestSongAmountMap).map((song) => {
            return (
              <div
                key={song}
                className={clsx([
                  'relative px-3 py-1 rounded-full',
                  'border-2 border-black',
                  data.listenedRequestSongList.includes(song) ? 'bg-black text-white' : '',
                ])}
              >
                {song}
                {/* ({allListenedRequestSongAmountMap[song] || 0}/{allRequestSongAmountMap[song] || 0}) */}
                {data.topRequestSongs.includes(song) && (
                  <img src={crown} alt="crown" className="absolute -top-6 -right-4 w-10 h-10 rotate-12" />
                )}
                {!data.topRequestSongs.includes(song) &&
                  data.listenedRequestSongList.includes(song) &&
                  data.listenedRequestSongAmountMap[song] === allRequestSongAmountMap[song] && (
                    <span className="absolute -top-3 -right-3 rotate-12 px-1 bg-white text-black rounded-full text-sm">
                      全勤
                    </span>
                  )}
              </div>
            )
          })}
        </AnimatedGroup>
      )}
    </div>
  )
}

export default RequestSongsStat
