/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

const Number = ({
  label = '',
  label2 = '',
  name = '',
  defaultValue = '',
  errorMsg = '',
  required,
  register,
  unregister,

  errors,
  type,
}) => {
  const [hasError, setHasError] = useState(errors.includes(name));

  const [registerRef, setRegisterRef] = useState(required);
  const inputChageHandler = (event) => {
    if (!required && event.target.value) {
      setRegisterRef(true);
    }
    if (!required && !event.target.value) {
      setRegisterRef(false);
    }
    if (event.target.value === '') {
      setHasError(true);
    } else {
      setHasError(false);
    }
    const regex = /^(\d{0,6})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
    const onlyNumbers = event.target.value.replace(/[^\d]/g, '');
    const filtered = onlyNumbers.replace(regex, (_regex, $1, $2, $3, $4) =>
      [$1, $2, $3, $4].filter((group) => !!group).join(' ')
    );
    // eslint-disable-next-line no-param-reassign
    event.target.value = filtered;
  };
  useEffect(() => {
    if (errors.includes(name)) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [errors]);
  return (
    <div
      className={`wmnds-fe-group ${hasError && required && 'wmnds-fe-group--error'}`}
      style={{ margin: 0 }}
    >
      {label && (
        <label
          style={{ marginBottom: label2 && 0, marginTop: 20 }}
          className="wmnds-fe-label"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      {label2 && (
        <label className="wmnds-fe-label" htmlFor={name}>
          {label2}
        </label>
      )}
      {hasError && required && <span className="wmnds-fe-error-message">{errorMsg}</span>}
      <input
        className={`wmnds-fe-input ${hasError && required && 'wmnds-fe-input--error'}`}
        id={name}
        name={name}
        key={name}
        required={required}
        type={type || 'text'}
        defaultValue={defaultValue ? defaultValue[1] : ''}
        style={{ maxWidth: '20rem', marginBottom: 10 }}
        onChange={inputChageHandler}
        ref={registerRef ? register : unregister(name)}
        pattern={name === 'email' && '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'}
        maxLength={21}
      />
    </div>
  );
};

// PropTypes
Number.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.objectOf.isRequired,
};

export default Number;
