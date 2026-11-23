import useReducedMotion from '../hooks/useReducedMotion'

const STEP = 14
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

// `order` = indeks item dari depan ke belakang. Hanya kartu depan yang
// interaktif; kartu di belakang dipilih lewat tombol yang menutupinya.
export default function CardStack({ items, order, onSelect }) {
  const reduced = useReducedMotion()

  return (
    <ul
      className="m-0 grid list-none p-0 pb-8"
      style={{ transformStyle: 'flat' }}
    >
      {items.map((item, i) => {
        const p = order.indexOf(i)
        const front = p === 0
        return (
          <li
            key={item.key}
            className="relative col-start-1 row-start-1"
            style={{
              zIndex: items.length - p,
              transformOrigin: 'bottom center',
              transform: `translateY(${p * STEP}px) scale(${1 - p * 0.06})`,
              opacity: 1 - p * 0.3,
              transition: reduced
                ? 'opacity 150ms linear'
                : `transform 500ms ${EASE}, opacity 300ms ${EASE}`,
            }}
          >
            <div inert={!front} aria-hidden={!front} className="h-full">
              {item.content}
            </div>
            {!front && (
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Tampilkan ${item.label}`}
                className="absolute inset-0 cursor-pointer rounded-xl"
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}
