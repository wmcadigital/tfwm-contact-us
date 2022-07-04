/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import Address from '../Address/Address';

const FindAddress = ({
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
  const [hasError, setHasError] = useState(errors.includes(name));
  const [postcode, setPostcode] = useState(undefined);
  const [formState, setFormState] = useState('idle');
  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    if (errors.includes(name)) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [errors]);
  useEffect(() => {
    if (postcode !== undefined) {
      if (!postcode) {
        setHasError(true);
      } else {
        setHasError(false);
      }
    }
  }, [postcode]);

  const findAddressHandler = async (postcodeValue) => {
    setFormState('find-address');

    // const fetchFindAddress = await fetch(
    //   `https://apis.networkwestmidlands.com/Addresses/AddressByPostcode/WV81BY`
    // );
    // const findAddressRes = await fetchFindAddress.json();
  };
  return (
    <div className={`wmnds-fe-group ${hasError && required && 'wmnds-fe-group--error'}`}>
      {formState === 'idle' && (
        <>
          <label className="wmnds-fe-label" htmlFor={name}>
            <p style={{ fontWeight: 'bold', marginBottom: 10 }}>Postcode</p>
            {hasError && required && <span className="wmnds-fe-error-message">{errorMsg}</span>}
            <input
              className={`wmnds-fe-input ${hasError && required && 'wmnds-fe-input--error'}`}
              id={name}
              name={name}
              defaultValue={postcode}
              key={name}
              onChange={(e) => setPostcode(e.target.value)}
              type="text"
              style={{ maxWidth: '20rem' }}
              ref={register}
            />
          </label>
          <button
            onClick={() => {
              if (postcode) {
                findAddressHandler(postcode);
              }
            }}
            className="wmnds-btn wmnds-btn--primary"
            type="button"
          >
            Find Address
          </button>
        </>
      )}
      {formState === 'find-address' && (
        <>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: 10 }}>Postcode</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <p style={{ margin: 0 }}>{postcode}</p>
              <button
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  color: '#1d7bbf',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                }}
                type="button"
                onClick={() => setFormState('idle')}
              >
                Change
              </button>
            </div>
          </div>
          <div className="wmnds-fe-dropdown">
            <label className="wmnds-fe-label" htmlFor="dropdown-example">
              <p style={{ fontWeight: 'bold', marginBottom: 10 }}> Select an address</p>
              {hasError && <span className="wmnds-fe-error-message">{errorMsg}</span>}
              <select
                className="wmnds-fe-dropdown__select"
                style={{ maxWidth: '20rem' }}
                name="find-address"
                ref={register}
              >
                <option value="">Choose from list</option>
                {addresses.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <button
              style={{
                all: 'unset',
                cursor: 'pointer',
                color: '#1d7bbf',
                fontWeight: 'bold',
                textDecoration: 'underline',
                marginTop: 20,
              }}
              type="button"
              onClick={() => setFormState('manuel-address')}
            >
              I can’t find my address in the list
            </button>
          </div>
        </>
      )}
      {formState === 'manuel-address' && (
        <Address
          label={label}
          name={name}
          errorMsg={errorMsg}
          required={required}
          allowMapView={allowMapView}
          register={register}
          errors={errors}
          inputs={inputs}
          unregister={unregister}
        />
      )}
    </div>
  );
};

// PropTypes
FindAddress.propTypes = {
  required: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.objectOf.isRequired,
};

export default FindAddress;
