import { useEffect, useState } from 'react';

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

export function useDeviceDetection() {
  const [isLowSpecDevice, setIsLowSpecDevice] = useState(false);

  useEffect(() => {
    const nav = navigator as NavigatorWithMemory;
    const isLowSpec =
      (nav.deviceMemory && nav.deviceMemory < 4) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    setIsLowSpecDevice(!!isLowSpec);
  }, []);

  return isLowSpecDevice;
}
