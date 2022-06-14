/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import Radio from '../Radios/Radio/Radio';
import Dropdown from '../Dropdown/Dropdown';

const RadioOptions = ({
  label = '',
  options = [],
  defaultValues = [],
  required = false,
  register,
  unregister,
  errors,
}) => {
  const [hasError, setHasError] = useState(false);

  const [checkedRadio, setCheckedRadio] = useState();
  const checkBoxesChangeHandler = (e) => {
    if (e.target.value) {
      setHasError(false);
    }
    setCheckedRadio(e.target.value);
  };

  useEffect(() => {
    if (errors.includes('radio')) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [errors]);

  return (
    <div className={`wmnds-fe-group ${hasError && 'wmnds-fe-group--error'}`}>
      <div className="wmnds-fe-radios" role="radiogroup">
        {hasError && (
          <span className="wmnds-fe-error-message">Please select at least one option</span>
        )}
        <p>{label}</p>
        <fieldset style={{ border: 'none' }}>
          {options.map((option, idx) => (
            <div key={option.name} className="wmnds-m-b-md">
              <Radio
                key={option.name}
                name="radio"
                text={option.option}
                id={option.name}
                value={option.option}
                register={register}
                onChange={checkBoxesChangeHandler}
              />
              {option.type && checkedRadio === option.option && (
                <>
                  {option.type === 'Dropdown' ? (
                    <div style={{ marginLeft: 40 }}>
                      <Dropdown
                        label={option.inputLabel1}
                        errorMsg={option.errorMsg}
                        required={option.required}
                        options={option.options}
                        name={option.name}
                        register={register}
                        errors={errors}
                      />
                    </div>
                  ) : (
                    <div
                      style={{ marginLeft: 60 }}
                      className={` ${errors.includes('yes') && 'wmnds-fe-group--error'}`}
                    >
                      <label className="wmnds-fe-label wmnds-m-b-xs" htmlFor="input">
                        {option.inputLabel1}
                      </label>
                      <label className="wmnds-fe-label" htmlFor="input">
                        {option.inputLabel2}
                      </label>{' '}
                      {errors.includes('yes') && (
                        <span className="wmnds-fe-error-message">{option.errorMsg}</span>
                      )}
                      <input
                        name={option.name}
                        className="wmnds-fe-input"
                        type={option.type}
                        style={{ width: '20rem' }}
                        defaultValue={defaultValues[idx] ? defaultValues[idx] : ''}
                        ref={register}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </fieldset>
      </div>
    </div>
  );
};

// PropTypes
RadioOptions.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  required: PropTypes.bool.isRequired,

  defaultValues: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RadioOptions;
