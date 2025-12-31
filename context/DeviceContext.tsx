"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  isMobile as rddIsMobile,
  isTablet as rddIsTablet,
  isIOS as rddIsIOS,
  isAndroid as rddIsAndroid,
  browserName as rddBrowserName,
  osName as rddOsName,
  mobileVendor as rddMobileVendor,
  mobileModel as rddMobileModel,
} from "react-device-detect";

interface DeviceContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  browserName: string;
  osName: string;
  mobileVendor: string;
  mobileModel: string;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const deviceInfo: DeviceContextType = isMounted
    ? {
        isMobile: rddIsMobile,
        isTablet: rddIsTablet,
        isDesktop: !rddIsMobile && !rddIsTablet,
        isIOS: rddIsIOS,
        isAndroid: rddIsAndroid,
        browserName: rddBrowserName,
        osName: rddOsName,
        mobileVendor: rddMobileVendor,
        mobileModel: rddMobileModel,
      }
    : {
        isMobile: false,
        isTablet: false,
        isDesktop: true, // Default to desktop
        isIOS: false,
        isAndroid: false,
        browserName: "Unknown",
        osName: "Unknown",
        mobileVendor: "Unknown",
        mobileModel: "Unknown",
      };

  return (
    <DeviceContext.Provider value={deviceInfo}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
};
