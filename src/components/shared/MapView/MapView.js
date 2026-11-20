import React, { useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';

import Basemap from '@arcgis/core/Basemap';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import Locate from '@arcgis/core/widgets/Locate';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Search from '@arcgis/core/widgets/Search';
import Extent from '@arcgis/core/geometry/Extent';

// import watchUtils from '@arcgis/core/core/watchUtils';
const watchUtils = require('@arcgis/core/core/watchUtils');

const westMidlandsExtent = new Extent({
  xmin: -2.5,
  ymin: 52.0,
  xmax: -1.5,
  ymax: 52.9,
  spatialReference: { wkid: 4326 },
});

const isInWestMidlands = (point) =>
  Number.isFinite(point?.longitude) &&
  Number.isFinite(point?.latitude) &&
  point.longitude >= westMidlandsExtent.xmin &&
  point.longitude <= westMidlandsExtent.xmax &&
  point.latitude >= westMidlandsExtent.ymin &&
  point.latitude <= westMidlandsExtent.ymax;

const pointSymbol = {
  type: 'simple-marker',
  style: 'circle',
  size: 20,
  color: '#3c1053',
  outline: {
    width: 1,
    style: 'solid',
    color: '#9d5baf',
  },
};

const MapViewContent = ({ savedMapPoint = '', savedSearchAddress = '' }) => {
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    const savedCoordinates = savedMapPoint.match(
      /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/
    );
    const savedPoint = savedCoordinates && {
      type: 'point',
      latitude: Number(savedCoordinates[1]),
      longitude: Number(savedCoordinates[2]),
    };
    const initialPoint = isInWestMidlands(savedPoint) ? savedPoint : null;
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
      center: initialPoint
        ? [initialPoint.longitude, initialPoint.latitude]
        : [-2.0047209, 52.4778132],
      zoom: initialPoint ? 12 : 8,
      constraints: { geometry: westMidlandsExtent },
    });

    let sketchVM;
    let previousPoint;
    let disposed = false;
    const showLocationError = () =>
      setLocationError('Choose a location within the West Midlands map area.');
    const savePoint = (point) => {
      document.querySelector(
        '.mapPoint'
      ).value = `https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`;
      sessionStorage.setItem('latitude', point.latitude);
      sessionStorage.setItem('longitude', point.longitude);
      setLocationError('');
    };
    const addPointButton = document.getElementById('addPoint');
    const removePointButton = document.getElementById('removePoint');
    const locateBtn = new Locate({
      view,
      goToOverride: (mapView, options) => {
        if (!isInWestMidlands(options.target.target)) {
          showLocationError();
          return Promise.reject(
            new Error('Current location is outside the West Midlands map area.')
          );
        }
        setLocationError('');
        return mapView.goTo(options.target, options.options);
      },
    });
    const searchWidget = new Search({
      view,
      container: 'searchWidget',
      locationEnabled: false,
      searchTerm: savedSearchAddress,
    });
    const filterSearchSource = (source) => {
      source.set('filter', { geometry: westMidlandsExtent });
    };
    searchWidget.defaultSources.forEach(filterSearchSource);
    const sourceHandle = searchWidget.defaultSources.on('after-add', (event) =>
      filterSearchSource(event.item)
    );
    const searchButton = document.getElementById('search-button');
    const hideSearchButton = document.getElementById('hide-search-button');
    view.ui.add(searchWidget, 'none');
    searchWidget.on('select-result', (event) => {
      if (!isInWestMidlands(event.result.feature.geometry)) {
        searchWidget.clear();
        document.querySelector('.searchAddress').value = '';
        showLocationError();
        return;
      }
      setLocationError('');
      document.querySelector('.searchAddress').value = event.result.name;
    });
    searchWidget.on('search-clear', () => {
      document.querySelector('.searchAddress').value = '';
    });
    view.when(() => {
      if (disposed) return;
      // Create a new instance of sketchViewModel
      sketchVM = new SketchViewModel({
        view,
        layer: graphicsLayer,
        pointSymbol,
      });
      const addBtn = document.querySelector('#addPoint');
      if (initialPoint) {
        graphicsLayer.add(new Graphic({ geometry: initialPoint, symbol: pointSymbol }));
        addBtn.style.display = 'none';
        removePointButton.style.display = 'inline';
      } else {
        addBtn.style.display = 'inline';
      }
      addPointButton.addEventListener('click', (evt) => {
        sketchVM.create('point');
      });
      removePointButton.addEventListener('click', (evt) => {
        // remove point from map
        graphicsLayer.removeAll();
        document.querySelector('.mapPoint').value = '';
        sessionStorage.removeItem('latitude');
        sessionStorage.removeItem('longitude');
        setLocationError('');
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
          if (!isInWestMidlands(event.graphic.geometry)) {
            graphicsLayer.remove(event.graphic);
            showLocationError();
            return;
          }
          // remove add point button once it's been added
          const addPointBtn = document.querySelector('#addPoint');
          addPointBtn.style.display = 'none';
          // add remove point button
          const removePointBtn = document.querySelector('#removePoint');
          removePointBtn.style.display = 'inline';
          savePoint(event.graphic.geometry);
        }
      });
      // point is selected
      sketchVM.on('update', (event) => {
        if (event.state === 'start') {
          previousPoint = event.graphics[0].geometry.clone();
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
          const graphic = event.graphics[0];
          if (!isInWestMidlands(graphic.geometry)) {
            graphic.geometry = previousPoint;
            showLocationError();
            return;
          }
          savePoint(graphic.geometry);
        }
      });
    });
    // Hide the loading indicator when the view stops updating
    const updatingHandle = watchUtils.whenFalse(view, 'updating', function (evt) {
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
        searchButton.style.display = 'none';
        hideSearchButton.style.display = 'inline';

        const searchList = document?.querySelector('.esri-menu__list');
        searchList?.classList.add('wmnds-autocomplete-suggestions');
      });
    });
    const clearSearch = () => {
      searchWidget.clear();
      searchButton.style.display = 'inline';
      hideSearchButton.style.display = 'none';
    };
    hideSearchButton.addEventListener('click', clearSearch);
    // Move ui elements into the right position
    view.ui.move(['zoom'], 'top-right');
    view.ui.move(['attribution'], 'bottom');
    view.ui.add(locateBtn, { position: 'top-right' });
    return () => {
      disposed = true;
      sourceHandle.remove();
      updatingHandle.remove();
      hideSearchButton.removeEventListener('click', clearSearch);
      if (sketchVM) sketchVM.destroy();
      view.destroy();
    };
  }, []);

  return (
    <>
      {locationError && (
        <p className="wmnds-fe-error-message" role="alert">
          {locationError}
        </p>
      )}
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
        style={{ display: 'none' }}
        className="wmnds-btn wmnds-btn--secondary wmnds-m-t-md wmnds-m-r-md"
      >
        Remove Point
      </button>
      <div id="mapDiv" />
    </>
  );
};
MapViewContent.propTypes = {
  savedMapPoint: PropTypes.string,
  savedSearchAddress: PropTypes.string,
};

MapViewContent.defaultProps = {
  savedMapPoint: '',
  savedSearchAddress: '',
};

export default MapViewContent;
