/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
const Input = ({ label = '', name = '', defaultValue = '', errorMsg = '', required, register }) => {
  const [hasError, setHasError] = useState(defaultValue === '');

  const inputChageHandler = (event) => {
    if (event.target.value === '') {
      setHasError(true);
    } else {
      setHasError(false);
    }
  };
  useEffect(() => {
    if (defaultValue === '') {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [defaultValue]);
  return (
    <div className={`wmnds-fe-group ${hasError && required && 'wmnds-fe-group--error'}`}>
      {label && (
        <label className="wmnds-fe-label" htmlFor="input">
          {label}
        </label>
      )}
      {hasError && required && <span className="wmnds-fe-error-message">{errorMsg}</span>}
      <input
        className={`wmnds-fe-input ${hasError && required && 'wmnds-fe-input--error'}`}
        id={required ? 'required' : ''}
        name={name}
        type="text"
        style={{ width: '20rem' }}
        defaultValue={defaultValue}
        onChange={inputChageHandler}
        ref={register}
      />
    </div>
  );
};

// PropTypes
Input.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
};

export default Input;
