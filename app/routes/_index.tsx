import type { MetaArgs } from 'react-router'
import Header from '../components/Header'
import UsernameInput from '../components/UsernameInput'
import ConcertSelect from '../components/ConcertSelect'

export function meta(_: MetaArgs) {
  return [{ title: 'Replay 5525' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <UsernameInput />
      <ConcertSelect />
    </div>
  )
}
