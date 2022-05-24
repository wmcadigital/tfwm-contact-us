import React, { useState, useEffect, useLayoutEffect } from 'react';

import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';

import Basemap from '@arcgis/core/Basemap';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';

import Graphic from '@arcgis/core/Graphic';

import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
/* eslint-disable react/prop-types */

// import watchUtils from '@arcgis/core/core/watchUtils';

const GetMap = ({ lat, lang }) => {
  useEffect(() => {
    const graphicsLayer = new GraphicsLayer();

    const basemap = new Basemap({
      baseLayers: [
        new VectorTileLayer({
          id: 'wmca-basemap',
          portalItem: {
            // set the basemap to the one being used: https://tfwm.maps.arcgis.com/home/item.html?id=53f165a8863c4d40ba017042e248355e
            id: '53f165a8863c4d40ba017042e248355e',
          },
        }),
      ],
    });
    const map = new Map({
      basemap,
      layers: [graphicsLayer],
    });
    const view = new MapView({
      map,
      container: 'answerMapDiv',
      center: [+lat, +lang],
      zoom: 12,
    });
    view.ui.remove(['zoom']);

    const point = {
      type: 'point',
      longitude: +lat,
      latitude: +lang,
    };
    const simpleMarkerSymbol = {
      type: 'simple-marker',
      style: 'circle',
      size: 10,
      color: '#3c1053',
      outline: {
        width: 1,
        style: 'solid',
        color: '#9d5baf',
      },
    };

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol,
    });
    graphicsLayer.add(pointGraphic);
  }, []);

  return (
    <>
      <div id="answerMapDiv" />
    </>
  );
};
export default GetMap;
