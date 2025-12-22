import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  ListItemButton,
  CircularProgress,
} from "@mui/material";
import { LocationData } from "@/features/thread/types";

// Libraries must be defined outside component to avoid reloading
const libraries: ("places")[] = ["places"];

interface LocationPickerProps {
  value?: LocationData;
  onChange: (location: LocationData | undefined) => void;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "8px",
  };

  const center = useMemo(
    () => (value ? { lat: value.lat, lng: value.lng } : { lat: 37.7749, lng: -122.4194 }), // Default to SF
    [value]
  );

  // Pan to new center when value changes
  useEffect(() => {
    if (map && value) {
      map.panTo({ lat: value.lat, lng: value.lng });
      map.setZoom(15); // Auto-zoom on selection
    }
  }, [map, value]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) return <Typography color="error">Error loading maps</Typography>;
  if (!isLoaded) return <CircularProgress />;

  return (
    <Box sx={{ width: "100%" }}>
      <PlacesAutocomplete 
        onSelect={async (address) => {
          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            onChange({
              address,
              lat,
              lng,
              placeId: results[0].place_id,
              name: address.split(",")[0], // Simple name extraction
            });
          } catch (error) {
            console.error("Error searching place:", error);
          }
        }} 
      />
      
      <Box sx={{ mt: 2, position: "relative" }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={center}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={(e) => {
             if (e.latLng) {
               const lat = e.latLng.lat();
               const lng = e.latLng.lng();
               // Optional: Allow click to set location (requires reverse geocoding for full support)
               // For now, we just update the marker position visually if we had local state, 
               // but since state is lifted, we'd need to emit onChange.
               // Without reverse geocoding, we can't emit a full "LocationData" with address easily.
             }
          }}
        >
          {value && <Marker position={{ lat: value.lat, lng: value.lng }} />}
        </GoogleMap>
      </Box>
    </Box>
  );
}

function PlacesAutocomplete({ onSelect }: { onSelect: (address: string) => void }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here if needed */
    },
    debounce: 300,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect = (description: string) => () => {
    setValue(description, false);
    clearSuggestions();
    onSelect(description);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        fullWidth
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Search for a place..."
        variant="outlined"
        size="small"
      />
      {status === "OK" && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            mt: 0.5,
            maxHeight: "200px",
            overflowY: "auto",
          }}
          elevation={3}
        >
          <List dense>
            {data.map(({ place_id, description }) => (
              <ListItemButton key={place_id} onClick={handleSelect(description)}>
                <ListItemText primary={description} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
