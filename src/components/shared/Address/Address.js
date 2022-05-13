/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import Input from '../Input/Input';

import Icon from '../Icon/Icon';

import Button from '../Button/Button';

import s from '../../../App/App.module.scss';

const Address = ({
  label = '',
  name = '',
  defaultValue = '',
  errorMsg = '',
  required,
  register,
  errors,
  inputs,
}) => {
  const [mapView, setMapView] = useState(false);
  return (
    <div className="wmnds-fe-group">
      <div className="wmnds-col-auto" style={{ marginBottom: 30 }}>
        <Button
          text={mapView ? 'List view' : 'Map view'}
          btnClass="wmnds-btn--secondary"
          iconRight={mapView ? 'general-list' : 'general-location-pin'}
          onClick={() => setMapView(!mapView)}
        />
      </div>
      {mapView ? (
        <div>
          <ul>
            <li>Find the location by searching for a place or postcode, or using your location.</li>
            <li>
              Click on the Add point button. Click on the map where you want the point to appear.
              You can edit the point by clicking on it and dragging.
            </li>
          </ul>
          <div className="wmnds-fe-group">
            <label className="wmnds-fe-label" htmlFor="postcode">
              Place or postcode
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  className="wmnds-fe-input"
                  name="postcode"
                  type="text"
                  ref={register}
                  style={{ width: '60%' }}
                />
                <button type="button" className={s.searchButton} onClick={() => {}}>
                  <Icon className="wmnds-btn__icon" iconName="general-search" />
                </button>
              </div>
            </label>
          </div>
        </div>
      ) : (
        <>
          {inputs.map((input) => (
            <Input
              label={input.label}
              label2={input.label2}
              name={input.name}
              errorMsg={input.errorMsg}
              required={input.required}
              register={input.required ? register : undefined}
              errors={errors}
            />
          ))}
        </>
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
        className="wmnds-btn wmnds-btn--secondary wmnds-m-t-md wmnds-m-r-md"
      >
        Remove Point
      </button>
      <div id="mapDiv" />
    </div>
  );
};

export default Address;
