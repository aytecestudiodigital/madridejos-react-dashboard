/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wrapper } from "@googlemaps/react-wrapper";
import GoogleMaps from "../../../content/articles/components/MapComponent";
import Marker from "../../../content/articles/components/MapMarkerComponent";
import { Label, TextInput } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

interface TabEventLocationProps {
  item: any;
}

export const TabEventLocation = (props: TabEventLocationProps) => {
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [latLng, setLatLng] = useState<any>({ lat: 39.1577, lng: -3.02081 });
  const [address, setAddress] = useState("");
  const [mapCenter, setMapCenter] = useState<any>({
    lat: 39.1577,
    lng: -3.02081,
  });

  const { setValue } = useFormContext();

  const { t } = useTranslation();

  useEffect(() => {
    if (props.item) {
      if (props.item.position) {
        setLatLng({ lat: props.item.position[0], lng: props.item.position[1] });
        getMapAddress({
          lat: props.item.position[0],
          lng: props.item.position[1],
        });
      }
      if (props.item.address) {
        setAddress(props.item.address);
      }
    }
  }, [props.item]);

  useEffect(() => {
    clicks.map((latLng) => {
      const position = latLng.toJSON();
      setLatLng(position);
      getMapAddress(position);
    });
  }, [clicks]);

  useEffect(() => {
    setValue("position", [latLng.lat, latLng.lng]);
  }, [latLng, address]);

  const onClickMap = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    setClicks([e.latLng!]);
  };

  const getMapAddress = async (pos: any) => {
    const geocoder = new google.maps.Geocoder();
    const address: any = await geocoder.geocode({ location: pos });
    setAddress(address.results[0].formatted_address);
    setValue("address", address.results[0].formatted_address);
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
    <div className="p-2">
      <TextInput
        className="pt-2 pb-4"
        placeholder="Buscar dirección..."
        onKeyUp={() => findAddress()}
        id="maps-search-box"
      />
      <div className="flex justify-center">
        <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS}>
          <GoogleMaps onClick={onClickMap} center={mapCenter}>
            <Marker position={{ lat: latLng.lat, lng: latLng.lng }} />
          </GoogleMaps>
        </Wrapper>
      </div>
      <div className="py-4">
        <Label className="font-normal">{t("MAP_DESCRIPTION")}</Label>
        <h1 className="text-lg font-bold mb-1 mt-8">
          {t("SELECTED_POSITION")}
        </h1>
        <p>
          <span className="font-semibold">{t("LATITUDE")}:</span> {latLng.lat}
        </p>
        <p className="mb-4">
          <span className="font-semibold">{t("LONGITUDE")}:</span> {latLng.lng}
        </p>
        <p>
          <span className="font-semibold">{t("ORDER_DIR_LABEL")}:</span>{" "}
          {address}
        </p>
      </div>
    </div>
  );
};
