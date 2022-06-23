import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import classes from '../../../App/App.module.scss';

/* eslint-disable react/prop-types */
const Textarea = ({
  title = '',
  errorMsg = '',
  text1 = '',
  text2 = '',
  name = '',
  defaultValue = undefined,
  required = false,
  register,
  errors,
}) => {
  const [hasError, setHasError] = useState(errors.includes(name));

  const textChageHandler = (event) => {
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
    <div className="wmnds-m-t-lg">
      <h3>{title}</h3>
      <div className={`wmnds-fe-group wmnds-m-t-20 ${hasError && 'wmnds-fe-group--error'}`}>
        <label className="wmnds-fe-label" htmlFor="genericInput">
          {text1}
        </label>
        <label className="wmnds-fe-label wmnds-m-t-20" htmlFor="example-textarea">
          {text2}
        </label>
        {hasError && <span className="wmnds-fe-error-message">Field is required</span>}
        <textarea
          // defaultValue={defaultValue ? defaultValue.value : ''}
          className={`wmnds-fe-textarea ${classes.textArea}`}
          id={required ? 'required' : ''}
          name={name}
          rows="2"
          placeholder=""
          defaultValue={defaultValue ? defaultValue[1] : ''}
          onChange={textChageHandler}
          style={{ maxWidth: '20rem' }}
          ref={register}
        />
      </div>
    </div>
  );
};

// PropTypes
Textarea.propTypes = {
  title: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string.isRequired,
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
};

export default Textarea;
