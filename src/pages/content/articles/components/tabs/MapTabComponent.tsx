/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wrapper } from "@googlemaps/react-wrapper";
import { Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GoogleMaps from "../MapComponent";
import Marker from "../MapMarkerComponent";
import { useFormContext } from "react-hook-form";

interface MapTabProps {
  position: any;
}

export default function MapTab({ position }: MapTabProps) {
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [latLng, setLatLng] = useState<any>({ lat: 39.471655 , lng: -3.533282  });
  const [address, setAddress] = useState("");
  const [mapCenter, setMapCenter] = useState<any>({ lat: 39.471655 , lng: -3.533282  });

  const { t } = useTranslation();

  const { setValue } = useFormContext();

  useEffect(() => {
    clicks.map((latLng) => {
      const position = latLng.toJSON();
      setLatLng(position);
      getMapAddress(position);
    });
  }, [clicks]);

  useEffect(() => {
    getMapAddress(position);
    setLatLng(position);
  }, [position]);

  useEffect(() => {
    setValue("position", latLng);
    setValue("address", address);
  }, [latLng]);

  const onClickMap = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    setClicks([e.latLng!]);
  };

  const getMapAddress = async (pos: any) => {
    const geocoder = new google.maps.Geocoder();
    const address: any = await geocoder.geocode({ location: pos });
    setAddress(address.results[0].formatted_address);
  };

  const findAddress = () => {
    //if(this.searchValue.length >= 3 ){
    const input = document.getElementById(
      "maps-search-box",
    ) as HTMLInputElement;

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setComponentRestrictions({
      country: ["es"],
    });
    autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      const display = place!.geometry!.location!.toJSON();
      setLatLng(display);
      setAddress(input.value);
      setMapCenter(display);
    });
    //}
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-12 divide-x">
        <div className="col-span-7 p-2">
          <TextInput
            className="pt-2 pb-4"
            placeholder="Buscar dirección..."
            onKeyUp={() => findAddress()}
            id="maps-search-box"
          />
          <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS}>
            <GoogleMaps onClick={onClickMap} center={mapCenter}>
              <Marker position={{ lat: latLng.lat, lng: latLng.lng }} />
            </GoogleMaps>
          </Wrapper>
        </div>
        <div className="col-span-5 p-4">
          <Label className="font-normal">{t("MAP_DESCRIPTION")}</Label>
          <h1 className="text-lg font-bold mb-1 mt-8">
            {t("SELECTED_POSITION")}
          </h1>
          <p>
            <span className="font-semibold">{t("LATITUDE")}:</span> {latLng.lat}
          </p>
          <p className="mb-4">
            <span className="font-semibold">{t("LONGITUDE")}:</span>{" "}
            {latLng.lng}
          </p>
          <p>
            <span className="font-semibold">{t("ORDER_DIR_LABEL")}:</span>{" "}
            {address}
          </p>
        </div>
      </div>
    </div>
  );
}
