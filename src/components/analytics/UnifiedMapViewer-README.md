# UnifiedMapViewer

## Overview
The `UnifiedMapViewer` is a React component built on top of `react-leaflet` designed to visualize global user/visitor traffic on an interactive map.

## What We Are Trying to Achieve
The primary goal of this component is to provide a clean, performant, and intuitive geographic visualization of analytical data. When plotting hundreds or thousands of visitor locations on a map, traditional plotting (rendering individual markers for every user) leads to severe performance degradation and visual clutter. 

We achieve our goal by implementing:
1. **Visual Clarity:** A light-themed OpenStreetMap base that makes data points pop.
2. **Performance & Readability:** Grouping dense geographic data into interactive clusters so the user isn't overwhelmed by overlapping pins.
3. **Smooth Interactivity:** Programmatic animations that pan and zoom the map to a specific country when selected.

## Core Algorithms & Techniques Used

### 1. Marker Clustering (Supercluster Algorithm)
Instead of plotting every single visitor on the map simultaneously, we use the `react-leaflet-cluster` wrapper, which under the hood uses the **Supercluster** algorithm (a very fast geospatial point clustering library).

**How it works:**
- **Hierarchical Grid:** It divides the map into a grid based on the current zoom level.
- **Proximity Grouping:** As markers fall into the same grid cell, they are grouped into a single "Cluster Node".
- **Dynamic Re-calculation:** When the user zooms in, the grid becomes finer, and the clusters break apart into smaller clusters or individual pins. When zooming out, they merge back together.
- **Chunked Loading:** We pass `chunkedLoading` to the cluster group so that the browser doesn't freeze when calculating and rendering clusters for massive datasets.

### 2. Custom SVG Mapping (No External Assets)
Typically, Leaflet relies on external PNG images for map markers, which can break easily in modern React bundlers (like Vite/Next.js) due to missing paths. 
- We bypassed this by utilizing `L.divIcon` to inject a raw inline `<svg>` string directly into the DOM.
- **Benefit:** This ensures that the pins scale perfectly without pixelation, load instantly without network requests, and can be easily re-colored dynamically using JavaScript.

### 3. Programmatic Fly-To Animation
We created a specialized headless sub-component (`MapFlyTo`) that utilizes Leaflet's `useMap()` hook. 
- When the parent state detects a `selectedCountry`, it finds the corresponding centroid coordinates.
- It then executes a `.flyTo()` method, which uses a parabolic curve algorithm to pan and zoom the camera smoothly from its current position to the target destination over a 2-second duration.

## Setup & Dependencies
- `react-leaflet` & `leaflet` (Core map engine)
- `react-leaflet-cluster` (Clustering wrapper)
- `supercluster` (Underlying clustering engine)
