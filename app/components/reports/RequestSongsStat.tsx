import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { selectedConcertDetailsAtom } from '../../stores/app'
import { concertListMap } from '../../logic/data'
import crown from '~/assets/crown.svg'

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

const RequestSongsStat: React.FC = () => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)

  const allListenedRequestSongListRaw = selectedConcertDetails.reduce((acc, concert) => {
    return acc.concat(concert.requestSongList)
  }, [] as string[])
  const allListenedRequestSongList = Array.from(new Set(allListenedRequestSongListRaw))
  const allListenedRequestSongAmountMap = Object.fromEntries(
    Object.entries(
      allListenedRequestSongListRaw.reduce(
        (acc, song) => {
          acc[song] = (acc[song] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).sort(([, a], [, b]) => b - a)
  )

  return (
    <div className={clsx(['flex flex-col gap-4 p-4'])}>
      <div>
        <div className="text-xl font-bold">你今年一共听过 <span className="text-3xl">{allListenedRequestSongList.length}</span> 首点歌</div>
        <div className="text-xl font-bold">占今年点歌数 <span className="text-2xl">{((allListenedRequestSongList.length / allRequestSongList.length) * 100).toFixed(2)}%</span></div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.keys(allRequestSongAmountMap).map((song) => {
          return (
            <span
              key={song}
              className={clsx([
                'relative px-3 py-1 rounded-full',
                'border-2 border-black',
                allListenedRequestSongList.includes(song) ? 'bg-black text-white' : '',
              ])}
            >
              {song}
              {/* ({allListenedRequestSongAmountMap[song] || 0}/{allRequestSongAmountMap[song] || 0}) */}
              {Object.keys(allListenedRequestSongAmountMap)?.[0] === song && (
                <img src={crown} alt="crown" className="absolute -top-6 -right-4 w-10 h-10 rotate-12" />
              )}
              {allListenedRequestSongList.includes(song) &&
                allListenedRequestSongAmountMap[song] === allRequestSongAmountMap[song] && (
                  <span className="absolute -top-3 -right-3 rotate-12 px-1 bg-white text-black rounded-full text-sm">
                    全勤
                  </span>
                )}
            </span>
          )
        })}
      </div>
      <div className="text-2xl font-bold">你今年一共听过 {allListenedRequestSongList.length} 首点歌</div>
      <div className="text-2xl font-bold">总点歌数：{allRequestSongList.length}</div>
      <div className="text-2xl font-bold">
        占比：{((allListenedRequestSongList.length / allRequestSongList.length) * 100).toFixed(2)}%
      </div>
      <div className="text-2xl font-bold">
        {Object.entries(allListenedRequestSongAmountMap)
          .slice(0, 5)
          .map(([song, amount]) => {
            return (
              <div key={song}>
                {song}: {amount}
              </div>
            )
          })}
      </div>
      {/* <div className="text-2xl font-bold">
        {Object.entries(allListenedRequestSongAmountMap).filter(([, amount]) => amount === 1).map(([song]) => {
          return <div key={song}>{song}</div>
        })}
      </div> */}
    </div>
  )
}

export default RequestSongsStat
