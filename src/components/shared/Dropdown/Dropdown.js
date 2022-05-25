/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import dompurify from 'dompurify';

const { sanitize } = dompurify;
/* eslint-disable react/prop-types */
const Dropdown = ({
  label = '',
  details = '',
  errorMsg = '',
  options = [],
  onChange = () => {},
  name = '',
  defaultValue = undefined,
  required,
  register,
  errors,
}) => {
  const [hasError, setHasError] = useState(false);

  const dropdownChageHandler = (event) => {
    if (event.target.value === '') {
      setHasError(true);
    } else {
      setHasError(false);
    }
  };

  useEffect(() => {
    if (errors.includes(name)) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [errors]);
  return (
    <div className={`wmnds-fe-group wmnds-m-b-lg  ${hasError && 'wmnds-fe-group--error'}`}>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitize(details),
        }}
        style={{ marginBottom: 30 }}
      />
      <div className="wmnds-fe-dropdown">
        <label className="wmnds-fe-label" htmlFor="dropdown-example">
          {label}
        </label>
        {hasError && <span className="wmnds-fe-error-message">{errorMsg}</span>}

        <select
          className="wmnds-fe-dropdown__select"
          style={{ width: '50%' }}
          id={required ? 'required' : ''}
          name={name}
          onChangeCapture={(e) => {
            onChange(e);
            dropdownChageHandler(e);
          }}
          defaultValue={defaultValue}
          ref={register}
        >
          <option value="">Choose from list</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// PropTypes
Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  errorMsg: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,

  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Dropdown;
