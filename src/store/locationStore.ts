import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocationCoords } from "../hooks/useLocationService";

interface LocationStore {
  locationAddress: string;
  locationCoords: LocationCoords | null;
  locationFromGps: boolean;
  setLocation: (address: string, coords: LocationCoords, fromGps: boolean) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      locationAddress: "",
      locationCoords: null,
      locationFromGps: false,
      setLocation: (address, coords, fromGps) =>
        set({
          locationAddress: address,
          locationCoords: coords,
          locationFromGps: fromGps,
        }),
      clearLocation: () =>
        set({
          locationAddress: "",
          locationCoords: null,
          locationFromGps: false,
        }),
    }),
    {
      name: "eggpal-location-storage",
    }
  )
);
