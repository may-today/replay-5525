import { memo } from 'react'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { AnimatedNumber } from '~/components/ui/animated-number'
import { AnimatedGroup } from '~/components/ui/animated-group'
import { selectedConcertDetailsAtom } from '~/stores/app'
import { ballColorMap } from '~/data/ballColor'
import type { Concert } from '~/data/types'
import { useFocusValue } from '~/hooks/useFocus'
import ConcertTitle from '../ConcertTitle'

const getPageData = (selectedConcertDetails: Concert[]) => {
  const listenedEncoreSongListRaw = selectedConcertDetails.reduce((acc, concert) => {
    return acc.concat(concert.encoreSongList)
  }, [] as string[])
  const listenedEncoreSongList = Array.from(new Set(listenedEncoreSongListRaw))
  const listenedBallColorListRaw = selectedConcertDetails
    .reduce((acc, concert) => {
      return acc.concat(concert.ballColorList)
    }, [] as string[])
    .filter(Boolean)
  const listenedBallColorAmountMap = Object.fromEntries(
    Object.entries(
      listenedBallColorListRaw.reduce(
        (acc, color) => {
          acc[color] = (acc[color] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).sort(([, a], [, b]) => b - a)
  )
  const listenedEndingSongListRaw = selectedConcertDetails.reduce((acc, concert) => {
    return acc.concat(concert.endingSong)
  }, [] as string[])
  const listenedEndingSongAmountMap = Object.fromEntries(
    Object.entries(
      listenedEndingSongListRaw.reduce(
        (acc, song) => {
          acc[song] = (acc[song] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).sort(([, a], [, b]) => b - a)
  )
  const top1EndingSongConcertList = selectedConcertDetails.filter(
    (concert) => concert.endingSong === Object.keys(listenedEndingSongAmountMap)[0]
  )

  return {
    listenedEncoreSongList,
    listenedBallColorAmountMap,
    listenedEndingSongAmountMap,
    top1EndingSongConcertList,
  }
}

const EncoreSongStat: React.FC<{ focus: boolean }> = ({ focus }) => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const data = getPageData(selectedConcertDetails)
  const animListenedEncoreSongListLength = useFocusValue(focus, () => data.listenedEncoreSongList.length)
  const animListenedBallColorAmountMapLength = useFocusValue(
    focus,
    () => Object.keys(data.listenedBallColorAmountMap).length
  )

  return (
    <div className="p-4">
      <div className="text-report-normal">
        你今年一共听过
        <AnimatedNumber className="text-report-large" value={animListenedEncoreSongListLength} />
        首安可随机曲目
      </div>
      <div className="text-report-normal">
        解锁安可大球颜色
        <AnimatedNumber className="text-report-large" value={animListenedBallColorAmountMapLength} />/
        {Object.keys(ballColorMap).length}
      </div>
      {focus && <ListenedBallGroup listenedBallColorAmountMap={data.listenedBallColorAmountMap} />}
      {Object.values(data.listenedEndingSongAmountMap)[0] > 1 && (
        <>
          <div className="text-report-normal">
            最常听到的结尾曲是
            <span className="text-report-large">《{Object.keys(data.listenedEndingSongAmountMap)[0]}》</span>
          </div>
          <div className="text-report-normal">
            <div className="text-report-large">
              {data.top1EndingSongConcertList.map((concert, index) => (
                <div key={concert.date}>
                  <ConcertTitle concert={concert} />
                </div>
              ))}
            </div>
            <div className="text-report-normal">都听过它</div>
          </div>
        </>
      )}
      {Object.values(data.listenedEndingSongAmountMap)[0] === 1 && selectedConcertDetails.length > 1 && (
        <>
          <div className="text-report-normal">
            每场结尾曲对你来说都是独一无二的：
          </div>
          {focus && (
            <AnimatedGroup preset="fade">
              {selectedConcertDetails.map((concert) => (
                <div key={concert.date} className="text-report-large mb-2">
                  《{concert.endingSong}》
                </div>
              ))}
            </AnimatedGroup>
          )}
          <div className="text-report-normal">
            都只听过一次
          </div>
        </>
      )}
    </div>
  )
}

const ListenedBallGroup: React.FC<{ listenedBallColorAmountMap: Record<string, number> }> = memo(
  ({ listenedBallColorAmountMap }) => {
    return (
      <AnimatedGroup className="flex flex-wrap gap-4 my-8" preset="scale">
        {Object.entries(listenedBallColorAmountMap).map(([colorName, amount]) => {
          return (
            <div
              key={colorName}
              className={clsx(['relative w-12 h-12 rounded-md border-2'])}
              style={{
                backgroundColor: (ballColorMap as Record<string, string>)[colorName],
              }}
            >
              <div className={clsx(['absolute -top-3 -right-3 px-3 py-1 bg-black text-white rounded-full'])}>
                {amount}
              </div>
            </div>
          )
        })}
      </AnimatedGroup>
    )
  }
)

export default EncoreSongStat
