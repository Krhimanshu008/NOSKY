'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { Loader2 } from 'lucide-react';

// Component to handle programmatic map flying
function MapFlyTo({ target, zoom }) {
  const map = useMap();
  const prevTarget = useRef(null);
  
  useEffect(() => {
    const targetKey = target ? target.join(',') : null;
    if (target && prevTarget.current !== targetKey) {
      prevTarget.current = targetKey;
      map.flyTo(target, zoom, {
        duration: 1.5 // 1.5 seconds animation for snappier feel
      });
    }
  }, [target, zoom, map]);
  return null;
}

const INITIAL_VIEW_STATE = {
  center: [20.5937, 78.9629], // India
  zoom: 3
};

// Create a custom SVG map pin icon
const createPinIcon = (color) => {
  return L.divIcon({
    className: 'custom-pin-icon',
    html: `<div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.25)); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)';" onmouseout="this.style.transform='scale(1)';">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32px" height="32px" stroke="white" stroke-width="1.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
  });
};

const customPinIcon = createPinIcon('#3b82f6'); // Blue pin

// Custom cluster icon function with tier-based color coding
const createClusterCustomIcon = function (cluster) {
  const count = cluster.getChildCount();
  let color = '#4f46e5'; // Indigo for small (<25)
  if (count >= 100) {
    color = '#ef4444'; // Red for large (100+)
  } else if (count >= 25) {
    color = '#f97316'; // Orange for medium (25-99)
  }

  const formattedCount = count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;

  return L.divIcon({
    html: `<div style="background-color: ${color}; color: white; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
             ${formattedCount}
           </div>`,
    className: 'custom-cluster-icon',
    iconSize: L.point(40, 40, true),
  });
};

export default function UnifiedMapViewer({ selectedCountry, onCountrySelect }) {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/globe')
      .then(res => res.json())
      .then(data => {
        setVisitors(data);
        setLoading(false);
      });
  }, []);

  const countryVisitor = selectedCountry && visitors.length > 0
    ? visitors.find(v => v.country === selectedCountry)
    : null;
  const flyTarget = countryVisitor ? [countryVisitor.latitude, countryVisitor.longitude] : null;

  // Memoize marker creation so we don't rebuild thousands of components on parent re-renders
  const markerElements = useMemo(() => {
    return visitors.map((visitor, index) => {
      const position = [visitor.latitude, visitor.longitude];
      
      return (
        <Marker 
          key={`visitor-${index}`}
          position={position}
          icon={customPinIcon}
          eventHandlers={{
            click: () => {
              if (onCountrySelect) {
                onCountrySelect(visitor.country);
              }
            },
          }}
        >
          <Tooltip sticky direction="top" offset={[0, -20]}>
            <div style={{ minWidth: '120px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#111' }}>
                {visitor.city}, {visitor.country}
              </div>
              <div style={{ color: '#444' }}>{visitor.visits || 1} visits</div>
            </div>
          </Tooltip>
        </Marker>
      );
    });
  }, [visitors, onCountrySelect]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  // Use standard OpenStreetMap tiles for a natural, Google Maps-like look
  const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer 
        center={INITIAL_VIEW_STATE.center} 
        zoom={INITIAL_VIEW_STATE.zoom} 
        style={{ width: '100%', height: '100%', background: '#f8f9fa' }}
        zoomControl={false}
        worldCopyJump={true}
        maxBounds={[[-90, -180], [90, 180]]}
        minZoom={2}
      >
        <TileLayer
          attribution={TILE_ATTRIBUTION}
          url={TILE_URL}
        />
        
        <MapFlyTo target={flyTarget} zoom={5} />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          showCoverageOnHover={false}
          removeOutsideVisibleBounds={true}
          iconCreateFunction={createClusterCustomIcon}
        >
          {markerElements}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
