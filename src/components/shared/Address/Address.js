/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import Input from '../Input/Input';

import Icon from '../Icon/Icon';

import Button from '../Button/Button';

import s from '../../../App/App.module.scss';
import MapView from '../MapView/MapView';

const Address = ({
  label = '',
  name = '',
  defaultValue = '',
  errorMsg = '',
  required,
  register,
  errors,
  inputs,
  unregister,
  allowMapView,
}) => {
  const [mapView, setMapView] = useState(false);
  const [inputValues, setInputValues] = useState([]);

  const checkBoxesChangeHandler = () => {
    const findInputs = [...document.querySelectorAll('.mapInput')].map((input) => input.value);

    setInputValues(findInputs);
  };

  const registerRef = (idx) => {
    if (inputValues.every((input) => !input)) {
      return true;
    }
    if (inputValues[idx]) {
      return true;
    }

    return false;
  };

  return (
    <div className="wmnds-fe-group">
      {allowMapView && (
        <>
          <div className="wmnds-col-auto" style={{ marginBottom: 30 }}>
            <Button
              text={mapView ? 'List view' : 'Map view'}
              btnClass="wmnds-btn--secondary"
              iconRight={mapView ? 'general-list' : 'general-location-pin'}
              onClick={() => setMapView(!mapView)}
            />
          </div>
          {mapView && (
            <div>
              <ul>
                <li>
                  Find the location by searching for a place or postcode, or using your location.
                </li>
                <li>
                  Click on the Add point button. Click on the map where you want the point to
                  appear. You can edit the point by clicking on it and dragging.
                </li>
              </ul>

              {/* <div id="searchWidget" /> */}

              <div className="wmnds-fe-group">
                <label className="wmnds-fe-label" htmlFor="postcode">
                  Place or postcode
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div id="searchWidget" />

                    <input
                      className="wmnds-fe-input mapPoint mapInput"
                      name="postcode"
                      type="text"
                      onChangeCapture={checkBoxesChangeHandler}
                      style={{ display: 'none' }}
                      ref={registerRef(0) ? register : unregister('postcode')}
                    />
                    <input
                      className="wmnds-fe-input searchAddress mapInput"
                      name="address"
                      type="text"
                      onChangeCapture={checkBoxesChangeHandler}
                      style={{ display: 'none' }}
                      ref={registerRef(1) ? register : unregister('address')}
                    />
                    <button type="button" className={s.searchButton} onClick={() => {}}>
                      <svg id="search-button" className="wmnds-btn__icon">
                        <use xlinkHref="#wmnds-general-search" href="#wmnds-general-search" />
                      </svg>

                      <svg
                        id="hide-search-button"
                        style={{ display: 'none' }}
                        className="wmnds-btn__icon"
                      >
                        <use xlinkHref="#wmnds-general-cross" href="#wmnds-general-cross" />
                      </svg>
                    </button>
                  </div>
                </label>
              </div>
              <MapView />
            </div>
          )}
        </>
      )}
      {!mapView && (
        <>
          {inputs.map((input) => (
            <Input
              label={input.label}
              label2={input.label2}
              name={input.name}
              errorMsg={input.errorMsg}
              required={input.required}
              unregister={unregister}
              register={register}
              errors={errors}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Address;
