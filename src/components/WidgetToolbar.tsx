import { WidgetToolbarProps } from '../typings/types'

export default function WidgetToolbar({
  title,
}: WidgetToolbarProps): JSX.Element {
  return (
    <div className='draggable-handle'>
      <p className='title'>{title}</p>
    </div>
  )
}
