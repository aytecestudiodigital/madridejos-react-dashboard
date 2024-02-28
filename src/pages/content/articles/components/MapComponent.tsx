import React from "react";
import { useEffect, useRef } from "react";

interface MapProps extends google.maps.MapOptions {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

export default function GoogleMaps({ onClick, children }: MapProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  const DEFAULT_CENTER = { lat: 39.1577, lng: -3.02081 };
  const DEFAULT_ZOOM = 14;

  useEffect(() => {
    // Display the map
    if (ref.current) {
      const map = new window.google.maps.Map(ref.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });
      setMap(map);
    }
  }, [ref]);

  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName),
      );

      if (onClick) {
        map.addListener("click", onClick);
      }
    }
  }, [map, onClick]);

  return (
    <div ref={ref} className="w-11/12 h-96">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map });
        }
      })}
    </div>
  );
}
