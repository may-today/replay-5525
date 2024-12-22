import requestRaw from './request_raw'
import encoreRaw from './encore_raw'
import { SongType, type Concert } from './types'

const genConcertList = (data: string) => {
  const lines = data.split('\n').reverse()
  const concertList = lines.filter(Boolean).map((line) => {
    const [date, , cityIndexRaw, , , ...songs] = line.split(',')
    const [city, cityIndex] = cityIndexRaw.split('D')
    return {
      date,
      city,
      cityIndex: Number(cityIndex),
      guest: '',
      requestSongList: songs.filter(Boolean),
      guestSongList: [],
      encoreSongList: [],
      endingSong: '',
    } as Concert
  })
  return concertList
}

const parseSongList = (data: string) => {
  const lines = data.split('\n')
  const concertSongListMap = {} as Record<string, string[]>
  for (const line of lines) {
    const [date, , , , , ...songs] = line.split(',')
    concertSongListMap[date] = songs.filter(Boolean)
  }
  return concertSongListMap
}

const concertList = genConcertList(requestRaw)
const requestConcertList = parseSongList(requestRaw)
// biome-ignore lint/complexity/noForEach: <explanation>
Object.entries(requestConcertList).forEach(([date, songs]) => {
  const concert = concertList.find((c) => c.date === date)
  if (concert) {
    concert.requestSongList = songs
  }
})
const encoreConcertList = parseSongList(encoreRaw)
// biome-ignore lint/complexity/noForEach: <explanation>
Object.entries(encoreConcertList).forEach(([date, songs]) => {
  const concert = concertList.find((c) => c.date === date)
  if (concert) {
    concert.encoreSongList = songs
    concert.endingSong = songs[songs.length - 1]
  }
})
// console.log(requestConcertList)
console.log(concertList)

await Bun.write('concert_list.json', JSON.stringify(concertList, null, 2))

