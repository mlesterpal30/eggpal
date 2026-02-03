import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { MdMyLocation } from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import type { LocationCoords } from "../../../../hooks/useLocationService";

function createMarkerIcon() {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background:#3182CE;width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
}

export type DeliveryLocationUIProps = {
  location: {
    locationAddress: string;
    setLocationAddress: (value: string) => void;
    locationLoading: boolean;
    locationCoords: LocationCoords | null;
    setLocationCoords: (coords: LocationCoords) => void;
    locationFromGps: boolean;
    setLocationFromGps: (value: boolean) => void;
    mapLoading: boolean;
    handleUseMyLocation: () => void;
    handleViewOnMap: () => void;
  };
  onMarkerDragEnd?: (coords: LocationCoords) => void;
};

const DeliveryLocationUI = ({ location, onMarkerDragEnd }: DeliveryLocationUIProps) => {
  return (
    <FormControl mb={4}>
      <FormLabel>Delivery location</FormLabel>
      <Box
        p={3}
        mb={2}
        bg="blue.50"
        borderRadius="md"
        borderWidth="1px"
        borderColor="blue.100"
      >
        <Text fontSize="sm" color="gray.700">
          Enter your address or use the button to get your current location.
        </Text>
      </Box>
      <VStack align="stretch" spacing={2}>
        <Input
          placeholder="e.g. Street, Barangay, City"
          value={location.locationAddress}
          onChange={(e) => location.setLocationAddress(e.target.value)}
          bg="white"
          size="md"
        />
        <HStack spacing={2} wrap="wrap">
          <Button
            size="sm"
            variant="outline"
            colorScheme="blue"
            leftIcon={<Box as={MdMyLocation} fontSize="lg" />}
            onClick={location.handleUseMyLocation}
            isLoading={location.locationLoading}
            loadingText="Getting location…"
          >
            Use my location
          </Button>
          <Button
            size="sm"
            variant="outline"
            colorScheme="blue"
            onClick={location.handleViewOnMap}
            isLoading={location.mapLoading}
            loadingText="Finding…"
            isDisabled={!location.locationAddress.trim()}
          >
            View on map
          </Button>
        </HStack>
      </VStack>

      {location.locationCoords && (
        <Box mt={3} borderRadius="md" overflow="hidden" borderWidth="1px" borderColor="gray.200">
          <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
            Delivery location on map
          </Text>
          <Box w="full" h="280px" position="relative" bg="gray.100" zIndex={0}>
            <MapContainer
              center={[location.locationCoords.lat, location.locationCoords.lng]}
              zoom={location.locationFromGps ? 17 : 15}
              style={{ height: "100%", width: "100%", borderRadius: "md" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[location.locationCoords.lat, location.locationCoords.lng]}
                draggable
                icon={createMarkerIcon()}
                eventHandlers={{
                  dragend: (e) => {
                    const pos = e.target.getLatLng();
                    const coords = { lat: pos.lat, lng: pos.lng };
                    location.setLocationCoords(coords);
                    location.setLocationFromGps(true);
                    onMarkerDragEnd?.(coords);
                  },
                }}
              >
                <Popup>Delivery here. Drag the pin to your exact house.</Popup>
              </Marker>
            </MapContainer>
          </Box>
          <Box mt={2} p={2} bg="blue.50" borderRadius="md" borderWidth="1px" borderColor="blue.100">
            <Text fontSize="xs" color="gray.700">
              Drag the pin to your exact house location. Zoom in with the + button or scroll for more
              detail.
            </Text>
          </Box>
        </Box>
      )}
    </FormControl>
  );
};

export default DeliveryLocationUI;
