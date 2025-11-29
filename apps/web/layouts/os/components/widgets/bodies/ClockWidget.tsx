import ClockDisplay from '@/layouts/os/components/clock-display';

type Props = {
  showSeconds?: boolean;
};

export function ClockWidget({ showSeconds }: Props) {
  return (
    <div className="p-3">
      <ClockDisplay showSeconds={!!showSeconds} />
    </div>
  );
}

export default ClockWidget;
