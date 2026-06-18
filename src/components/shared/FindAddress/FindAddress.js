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
  setValue,
}) => {
  const [hasError, setHasError] = useState(errors.includes(name));
  const [postcode, setPostcode] = useState(undefined);
  const [formState, setFormState] = useState(
    typeof defaultValue === 'object' && defaultValue['find-address-state']
      ? defaultValue['find-address-state']
      : 'idle'
  );
  const [addresses, setAddresses] = useState([]);
  const [add, setAdd] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [populatedInputs, setPopulatedInputs] = useState(inputs);
  const [addressSet, setAddressSet] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  useEffect(() => {
    if (errors.includes(name)) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [errors, name]);
  useEffect(() => {
    if (postcode !== undefined) {
      if (!postcode) {
        setHasError(true);
      } else {
        setHasError(false);
      }
    }
  }, [postcode]);

  useEffect(() => {
    setPopulatedInputs(inputs);
  }, [inputs]);

  useEffect(() => {
    if (setValue) {
      setValue(`${name}-state`, formState);
    }
  }, [formState, setValue, name]);

  useEffect(() => {
    if (pendingValues && setValue) {
      Object.entries(pendingValues).forEach(([key, value]) => {
        setValue(key, value);
      });
      setPendingValues(null);
    }
  }, [pendingValues, setValue]);

  const findAddressHandler = async (postcodeValue) => {
    setFormState('find-address');

    const fetchFindAddress = await fetch(
      `${process.env.REACT_APP_ADDRESS_API_URL}/${encodeURI(postcodeValue)}`,
      {
        headers: {
          'power-automate': process.env.REACT_APP_ADDRESS_API_KEY,
        },
      }
    );
    const findAddressRes = await fetchFindAddress.json();
    const line1 = findAddressRes?.[0]?.line_1;
    const line2 = findAddressRes?.[0]?.line_2;
    const line3 = findAddressRes?.[0]?.line_3;
    const postTown = findAddressRes?.[0]?.post_town;
    const county = findAddressRes?.[0]?.county;
    const addressPostcode = findAddressRes?.[0]?.postcode;

    setAddresses(findAddressRes);
    setAdd([line1, line2, line3, postTown, addressPostcode]);

    // If only one address found, auto-populate the form
    if (findAddressRes.length === 1) {
      const populated = inputs.map((input) => {
        let fieldDefaultValue = '';
        switch (input.name) {
          case 'building':
            fieldDefaultValue = line1 || '';
            break;
          case 'street':
            fieldDefaultValue = line2 || '';
            break;
          case 'town-or-city':
            fieldDefaultValue = postTown || '';
            break;
          case 'county':
            fieldDefaultValue = county || '';
            break;
          case 'address-postcode':
            fieldDefaultValue = addressPostcode || '';
            break;
          default:
            break;
        }
        return {
          ...input,
          defaultValue: fieldDefaultValue ? [input.name, fieldDefaultValue] : input.defaultValue,
        };
      });
      setPopulatedInputs(populated);
      setFormState('manual-address');

      // Queue values to be set after inputs register
      setPendingValues({
        building: line1 || '',
        street: line2 || '',
        'town-or-city': postTown || '',
        county: county || '',
        'address-postcode': addressPostcode || '',
      });
    }
  };

  const handleAddressSelection = (event) => {
    const selectedGuid = event.target.value;
    const address = addresses.find((addr) => addr.guid === selectedGuid);

    if (address) {
      setSelectedAddress(address);
      // Prepare inputs with populated defaults
      const prepared = inputs.map((input) => {
        let defaultValues = '';
        switch (input.name) {
          case 'building':
            defaultValues = address.line_1 || '';
            break;
          case 'street':
            defaultValues = address.line_2 || '';
            break;
          case 'town-or-city':
            defaultValues = address.post_town || '';
            break;
          case 'county':
            defaultValues = address.county || '';
            break;
          case 'address-postcode':
            defaultValues = postcode || '';
            break;
          default:
            break;
        }
        return {
          ...input,
          defaultValue: defaultValues ? [input.name, defaultValues] : input.defaultValue,
        };
      });
      setPopulatedInputs(prepared);
      setFormState('manual-address');

      // Queue values to be set after inputs register
      setPendingValues({
        building: address.line_1 || '',
        street: address.line_2 || '',
        'town-or-city': address.post_town || '',
        county: address.county || '',
        'address-postcode': postcode || '',
      });
    }
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
                onChange={handleAddressSelection}
              >
                <option value="">Choose from list</option>
                {addresses.map((option) => (
                  <option key={option.guid} value={option.guid}>
                    {option.summary_line}
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
              onClick={() => setFormState('manual-address')}
            >
              I can’t find my address in the list
            </button>
          </div>
        </>
      )}
      {formState === 'manual-address' && (
        <>
          {populatedInputs.some((input) => {
            const value = Array.isArray(input.defaultValue)
              ? input.defaultValue[1]
              : input.defaultValue;
            return value && value !== '';
          }) && (
            <button
              style={{
                all: 'unset',
                cursor: 'pointer',
                color: '#1d7bbf',
                fontWeight: 'bold',
                textDecoration: 'underline',
                marginBottom: 20,
              }}
              type="button"
              onClick={() => setFormState('find-address')}
            >
              Back
            </button>
          )}
          <Address
            label={label}
            name={name}
            errorMsg={errorMsg}
            required={required}
            allowMapView={allowMapView}
            register={register}
            errors={errors}
            inputs={populatedInputs}
            unregister={unregister}
          />
        </>
      )}
    </div>
  );
};

// PropTypes
FindAddress.propTypes = {
  required: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default FindAddress;
