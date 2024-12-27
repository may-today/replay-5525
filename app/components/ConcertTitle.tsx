import type { Concert } from '~/data/types'

const ConcertTitle: React.FC<{ concert: Concert; className?: string }> = ({ concert, className }) => {
  return (
    <span className={className}>
      {concert.city}D{concert.cityIndex}
    </span>
  )
}

export default ConcertTitle
