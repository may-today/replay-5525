import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { selectedConcertDetailsAtom } from '~/stores/app'
import { ballColorMap } from '~/data/ballColor'

const EncoreSongStat: React.FC = () => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)

  const allListenedEncoreSongListRaw = selectedConcertDetails.reduce((acc, concert) => {
    return acc.concat(concert.encoreSongList)
  }, [] as string[])
  const allListenedEncoreSongList = Array.from(new Set(allListenedEncoreSongListRaw))
  const allListenedBallColorListRaw = selectedConcertDetails.reduce((acc, concert) => {
    return acc.concat(concert.ballColorList)
  }, [] as string[])
  const allListenedBallColorAmountMap = Object.fromEntries(
    Object.entries(
      allListenedBallColorListRaw.reduce(
        (acc, color) => {
          acc[color] = (acc[color] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).sort(([, a], [, b]) => b - a)
  )
  const allListenedEndingSongListRaw = selectedConcertDetails.reduce((acc, concert) => {
    return acc.concat(concert.endingSong)
  }, [] as string[])
  const allListenedEndingSongAmountMap = Object.fromEntries(
    Object.entries(
      allListenedEndingSongListRaw.reduce(
        (acc, song) => {
          acc[song] = (acc[song] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).sort(([, a], [, b]) => b - a)
  )

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="text-report-normal">
          你今年一共听过<span className="text-report-large">{allListenedEncoreSongList.length + 4}</span>首三安/四安
        </div>
        <div className="mt-4">
          <div className="text-report-normal">
            解锁大球颜色
            <span className="text-report-large">
              {Object.keys(allListenedBallColorAmountMap).length}/{Object.keys(ballColorMap).length}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {Object.entries(allListenedBallColorAmountMap).map(([colorName, amount]) => {
              return (
                <div
                  key={colorName}
                  className={clsx(['relative w-12 h-12 rounded-md border-2'])}
                  style={{
                    backgroundColor: (ballColorMap as Record<string, string>)[colorName],
                  }}
                >
                  {allListenedBallColorAmountMap[colorName] && (
                    <div className={clsx(['absolute -top-3 -right-3 px-3 py-1 bg-black text-white rounded-full'])}>
                      {allListenedBallColorAmountMap[colorName] || 0}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="text-report-normal">
          最常听到的Ending是
          <span className="text-report-large">《{Object.keys(allListenedEndingSongAmountMap)[0]}》</span>
        </div>
        {/* <div className="text-report-normal">{JSON.stringify(allListenedEndingSongAmountMap)}</div> */}
      </div>
    </div>
  )
}

export default EncoreSongStat
