import concertList from '../data/concert_list.json'
import type { Concert } from '../data/types'

const getCityConcertGroupList = () => {
  const cityIndexConcertGroupList = {} as Record<string, Concert[]>
  for (const concert of concertList) {
    // group by city
    if (!cityIndexConcertGroupList[concert.city]) {
      cityIndexConcertGroupList[concert.city] = []
    }
    cityIndexConcertGroupList[concert.city].push(concert)
  }
  return cityIndexConcertGroupList
}

const getConcertListMap = () => {
  const concertListMap = {} as Record<string, Concert>
  for (const concert of concertList) {
    concertListMap[concert.date] = concert
  }
  return concertListMap
}

export const cityConcertGroupList = getCityConcertGroupList()
export const concertListMap = getConcertListMap()
