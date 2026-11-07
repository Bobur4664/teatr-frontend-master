import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { t } = useTranslation();
  
  const calculateTimeLeft = () => {
    if (!targetDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const target = new Date(targetDate);
    if (isNaN(target.getTime())) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const difference = +target - +new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2 md:gap-4 items-center">
      <TimerBlock value={timeLeft.days} label={t('timer.days', 'Kun')} />
      <span className="text-white/50 text-2xl font-bold pb-4">:</span>
      <TimerBlock value={timeLeft.hours} label={t('timer.hours', 'Soat')} />
      <span className="text-white/50 text-2xl font-bold pb-4">:</span>
      <TimerBlock value={timeLeft.minutes} label={t('timer.minutes', 'Daqiqa')} />
      <span className="text-white/50 text-2xl font-bold pb-4">:</span>
      <TimerBlock value={timeLeft.seconds} label={t('timer.seconds', 'Soniya')} />
    </div>
  );
}

function TimerBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm border border-white/30 w-14 h-14 md:w-20 md:h-20 shrink-0 transition-colors">
      <span className="text-xl md:text-3xl font-bold text-white leading-none">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wider text-white/80 mt-1 md:mt-2">
        {label}
      </span>
    </div>
  );
}
