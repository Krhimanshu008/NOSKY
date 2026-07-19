'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Loader2 } from 'lucide-react';

const SATELLITE_STYLE = {
  version: 8,
  sources: {
    'raster-tiles': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: 'Esri'
    }
  },
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

const SERVER_LOCATION = { lat: 28.5355, lng: 77.3910, name: 'Noida Server' };

const INITIAL_VIEW_STATE = {
  longitude: 78.9629, // India
  latitude: 20.5937,  // India
  zoom: 1.5,
  pitch: 20,
  bearing: 0
};

export default function UnifiedMapViewer({ selectedCountry, onCountrySelect }) {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const mapRef = useRef(null);

  useEffect(() => {
    fetch('/api/analytics/globe')
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          setVisitors(data);
          setLoading(false);
        }, 0);
      });
  }, []);

  // Handle flyTo when a country is selected from the sidebar
  useEffect(() => {
    if (selectedCountry && visitors.length > 0) {
      // Find the first visitor from this country to use as a proxy for coordinates
      const countryVisitor = visitors.find(v => v.country === selectedCountry);
      if (countryVisitor) {
        setTimeout(() => {
          setViewState(prev => ({
            ...prev,
            longitude: countryVisitor.longitude,
            latitude: countryVisitor.latitude,
            zoom: 4,
            pitch: 45,
            transitionDuration: 2000 // Smooth 2s fly-to animation
          }));
        }, 0);
      }
    }
  }, [selectedCountry, visitors]);

  const layers = [
    // GPU Heatmap for low-zoom clustering (Looks like a command center heat signature)
    new HeatmapLayer({
      id: 'heatmap-layer',
      data: visitors,
      getPosition: d => [d.longitude, d.latitude],
      getWeight: d => d.visits || 1,
      radiusPixels: 40,
      intensity: 1,
      threshold: 0.05,
      colorRange: [
        [15, 23, 42],
        [14, 165, 233], // Cyan
        [16, 185, 129], // Green
        [245, 158, 11]  // Orange
      ],
      // Fade out the heatmap as we zoom in
      opacity: viewState.zoom < 5 ? 1 : Math.max(0, 1 - (viewState.zoom - 5) * 0.5)
    }),

    // Scatterplot for individual nodes at higher zooms
    new ScatterplotLayer({
      id: 'scatter-layer',
      data: visitors,
      getPosition: d => [d.longitude, d.latitude],
      getFillColor: [245, 158, 11, 200], // Orange
      getRadius: 15,
      radiusUnits: 'pixels',
      radiusMinPixels: 3,
      radiusMaxPixels: 20,
      pickable: true,
      onClick: ({ object }) => {
        if (object && onCountrySelect) {
          onCountrySelect(object.country);
        }
      },
      // Fade in the scatterplot as we zoom in
      opacity: viewState.zoom > 3 ? Math.min(1, (viewState.zoom - 3) * 0.5) : 0
    }),

    // Arc layer representing data packets to the server
    new ArcLayer({
      id: 'arc-layer',
      data: visitors,
      getSourcePosition: d => [d.longitude, d.latitude],
      getTargetPosition: () => [SERVER_LOCATION.lng, SERVER_LOCATION.lat],
      getSourceColor: [245, 158, 11, 255], // Orange
      getTargetColor: [16, 185, 129, 255], // Green
      getWidth: 2,
      greatCircle: true, // Curves the arc along the globe surface
    })
  ];

  const onMapLoad = useCallback((evt) => {
    const map = evt.target;
    // MapLibre v4+ experimental globe projection support
    if (map.setProjection) {
      try {
        map.setProjection({ type: 'globe' });
      } catch (e) {
        console.warn("Globe projection not supported in this version of MapLibre GL JS", e);
      }
    }
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <DeckGL
        layers={layers}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        getTooltip={({ object }) => object && `${object.city}, ${object.country}\n${object.visits || 1} visits`}
      >
        <Map
          ref={mapRef}
          mapStyle={SATELLITE_STYLE}
          onLoad={onMapLoad}
          reuseMaps
        />
      </DeckGL>
    </div>
  );
}
