import React, { useState, useEffect, useLayoutEffect } from 'react';

import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';

import Basemap from '@arcgis/core/Basemap';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import Locate from '@arcgis/core/widgets/Locate';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Search from '@arcgis/core/widgets/Search';

// import watchUtils from '@arcgis/core/core/watchUtils';
const watchUtils = require('@arcgis/core/core/watchUtils');

const MapViewContent = () => {
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
      container: 'mapDiv',
      center: [-2.0047209, 52.4778132],
      zoom: 8,
    });

    let sketchVM;
    const addPointButton = document.getElementById('addPoint');
    const removePointButton = document.getElementById('removePoint');
    const locateBtn = new Locate({
      view,
    });
    const searchWidget = new Search({
      view,
      container: 'searchWidget',
    });
    view.ui.add(searchWidget, 'none');

    view.when(() => {
      // Create a new instance of sketchViewModel
      sketchVM = new SketchViewModel({
        view,
        layer: graphicsLayer,
        pointSymbol: {
          type: 'simple-marker',
          style: 'circle',
          size: 20,
          color: '#3c1053',
          outline: {
            width: 1,
            style: 'solid',
            color: '#9d5baf',
          },
        },
      });
      // show add point button
      const addBtn = document.querySelector('#addPoint');
      addBtn.style.display = 'inline';
      addPointButton.addEventListener('click', (evt) => {
        sketchVM.create('point');
      });
      removePointButton.addEventListener('click', (evt) => {
        // remove point from map
        graphicsLayer.removeAll();
        // remove add point button once it's been added
        const addPointBtn = document.querySelector('#addPoint');
        addPointBtn.style.display = 'inline';
        // add remove point button
        const removePointBtn = document.querySelector('#removePoint');
        removePointBtn.style.display = 'none';
      });
      // new point
      sketchVM.on('create', (event) => {
        if (event.state === 'complete') {
          // remove add point button once it's been added
          const addPointBtn = document.querySelector('#addPoint');
          addPointBtn.style.display = 'none';
          // add remove point button
          const removePointBtn = document.querySelector('#removePoint');
          removePointBtn.style.display = 'inline';
          // set x y geometry
          const x = event.graphic.geometry.latitude;
          const y = event.graphic.geometry.longitude;
          // add point data to form input
          document.querySelector(
            '.mapPoint'
          ).value = `https://www.google.com/maps/search/?api=1&query=${x},${y}`;
          sessionStorage.setItem('latitude', x);
          sessionStorage.setItem('longitude', y);
        }
      });
      // point is selected
      sketchVM.on('update', (event) => {
        if (event.state === 'start') {
          // disable submit button
          const subBtn = document.querySelector('.submit');
          subBtn.disabled = true;
          subBtn.classList.add('wmnds-btn--disabled');
        }
      });
      // move point
      sketchVM.on('update', (event) => {
        if (event.state === 'complete') {
          // enable submit button
          const subBtn = document.querySelector('.submit');
          subBtn.disabled = false;
          subBtn.classList.remove('wmnds-btn--disabled');
          // set x y geometry
          const x = event.graphics[0].geometry.latitude;
          const y = event.graphics[0].geometry.longitude;
          // add point data to form input
          document.querySelector(
            '.mapPoint'
          ).value = `https://www.google.com/maps/search/?api=1&query=${x},${y}`;
        }
      });
    });
    // Hide the loading indicator when the view stops updating
    watchUtils.whenFalse(view, 'updating', function (evt) {
      // search input style
      const searchContainer = document.querySelector('.esri-search__input-container');
      const searchInput = document.querySelector('#searchWidget-input');
      searchContainer?.classList.add('wmnds-autocomplete');
      searchInput?.classList.add('wmnds-fe-input');
      searchInput?.classList.add('wmnds-autocomplete__input');
      searchInput?.classList.add('wmnds-col-1');
      // searchInput?.insertAdjacentHTML(
      //   'beforebegin',
      //   '<svg className="wmnds-autocomplete__icon"><use xlink:href="#wmnds-general-search" href="#wmnds-general-search"></use></svg>'
      // );
      const selectElement = document.querySelector('#searchWidget-input');
      selectElement?.addEventListener('change', (event) => {
        console.log('dropdown');
        const searchList = document?.querySelector('.esri-menu__list');
        searchList?.classList.add('wmnds-autocomplete-suggestions');
      });
    });
    // Move ui elements into the right position
    view.ui.move(['zoom'], 'top-right');
    view.ui.move(['attribution'], 'bottom');
    view.ui.add(locateBtn, { position: 'top-right' });

    let mapView = false;
    function mapToggle(event) {
      const x = document.getElementById('formMap');
      const y = document.getElementById('formList');
      const b = document.querySelector('.mapBtn');
      if (y.style.display === 'none') {
        y.style.display = 'block';
        x.style.display = 'none';
        b.innerHTML =
          'Map view ' +
          `<svg className="wmnds-btn__icon wmnds-btn__icon--right"><use xlink:href="#wmnds-general-location-pin" href="#wmnds-general-location-pin"></use></svg>`;
        mapView = false;
        sessionStorage.setItem('mapView', 'false');
      } else {
        y.style.display = 'none';
        x.style.display = 'block';
        b.innerHTML =
          'List view ' +
          `<svg className="wmnds-btn__icon wmnds-btn__icon--right"><use xlink:href="#wmnds-general-chevron-right" href="#wmnds-general-list"></use></svg>`;
        mapView = true;
        sessionStorage.setItem('mapView', 'true');
      }
    }
    // get map view state from session storage
    const mapValue = sessionStorage.getItem('mapView');
    // show map if true
    window.addEventListener('load', function () {
      if (mapValue === 'true') {
        const map2 = document.getElementById('formMap');
        const list = document.getElementById('formList');
        const point = {
          type: 'point',
          longitude: sessionStorage.getItem('longitude'),
          latitude: sessionStorage.getItem('latitude'),
        };
        list.style.display = 'none';
        map2.style.display = 'block';
        console.log('map is true');
        const pointGraphic = new Graphic({
          geometry: point,
        });
        graphicsLayer.add(pointGraphic);
      }
    });
  }, []);

  return (
    <>
      <button
        type="button"
        id="addPoint"
        className="wmnds-btn wmnds-btn--secondary wmnds-m-t-md wmnds-m-r-md"
      >
        Add Point
      </button>
      <button
        type="button"
        id="removePoint"
        className="wmnds-btn wmnds-btn--secondary wmnds-m-t-md wmnds-m-r-md"
      >
        Remove Point
      </button>
      <div id="mapDiv" />
    </>
  );
};
export default MapViewContent;
