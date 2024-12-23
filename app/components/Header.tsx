import { useNavigate } from 'react-router'
import { InfiniteSlider } from './ui/infinite-slider'

const Header: React.FC<{ secondary?: boolean }> = ({ secondary }) => {
  const navigate = useNavigate()

  return (
    <>
      <div className="border-b-2 cursor-pointer" onClick={() => navigate('/')} onKeyDown={() => navigate('/')}>
        <InfiniteSlider gap={secondary ? 0 : 32} duration={40} durationOnHover={8}>
          {secondary ? <h1 className="text-4xl">Replay 5525·年度报告·Replay 5525·年度报告·</h1> : <h1 className="text-8xl">Replay 5525</h1>}
        </InfiniteSlider>
      </div>
      {!secondary && (
        <div className="border-b-2">
          <InfiniteSlider gap={4} reverse duration={160}>
            <p>这是全天下最完美的阵容·我和你你和我 /</p>
            <p>你问我全世界是哪里最美·答案是你身边 /</p>
            <p>这一生志愿只要平凡快乐·谁说这样不伟大呢 /</p>
            <p>今天珍重·谁知道是真是梦 /</p>
            <p>会不会有一天·时间真的能倒退 /</p>
          </InfiniteSlider>
        </div>
      )}
    </>
  )
}

export default Header
