/// <reference types="@types/google.maps" />

import React, { useState, useEffect, type ComponentProps } from "react";
import { AutoComplete } from "antd";
import { AutoCompleteProps } from "antd/es/auto-complete";
import { Input } from "./Input";

// Type definitions for suggestion items
interface SuggestionItem {
  value: string;
  placeId: string;
  lat?: number;
  lng?: number;
}

// Extend the Window interface to include google
declare global {
  interface Window {
    google: typeof google;
  }
}

type Props = ComponentProps<typeof Input> & {
  onPlaceSelect?: (value: string, lat: number, lng: number) => void;
};

export const PlaceAutocompleteInput: React.FC<Props> = ({
  onPlaceSelect,
  defaultValue,
  ...props
}) => {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [service, setService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue.toString());
    }
  }, [defaultValue]);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDLhpVxRDQJ9kL4C850UmCXx85x6Dgvenw&libraries=places`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        setService(new window.google.maps.places.AutocompleteService());
        setPlacesService(
          new window.google.maps.places.PlacesService(
            document.createElement("div")
          )
        );
      };
    } else {
      setService(new window.google.maps.places.AutocompleteService());
      setPlacesService(
        new window.google.maps.places.PlacesService(
          document.createElement("div")
        )
      );
    }
  }, []);

  const fetchSuggestions = (value: string) => {
    if (service && value) {
      const request: google.maps.places.AutocompletionRequest = {
        input: value,
        // types: ["(cities)"], // Customize types if needed
      };

      service.getPlacePredictions(request, (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(
            predictions.map((prediction) => ({
              value: prediction.description,
              placeId: prediction.place_id,
            }))
          );
        } else {
          setSuggestions([]);
        }
      });
    } else {
      setSuggestions([]);
    }
  };

  const fetchPlaceDetails = (placeId: string) => {
    if (placesService) {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId,
      };

      placesService.getDetails(request, (place, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place
        ) {
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          if (lat !== undefined && lng !== undefined) {
            // Find the corresponding suggestion and update it with lat/lng
            const updatedSuggestions = suggestions.map((suggestion) =>
              suggestion.placeId === placeId
                ? { ...suggestion, lat, lng }
                : suggestion
            );
            setSuggestions(updatedSuggestions);

            // Call the parent onSelect with the selected value and coordinates
            const selectedSuggestion = updatedSuggestions.find(
              (suggestion) => suggestion.placeId === placeId
            );
            if (selectedSuggestion && onPlaceSelect) {
              onPlaceSelect(selectedSuggestion.value, lat, lng);
            }
          }
        }
      });
    }
  };

  const handleSelect: AutoCompleteProps["onSelect"] = (
    value: string,
    option: any
  ) => {
    setInputValue(value); // Set the selected value to the input

    // Fetch place details to get the coordinates
    const selectedSuggestion = suggestions.find(
      (suggestion) => suggestion.value === value
    );
    if (selectedSuggestion) {
      fetchPlaceDetails(selectedSuggestion.placeId);
    }
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
    fetchSuggestions(value);
  };

  return (
    <AutoComplete
      value={inputValue}
      options={suggestions.map((suggestion) => ({
        value: suggestion.value,
        label: suggestion.value,
      }))}
      onSelect={handleSelect}
      onSearch={handleSearch}
      style={{ width: "100%" }}
    >
      <Input {...props} />
    </AutoComplete>
  );
};
