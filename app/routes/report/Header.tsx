import { useNavigate } from 'react-router'
import { useAtomValue } from 'jotai'
import { usernameAtom } from '~/stores/app'
import { InfiniteSlider } from '~/components/ui/infinite-slider'

const Header: React.FC<{ secondary?: boolean }> = () => {
  const navigate = useNavigate()
  const username = useAtomValue(usernameAtom)

  return (
    <>
      <div className="border-b-2 cursor-pointer" onClick={() => navigate('/')} onKeyDown={() => navigate('/')}>
        <InfiniteSlider gap={0} duration={40} durationOnHover={8}>
          {username ? (
            <h1 className="text-4xl">{username}·5525·年度报告·</h1>
          ) : (
            <h1 className="text-4xl">Replay 5525·年度报告·Replay 5525·年度报告·</h1>
          )}
        </InfiniteSlider>
      </div>
    </>
  )
}

export default Header
