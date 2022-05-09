import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import classes from '../../../App/App.module.scss';

const Textarea = ({
  title = '',
  errorMsg = '',
  text1 = '',
  text2 = '',
  name = '',
  defaultValue = undefined,
  required = false,
}) => {
  const [hasError, setHasError] = useState(defaultValue === '');

  const textChageHandler = (event) => {
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
    <div className="wmnds-m-t-lg">
      <h3>{title}</h3>
      <div className={`wmnds-fe-group wmnds-m-t-20 ${hasError && 'wmnds-fe-group--error'}`}>
        <label className="wmnds-fe-label" htmlFor="genericInput">
          {text1}
        </label>
        <label className="wmnds-fe-label wmnds-m-t-20" htmlFor="example-textarea">
          {text2}
        </label>
        {hasError && <span className="wmnds-fe-error-message">{errorMsg}</span>}
        <textarea
          defaultValue={defaultValue}
          className={`wmnds-fe-textarea ${classes.textArea}`}
          id={required ? 'required' : ''}
          name={name}
          rows="2"
          maxLength="200"
          placeholder=""
          onChange={textChageHandler}
          style={{ width: '70%' }}
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
