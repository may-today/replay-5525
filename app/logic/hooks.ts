import { useSet } from '@uidotdev/usehooks'

export const useSelectedConcertDates = () => {
  return useSet<string>([])
}
