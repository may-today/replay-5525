export interface Concert {
  date: string
  city: string
  cityIndex: number
  last?: boolean
  guest: string
  requestSongList: string[]
  guestSongList: string[]
  endingSong: string
  encoreSongList: string[]
  ballColorList: string[]
}

export enum SongType {
  /** 日常歌单 */
  // NORMAL = 1,
  /** 点歌 */
  REQUEST = 1,
  /** 嘉宾歌单 */
  GUEST = 2,
  /** Ending */
  ENDING = 3,
  /** 安可 */
  ENCORE = 4,
}

export type ConcertSelectType = null | 'unknown' | 'outdoor' | 'ground' | 'seats'
