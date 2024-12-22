import { InfiniteSlider } from "./ui/infinite-slider"

const Header = () => {
  return (
    <div className="border-b-2 border-black py-4">
      <InfiniteSlider gap={32}>
        <h1 className="text-9xl font-[Wasted Year]">Replay 5525</h1>
      </InfiniteSlider>
    </div>
  )
}

export default Header
