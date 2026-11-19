import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ArcGISMapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Locate from '@arcgis/core/widgets/Locate';
import Search from '@arcgis/core/widgets/Search';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import Graphic from '@arcgis/core/Graphic';
import MapView from './MapView';

jest.mock('@arcgis/core/views/MapView', () => jest.fn());
jest.mock('@arcgis/core/Map', () => jest.fn());
jest.mock('@arcgis/core/Basemap', () => jest.fn());
jest.mock('@arcgis/core/layers/VectorTileLayer', () => jest.fn());
jest.mock('@arcgis/core/widgets/Locate', () => jest.fn());
jest.mock('@arcgis/core/widgets/Sketch/SketchViewModel', () => jest.fn());
jest.mock('@arcgis/core/Graphic', () => jest.fn());
jest.mock('@arcgis/core/layers/GraphicsLayer', () => jest.fn());
jest.mock('@arcgis/core/widgets/Search', () => jest.fn());
jest.mock('@arcgis/core/geometry/Extent', () =>
  jest.fn().mockImplementation((properties) => properties)
);
jest.mock('@arcgis/core/core/watchUtils', () => ({
  whenFalse: () => ({ remove: jest.fn() }),
}));

let sketchEvents;
let searchEvents;
let searchSources;
let graphics;
let view;

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
  sketchEvents = {};
  searchEvents = {};
  searchSources = [];
  graphics = { add: jest.fn(), remove: jest.fn(), removeAll: jest.fn() };
  view = {
    when: (callback) => callback(),
    ui: { add: jest.fn(), move: jest.fn() },
    goTo: jest.fn().mockResolvedValue(),
    destroy: jest.fn(),
  };
  ArcGISMapView.mockImplementation(() => view);
  GraphicsLayer.mockImplementation(() => graphics);
  Locate.mockImplementation(() => ({}));
  SketchViewModel.mockImplementation(() => ({
    on: (name, callback) => {
      if (!sketchEvents[name]) sketchEvents[name] = [];
      sketchEvents[name].push(callback);
    },
    create: jest.fn(),
    destroy: jest.fn(),
  }));
  Search.mockImplementation(() => ({
    defaultSources: {
      forEach: (callback) => searchSources.forEach(callback),
      on: (name, callback) => {
        searchEvents[`source-${name}`] = callback;
        return { remove: jest.fn() };
      },
    },
    on: (name, callback) => {
      searchEvents[name] = callback;
    },
    clear: jest.fn(() => searchEvents['search-clear']()),
  }));
});

const renderMap = (props = {}) =>
  render(
    <>
      <div id="searchWidget" />
      <button id="search-button" type="button">
        Search
      </button>
      <button id="hide-search-button" type="button">
        Clear
      </button>
      <input className="mapPoint" readOnly />
      <input className="searchAddress" readOnly />
      <button className="submit" type="button">
        Submit
      </button>
      <MapView {...props} />
    </>
  );

const point = (longitude, latitude) => ({
  longitude,
  latitude,
  clone() {
    return point(this.longitude, this.latitude);
  },
});

test('constrains navigation and applies the same bounds to asynchronously loaded search sources', () => {
  renderMap();
  const bounds = ArcGISMapView.mock.calls[0][0].constraints.geometry;
  expect(bounds).toMatchObject({ xmin: -2.5, ymin: 52, xmax: -1.5, ymax: 52.9 });
  const source = { set: jest.fn() };
  act(() => searchEvents['source-after-add']({ item: source }));
  expect(source.set).toHaveBeenCalledWith('filter', { geometry: bounds });
  expect(Search.mock.calls[0][0].locationEnabled).toBe(false);
});

test('rejects points outside the bounds and restores an invalid move', () => {
  renderMap();
  const invalid = { geometry: point(-3, 52.5) };
  act(() => sketchEvents.create[0]({ state: 'complete', graphic: invalid }));
  expect(graphics.remove).toHaveBeenCalledWith(invalid);
  expect(screen.getByRole('alert')).toHaveTextContent('within the West Midlands');
  expect(document.querySelector('.mapPoint').value).toBe('');

  const graphic = { geometry: point(-2.5, 52) };
  act(() => sketchEvents.create[0]({ state: 'complete', graphic }));
  expect(document.querySelector('.mapPoint').value).toContain('52,-2.5');
  act(() =>
    sketchEvents.update.forEach((handler) => handler({ state: 'start', graphics: [graphic] }))
  );
  graphic.geometry = point(-3, 52.5);
  act(() =>
    sketchEvents.update.forEach((handler) => handler({ state: 'complete', graphics: [graphic] }))
  );
  expect(graphic.geometry).toMatchObject({ longitude: -2.5, latitude: 52 });
  expect(document.querySelector('.mapPoint').value).toContain('52,-2.5');
  fireEvent.click(screen.getByText('Remove Point'));
  expect(document.querySelector('.mapPoint').value).toBe('');
  expect(sessionStorage.getItem('latitude')).toBeNull();
});

test('rejects an out-of-bounds search result', () => {
  renderMap();
  act(() =>
    searchEvents['select-result']({
      result: { name: 'Outside', feature: { geometry: point(0, 51) } },
    })
  );
  expect(document.querySelector('.searchAddress').value).toBe('');
  expect(screen.getByRole('alert')).toHaveTextContent('within the West Midlands');
});

test('prevents locating outside the bounds and allows an inside location', async () => {
  renderMap();
  const goToOverride = Locate.mock.calls[0][0].goToOverride;
  await act(async () => {
    await expect(goToOverride(view, { target: { target: point(0, 51) } })).rejects.toThrow(
      'outside'
    );
  });
  expect(view.goTo).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('within the West Midlands');
  const target = { target: point(-2, 52.5), scale: 2500 };
  await act(async () => goToOverride(view, { target, options: {} }));
  expect(view.goTo).toHaveBeenCalledWith(target, {});
});

test('restores a saved marker and search text', () => {
  renderMap({
    savedMapPoint: 'https://www.google.com/maps/search/?api=1&query=52.5,-2',
    savedSearchAddress: 'Birmingham',
  });
  expect(ArcGISMapView.mock.calls[0][0]).toMatchObject({ center: [-2, 52.5], zoom: 12 });
  expect(Search.mock.calls[0][0].searchTerm).toBe('Birmingham');
  expect(Graphic).toHaveBeenCalledWith(
    expect.objectContaining({ geometry: { type: 'point', latitude: 52.5, longitude: -2 } })
  );
  expect(graphics.add).toHaveBeenCalled();
  expect(screen.getByText('Add Point')).not.toBeVisible();
  expect(screen.getByText('Remove Point')).toBeVisible();
});
