import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Crosshair } from '../Crosshair/Crosshair';
import { DimensionLine } from '../DimensionLine/DimensionLine';
import './MeasureFrame.scss';

export interface MeasureFrameProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'title'
> {
  /** The dimension annotation rendered under the box. */
  label?: ReactNode;
  children?: ReactNode;
}

/**
 * The signature title-box motif: a dashed frame with registration crosshairs and
 * a dimension line, all sized to the content. Wrap a headline to give it the
 * "measured to the pixel" treatment from the demo. The frame, marks, and
 * dimension line are decorative; only the children are read by assistive tech.
 */
export function MeasureFrame({
  label,
  className,
  children,
  ...rest
}: MeasureFrameProps) {
  const classes = ['measure-frame', className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      <div className="measure-frame__box">
        <Crosshair className="measure-frame__mark measure-frame__mark--tl" />
        <Crosshair className="measure-frame__mark measure-frame__mark--br" />
        {children}
      </div>
      {label != null && (
        <DimensionLine className="measure-frame__dim" label={label} />
      )}
    </div>
  );
}
