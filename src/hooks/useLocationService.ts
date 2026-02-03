import { useState } from "react";
import { useToast } from "@chakra-ui/react";

export type LocationCoords = { lat: number; lng: number };

export function useLocationService() {
  const toast = useToast();

  const [locationAddress, setLocationAddress] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationCoords, setLocationCoords] = useState<LocationCoords | null>(null);
  const [locationFromGps, setLocationFromGps] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Not supported",
        description: "Location is not supported by your browser.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationCoords({ lat: latitude, lng: longitude });
        setLocationFromGps(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const address = data?.address;
          if (address) {
            const parts = [
              address.road,
              address.suburb || address.village || address.town || address.city,
              address.state,
              address.country,
            ].filter(Boolean);
            setLocationAddress(parts.join(", ") || data?.display_name || "");
          } else {
            setLocationAddress(data?.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          }
          toast({
            title: "Location set",
            description: "Your location was detected.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } catch {
          setLocationAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          toast({
            title: "Address not found",
            description: "Showing coordinates. You can edit the field.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocationLoading(false);
        const message =
          err.code === 1
            ? "Location permission denied. You can type your address instead."
            : err.code === 2
              ? "Location unavailable. Try again or type your address."
              : "Could not get location. Type your address instead.";
        toast({
          title: "Location error",
          description: message,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleViewOnMap = async () => {
    if (locationCoords) return;
    const address = locationAddress?.trim();
    if (!address) {
      toast({
        title: "Enter location first",
        description: "Type your address or use “Use my location”.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setMapLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data?.[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setLocationCoords({ lat, lng });
        setLocationFromGps(false);
        toast({
          title: "Location found",
          description: "Map updated with your address.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Address not found",
          description: "Try a more specific address (e.g. Barangay, Town, Province).",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "Could not load map",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setMapLoading(false);
    }
  };

  return {
    locationAddress,
    setLocationAddress,
    locationLoading,
    locationCoords,
    setLocationCoords,
    locationFromGps,
    setLocationFromGps,
    mapLoading,
    handleUseMyLocation,
    handleViewOnMap,
  };
}
