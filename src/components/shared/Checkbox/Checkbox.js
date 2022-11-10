import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
/* eslint-disable react/prop-types */
import Input from '../Input/Input';

const Checkbox = ({
  label = '',
  options = [],
  defaultValues = [],
  required = false,
  register,
  unregister,
  errors,
  name,
}) => {
  const [hasError, setHasError] = useState(false);
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const checkBoxesChangeHandler = () => {
    const findCheckedBoxes = [...document.querySelectorAll(`input:checked`)].map(
      (checkbox) => checkbox.value
    );

    if (findCheckedBoxes.length === 0 && errors.length > 0) {
      setHasError(true);
    } else {
      setHasError(false);
    }
    setCheckedBoxes(findCheckedBoxes);
  };
  useEffect(() => {
    checkBoxesChangeHandler();
  }, [errors]);

  const registerRef = (checkboxName) => {
    if (checkedBoxes.length === 0) {
      return true;
    }
    if (checkedBoxes.includes(checkboxName)) {
      return true;
    }

    return false;
  };
  return (
    <div className={`wmnds-fe-group ${hasError && 'wmnds-fe-group--error'}`}>
      <div className="wmnds-fe-checkboxes">
        {hasError && (
          <span className="wmnds-fe-error-message">Please select at least one option</span>
        )}

        <span className="wmnds-fe-checkboxes__desc">{label}</span>

        {options.map((option, idx) => (
          <div key={option.name} className="wmnds-m-b-md">
            <label htmlFor={option.name} className="wmnds-fe-checkboxes__container">
              {option.option}
              <input
                onChange={checkBoxesChangeHandler}
                className={`wmnds-fe-checkboxes__input ${
                  registerRef(option.name) ? 'register' : 'undefined'
                }`}
                value={option.name}
                type="checkbox"
                // defaultChecked={defaultValues.find((values) => values[0] === option.name) && true}
                id={option.name}
                name={option.name}
                ref={registerRef(option.name) ? register : unregister(option.name)}
              />

              <span className="wmnds-fe-checkboxes__checkmark">
                <svg className="wmnds-fe-checkboxes__icon">
                  <use xlinkHref="#wmnds-general-checkmark" href="#wmnds-general-checkmark" />
                </svg>
              </span>
            </label>
            {checkedBoxes.includes(option.name) && option.inputLabel1 && (
              <div
                style={{ marginLeft: 60 }}
                className={` ${errors.includes(option.name) && 'wmnds-fe-group--error'}`}
              >
                <label className="wmnds-fe-label wmnds-m-b-xs" htmlFor="input">
                  {option.inputLabel1}
                </label>
                <label className="wmnds-fe-label" htmlFor="input">
                  {option.inputLabel2}
                </label>{' '}
                {errors.includes(option.name) && (
                  <span className="wmnds-fe-error-message">{option.errorMsg}</span>
                )}
                <input
                  name={option.name}
                  className="wmnds-fe-input"
                  id={required ? 'required' : ''}
                  type={option.type}
                  style={{ maxWidth: '20rem' }}
                  // defaultValue={defaultValues.find((values) => values[0] === option.name)[1] || ''}
                  ref={register}
                />
              </div>
            )}
            {option.inputs && checkedBoxes.includes(option.name) && (
              <>
                {option.inputs ? (
                  <div
                    style={{ marginLeft: 60 }}
                    className={` ${errors.includes(option.name) && 'wmnds-fe-group--error'}`}
                  >
                    {option.inputs.map((input) => (
                      <Input
                        key={input.name}
                        label={input.inputLabel1}
                        label2={input.inputLabel2}
                        name={input.name}
                        errorMsg={input.errorMsg}
                        required={option.required}
                        unregister={unregister}
                        register={register}
                        errors={errors}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{ marginLeft: 60 }}
                    className={` ${errors.includes(option.name) && 'wmnds-fe-group--error'}`}
                  >
                    <label className="wmnds-fe-label wmnds-m-b-xs" htmlFor="input">
                      {option.inputLabel1}
                    </label>
                    <label className="wmnds-fe-label" htmlFor="input">
                      {option.inputLabel2}
                    </label>{' '}
                    {errors.includes(option.name) && (
                      <span className="wmnds-fe-error-message">{option.errorMsg}</span>
                    )}
                    <input
                      name={option.name}
                      className="wmnds-fe-input"
                      type={option.type}
                      style={{ maxWidth: '20rem' }}
                      // defaultValue={defaultValue[idx] ? defaultValue[idx] : ''}
                      ref={register}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// PropTypes
Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  required: PropTypes.bool.isRequired,

  defaultValues: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Checkbox;
