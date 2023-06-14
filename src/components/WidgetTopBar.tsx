import { WidgetTopBarProps } from '../types'

export default function WidgetTopBar({
  title,
  removible,
  onWidgetRemove,
}: WidgetTopBarProps): JSX.Element {
  return (
    <div className='draggable-handle'>
      <p className='title'>{title}</p>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {removible && (
          <button className='widget-remove--button' onClick={onWidgetRemove}>
            <svg height='20' viewBox='0 -960 960 960' width='20'>
              <path d='M291-253.847 253.847-291l189-189-189-189L291-706.153l189 189 189-189L706.153-669l-189 189 189 189L669-253.847l-189-189-189 189Z' />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
