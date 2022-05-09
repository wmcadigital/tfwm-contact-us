import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

const YesOrNo = ({ label = '', options = [], defaultValues = [], required = false }) => {
  const [hasError, setHasError] = useState(defaultValues.every((value) => value === undefined));
  const { register, getValues } = useForm();

  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const checkBoxesChangeHandler = () => {
    const findCheckedBoxes = [...document.querySelectorAll(`input:checked`)].map(
      (checkbox) => checkbox.value
    );

    if (findCheckedBoxes.length > 0) {
      setHasError(false);
    } else {
      setHasError(true);
    }
    setCheckedBoxes(findCheckedBoxes);
  };
  useEffect(() => {
    checkBoxesChangeHandler();
  }, []);

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
        {options.map((option, idx) => (
          <div key={option.name} className="wmnds-m-b-md">
            <label htmlFor="checkbox-example" className="wmnds-fe-radios__container">
              {option.option}
              <input
                className="wmnds-fe-radios__input"
                value="Option 1"
                name="checkbox-example"
                type="radio"
                id="ok"
                ref={register}
              />
              <span className="wmnds-fe-radios__checkmark" />
            </label>
            {checkedBoxes.includes(option.name) && (
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
