import * as SolidIcons from '@heroicons/react/24/solid';
import * as OutlineIcons from '@heroicons/react/24/outline';

export type IconName = keyof typeof SolidIcons | keyof typeof OutlineIcons;

/**
 * How to use this component:
 * <DynamicHeroIcon icon="CameraIcon" outline={false} />
 * Find icons here: https://heroicons.com/
 * Naming convention is camelCase with "Icon" at the end (i.e. ArrowDownLeftIcon)
 * Icons are solid by default, pass in outline={true} to use the outline version
 */
interface Props {
  icon: IconName;
  className?: string;
  outline?: boolean;
  onClick?: () => void;
}

export function DynamicHeroIcon(props: Props): JSX.Element {
  const { icon, className = 'w-5 h-5', outline = false, onClick } = props;

  const Icon = outline ? OutlineIcons[icon] : SolidIcons[icon];

  return <Icon className={className} onClick={onClick} />;
}
