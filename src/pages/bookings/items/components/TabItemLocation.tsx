/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GoogleMaps from "../../../content/articles/components/MapComponent";
import Marker from "../../../content/articles/components/MapMarkerComponent";
import { ItemModel } from "../models/ItemModel";
import { useFormContext } from "react-hook-form";
import { Label } from "flowbite-react";

interface TabItemLocationProps {
  position: any;
  onPosition: (newPosition: any) => void;
  onAddress: (address: any) => void;
  item: ItemModel | null;
}

export default function TabItemLocation({
  position,
  onPosition: onPosition,
  onAddress: onAddress,
}: TabItemLocationProps) {
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [latLng, setLatLng] = useState<any>({ lat: 39.1577, lng: -3.02081 });
  const [address, setAddress] = useState();

  const { setValue } = useFormContext();

  const { t } = useTranslation();

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
    onPosition(latLng);
    setValue("position", [latLng.lat, latLng.lng]);
    onAddress(address);
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

  return (
    <div>
      <div>
        <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS}>
          <GoogleMaps onClick={onClickMap}>
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
}
