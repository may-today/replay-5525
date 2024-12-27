import { useAtomValue } from 'jotai'
import { selectedConcertDetailsAtom } from '~/stores/app'
import type { Concert } from '~/data/types'
import { useFocusValueMap } from '~/hooks/useFocus'
import { AnimatedNumber } from '~/components/ui/animated-number'
import { InfiniteSlider } from '~/components/ui/infinite-slider'

import Album1 from '~/assets/album/1.webp'
import Album2 from '~/assets/album/2.webp'
import Album3 from '~/assets/album/3.webp'
import Album4 from '~/assets/album/4.webp'
import Album5 from '~/assets/album/5.webp'
import Album6 from '~/assets/album/6.webp'
import Album7 from '~/assets/album/7.webp'
import Album8 from '~/assets/album/8.webp'
import Album8_2 from '~/assets/album/8-2.webp'
import Album9 from '~/assets/album/9.webp'

const albumImgList = [Album1, Album2, Album3, Album4, Album5, Album6, Album7, Album8, Album8_2, Album9]

const getPageData = (selectedConcertDetails: Concert[]) => {
  const listenedAmount = selectedConcertDetails.reduce((acc, concert) => {
    // 固定歌单（固定+一安）+ 点歌 + 嘉宾点歌 + 安可
    return acc + 36 + concert.requestSongList.length + concert.guestSongList.length + concert.encoreSongList.length
  }, 0)
  return {
    listenedAmount,
    albumAmount: 9,
  }
}

const AllListenedSongsStat: React.FC<{ focus: boolean }> = ({ focus }) => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const data = getPageData(selectedConcertDetails)
  console.log('AllListenedSongsStat', data)

  const animValue = useFocusValueMap(focus, () => ({
    listenedAmount: data.listenedAmount,
    albumAmount: data.albumAmount,
  }))

  return (
    <div className="relative h-full p-4">
      <div className="text-report-normal">你今年一共听过</div>
      <div className="text-report-normal">
        <AnimatedNumber className="text-report-large" value={animValue.listenedAmount} />
        <span>首现场</span>
      </div>
      <div className="text-report-normal">
        <span>覆盖了五月天全部</span>
        <AnimatedNumber className="text-report-large" value={animValue.albumAmount} />
        <span>张专辑</span>
      </div>
      <div className="absolute bottom-4 left-0 right-0 opacity-85">
        <InfiniteSlider reverse className="mb-4">
          {albumImgList.slice(0, 5).map((img) => {
            return (
              <img key={img} src={img} alt="album" className="w-32" />
            )
          })}
        </InfiniteSlider>
        <InfiniteSlider>
          {albumImgList.slice(5).map((img) => {
            return (
              <img key={img} src={img} alt="album" className="w-32" />
            )
          })}
        </InfiniteSlider>
      </div>
    </div>
  )
}

export default AllListenedSongsStat
