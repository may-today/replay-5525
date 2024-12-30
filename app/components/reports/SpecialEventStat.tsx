import { memo, useMemo } from 'react'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { AnimatedGroup } from '~/components/ui/animated-group'
import { selectedNonOutdoorConcertDetailsAtom } from '~/stores/app'
import { concertListMap } from '~/lib/data'
import type { Concert } from '~/data/types'
import ConcertTitle from '../ConcertTitle'

const specialEventList = [
  [['2023.12.31'], '5525首场巡演陪你跨年'],
  [['2024.01.01'], '2024年的第一场五月天'],
  [['2024.03.29'], '成军日限定《八月爱人》'],
  [['2024.04.30'], '暴雨中的倔强;线上安可'],
  [['2024.05.03', '2024.05.04', '2024.05.05', '2024.05.07', '2024.05.08', '2024.05.09'], '奔赴香港五月之约'],
  [
    [
      '2024.05.18',
      '2024.05.19',
      '2024.05.21',
      '2024.05.22',
      '2024.05.24',
      '2024.05.25',
      '2024.05.26',
      '2024.05.30',
      '2024.05.31',
      '2024.06.01',
    ],
    '鸟巢朝圣',
  ],
  [['2024.05.01'], '拍手版《将军令》'],
  [['2024.05.04'], '开场前的焦虑等待'],
  [['2024.05.08'], '散场后的返场'],
  [['2024.05.18'], '《私奔到月球》'],
  [['2024.05.24'], '疯狂世界+候鸟;回家吧'],
  [['2024.05.25'], 'MDBJ 唯一三安;温柔打电话'],
  [['2024.05.31'], '《听不到》大合唱'],
  [['2024.06.01'], '鸟巢有你 十全十美;第一次上飞机告别;《憨人》'],
  [['2024.07.06'], '吉他信《听不到》'],
  [['2024.07.07'], 'MDSZ 唯一三安;默契的一专点歌;上飞机告别'],
  [['2024.08.03'], '开场前的大合唱;唱了又唱的OAOA'],
  [['2024.08.04'], '暴雨中的《透露》;唯一的三颜色大球;相遇bridge点歌;散场后的11:30五安'],
  [['2024.07.31', '2024.08.02', '2024.08.03', '2024.08.04'], '天空中烟花幸福地爆炸;石拔缺席的 MDTY'],
  [['2024.09.06'], 'Ella合唱《五月天》;命运+顽固'],
  [['2024.09.07'], '停不下来的人浪'],
  [['2024.09.28'], '《后来的我们》神级空拍'],
  [['2024.10.04'], '雨中的候鸟+八月爱人'],
  [['2024.11.19', '2024.11.20', '2024.11.22', '2024.11.23', '2024.11.24'], '八万人左右左右'],
  [['2024.11.10'], '话筒故障后的真心'],
  [['2024.11.15'], '怪兽小女孩同框《笑忘歌》'],
  [['2024.11.24'], '一一不舍 上海再见;小玫瑰talking;上飞机告别;红光《盛夏光年》'],
] satisfies [string[], string][]

export const shouldShowSpecialEventStat = (selectedConcertDetails: Concert[]) => {
  const specialEventDateList = specialEventList.flatMap(([dates]) => dates)
  const selectedEventDateAmount = selectedConcertDetails.filter((concert) =>
    specialEventDateList.includes(concert.date)
  ).length
  return selectedEventDateAmount >= 2
}

const getPageData = (selectedConcertDetails: Concert[]) => {
  const listenedSpecialEventMap: Record<string, string[]> = {}
  const usedEventIndexes: number[] = []
  selectedConcertDetails.forEach((concert) => {
    for (let i = 0; i < specialEventList.length; i++) {
      if (usedEventIndexes.includes(i)) continue
      const [eventDates, eventName] = specialEventList[i]
      if (eventDates.includes(concert.date)) {
        if (!listenedSpecialEventMap[concert.date]) {
          listenedSpecialEventMap[concert.date] = []
        }
        listenedSpecialEventMap[concert.date].push(...eventName.split(';'))
        usedEventIndexes.push(i)
      }
    }
  })

  return {
    listenedSpecialEventMap,
  }
}

const SpecialEventStat: React.FC<{ focus: boolean }> = ({ focus }) => {
  const selectedNonOutdoorConcertDetails = useAtomValue(selectedNonOutdoorConcertDetailsAtom)
  const data = useMemo(() => getPageData(selectedNonOutdoorConcertDetails), [selectedNonOutdoorConcertDetails])
  console.log('SpecialEventStat', data)

  return (
    <div className="p-4 pb-8">
      <div className="text-report-normal mb-8">你参加过的每一场<br />一定都很特别：</div>
      <AnimatedGroup
        preset="blur-slide"
        variants={{
          container: {
            // hidden: { opacity: 0 },
            visible: {
              // opacity: 1,
              transition: {
                staggerChildren: 0.3,
              },
            },
          },
          item: {
            hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: {
                duration: 1.2,
                type: 'spring',
                bounce: 0.3,
              },
            },
          },
        }}
      >
        {Object.entries(data.listenedSpecialEventMap).map(([date, events], index) => (
          <div key={date}>
            <div className={clsx(['text-report-normal font-medium', index % 2 === 0 ? 'text-right' : 'text-left'])}>
              <div>
                {date.replace(/^2024\./, '')}
                <ConcertTitle className="ml-2" concert={concertListMap[date]} />
              </div>
              <div>
                {events.map((event) => (
                  <div key={event} className="text-report-large text-2xl">
                    「{event}」
                  </div>
                ))}
              </div>
            </div>
            {index < Object.entries(data.listenedSpecialEventMap).length - 1 && (
              <div className="w-full h-10 mt-2 flex items-center justify-center">
                <div
                  className={clsx([
                    'inline-block w-[1px] h-12 bg-black/30 transform text-center',
                    index % 2 === 0 ? 'rotate-[50deg]' : '-rotate-[50deg]',
                  ])}
                />
              </div>
            )}
          </div>
        ))}
        <div className="mt-8 text-center opacity-30 text-sm">还有更多故事，等你续写</div>
      </AnimatedGroup>
    </div>
  )
}

export default memo(SpecialEventStat)
