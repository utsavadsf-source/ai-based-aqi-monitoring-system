import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MapPin, RefreshCw } from 'lucide-react';
import { CityData } from '../types/aqi';

const GOOGLE_MAPS_API_KEY = 'AIzaSyC9oyAuG6zWlnK_oFNdfgh8aqXyr0LrnpM';

interface LocationMapProps {
  selectedCity: CityData;
  onSelectCity?: (city: CityData) => void;
}

// Dark theme map styles
const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#161e2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#161e2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8899ac' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#00d2ff' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#627d98' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#102a27' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#243b53' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#102a43' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9fb3c8' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#334e68' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2937' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1f2d3d' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0b1320' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#334e68' }],
  },
];

let googleMapsInitialized = false;

export const LocationMap: React.FC<LocationMapProps> = ({ selectedCity }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [activeStationName, setActiveStationName] = useState<string>(`${selectedCity.name} Central Node`);
  const [activeStationAqi, setActiveStationAqi] = useState<number>(selectedCity.aqi);

  // Initialize Google Map using modern functional API
  useEffect(() => {
    if (!mapRef.current) return;

    if (!googleMapsInitialized) {
      setOptions({
        key: GOOGLE_MAPS_API_KEY,
        v: 'weekly',
      });
      googleMapsInitialized = true;
    }

    Promise.all([
      importLibrary('maps'),
      importLibrary('marker')
    ])
      .then(([mapsLib]) => {
        const { Map } = mapsLib as { Map: typeof google.maps.Map };
        const centerCoords = { lat: selectedCity.lat, lng: selectedCity.lng };

        const map = new Map(mapRef.current as HTMLElement, {
          center: centerCoords,
          zoom: 12,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
        });

        googleMapInstance.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();
        setMapLoaded(true);
      })
      .catch((err: unknown) => {
        console.error('Error loading Google Maps:', err);
        setMapError('Google Maps fallback');
      });
  }, []);

  // Update center & markers when selectedCity changes
  useEffect(() => {
    if (!googleMapInstance.current || !window.google || !window.google.maps) return;

    const map = googleMapInstance.current;
    const centerCoords = { lat: selectedCity.lat, lng: selectedCity.lng };
    map.panTo(centerCoords);
    map.setZoom(12);

    // Clear old markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Create primary station marker
    const createPin = (color: string, scale: number) => {
      const pin = document.createElement('div');
      pin.style.width = `${scale * 2}px`;
      pin.style.height = `${scale * 2}px`;
      pin.style.backgroundColor = color;
      pin.style.borderRadius = '50%';
      pin.style.border = '2px solid white';
      pin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      return pin;
    };

    const mainMarker = new google.maps.marker.AdvancedMarkerElement({
      position: centerCoords,
      map: map,
      title: `${selectedCity.name} Primary AQI Node`,
      content: createPin('#00d2ff', 10),
    });

    // Sub-stations in the vicinity
    const subStations = [
      {
        name: `${selectedCity.name} Ring Road Node`,
        lat: selectedCity.lat + 0.02,
        lng: selectedCity.lng - 0.02,
        aqi: selectedCity.aqi - 6,
      },
      {
        name: `${selectedCity.name} GIDC Industrial Corridor`,
        lat: selectedCity.lat - 0.025,
        lng: selectedCity.lng + 0.018,
        aqi: selectedCity.aqi + 14,
      },
      {
        name: `${selectedCity.name} University Zone`,
        lat: selectedCity.lat + 0.015,
        lng: selectedCity.lng + 0.025,
        aqi: selectedCity.aqi - 10,
      },
    ];

    const allNodes = [
      {
        name: `${selectedCity.name} Central Station`,
        lat: selectedCity.lat,
        lng: selectedCity.lng,
        aqi: selectedCity.aqi,
      },
      ...subStations,
    ];

    allNodes.forEach((node, idx) => {
      const marker =
        idx === 0
          ? mainMarker
          : new google.maps.marker.AdvancedMarkerElement({
              position: { lat: node.lat, lng: node.lng },
              map: map,
              title: node.name,
              content: createPin(node.aqi > 100 ? '#f59e0b' : '#10b981', 8),
            });

      marker.addEventListener('gmp-click', () => {
        setActiveStationName(node.name);
        setActiveStationAqi(node.aqi);

        const content = `
          <div style="color: #0f172a; padding: 6px 8px; font-family: sans-serif; min-width: 180px;">
            <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px;">${node.name}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">IoT Monitoring Node (Online)</div>
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px;">
              <span style="font-size: 11px; font-weight: 600;">AQI Level:</span>
              <span style="font-size: 13px; font-weight: 800; color: ${node.aqi > 100 ? '#d97706' : '#0284c7'};">${node.aqi}</span>
            </div>
            <div style="font-size: 10px; color: #475569; margin-top: 4px;">Sensors: DHT22, MQ-135, MQ-2, MQ-7</div>
          </div>
        `;
        infoWindowRef.current?.setContent(content);
        infoWindowRef.current?.open(map, marker);
      });

      markersRef.current.push(marker);
    });
  }, [selectedCity, mapLoaded]);

  const handleRecenter = () => {
    if (googleMapInstance.current) {
      googleMapInstance.current.panTo({ lat: selectedCity.lat, lng: selectedCity.lng });
      googleMapInstance.current.setZoom(12);
    }
  };

  return (
    <section id="map" className="py-16 bg-[#070e1a] border-t border-[#142337] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102035] border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Official Google Maps GIS Integration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Live Monitoring Stations Map ({selectedCity.name})
            </h2>
            <p className="mt-1 text-slate-400 text-sm max-w-2xl">
              Geolocated ambient monitoring stations with real-time DHT22, MQ135, MQ2, and MQ7 sensor streams across Gujarat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRecenter}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#101d30] hover:bg-[#16273f] text-slate-300 hover:text-white border border-[#1b2f4a] text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recenter on {selectedCity.name}</span>
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-[#1b2c45] shadow-2xl bg-[#0e1624]">
          {/* Google Maps Div */}
          <div ref={mapRef} className="w-full h-full" />

          {/* Floating Info Overlay (Top-Left) */}
          <div className="absolute top-4 left-4 z-10 bg-[#0b1424]/95 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 shadow-2xl max-w-xs pointer-events-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                  Active Monitoring Station
                </span>
                <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
                  {activeStationName}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedCity.name}, Gujarat, India
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Station AQI:</span>
                <div className="font-bold text-cyan-400 text-base">{activeStationAqi}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Ambient Temp:</span>
                <div className="font-bold text-white text-base">{selectedCity.temp}°C</div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>GPS: {selectedCity.lat.toFixed(4)}° N, {selectedCity.lng.toFixed(4)}° E</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live
              </span>
            </div>
          </div>

          {/* Loading Indicator */}
          {!mapLoaded && !mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0b1424] z-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-slate-400 font-medium">Loading Google Maps...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
