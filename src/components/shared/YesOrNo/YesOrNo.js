/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import Radio from '../Radios/Radio/Radio';

const YesOrNo = ({ label = '', options = [], defaultValues = [], required = false, register }) => {
  const [hasError, setHasError] = useState(defaultValues.every((value) => value === undefined));

  const [checkedRadio, setCheckedRadio] = useState([]);
  const checkBoxesChangeHandler = (e) => {
    setCheckedRadio(e.target.value);
  };

  useEffect(() => {
    if (defaultValues.every((value) => value === undefined)) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [defaultValues]);

  return (
    <div className={`wmnds-fe-group ${hasError && 'wmnds-fe-group--error'}`}>
      <div className="wmnds-fe-radios" role="radiogroup">
        {hasError && (
          <span className="wmnds-fe-error-message">Please select at least one option</span>
        )}
        <fieldset style={{ border: 'none' }} onChange={checkBoxesChangeHandler}>
          {options.map((option, idx) => (
            <div key={option.name} className="wmnds-m-b-md">
              <Radio
                key={option.name}
                name="yes-or-no"
                text={option.option}
                id={option.name}
                value={option.name}
                register={register}
              />{' '}
              {checkedRadio === 'yes' && option.name === 'yes' && (
                <div
                  style={{ marginLeft: 60 }}
                  className={` ${defaultValues[idx] === '' && 'wmnds-fe-group--error'}`}
                >
                  <label className="wmnds-fe-label wmnds-m-b-xs" htmlFor="input">
                    {option.inputLabel1}
                  </label>
                  <label className="wmnds-fe-label" htmlFor="input">
                    {option.inputLabel2}
                  </label>{' '}
                  {defaultValues[idx] === '' && (
                    <span className="wmnds-fe-error-message">{option.errorMsg}</span>
                  )}
                  <input
                    name={option.name}
                    className="wmnds-fe-input"
                    id={required ? 'required' : ''}
                    type={option.type}
                    style={{ width: '20rem' }}
                    defaultValue={defaultValues[idx] ? defaultValues[idx] : ''}
                  />
                </div>
              )}
            </div>
          ))}
        </fieldset>
      </div>
    </div>
  );
};

// PropTypes
YesOrNo.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  required: PropTypes.bool.isRequired,

  defaultValues: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default YesOrNo;
