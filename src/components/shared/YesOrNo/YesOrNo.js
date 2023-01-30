/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import Radio from '../Radios/Radio/Radio';
import Dropdown from '../Dropdown/Dropdown';
import Input from '../Input/Input';

const YesOrNo = ({
  label = '',
  options = [],
  defaultValue = [],
  required = false,
  register,
  unregister,
  errors,
  name,
}) => {
  const [hasError, setHasError] = useState(false);

  const [checkedRadio, setCheckedRadio] = useState();
  const checkBoxesChangeHandler = (e, idx) => {
    if (e.target.value) {
      setHasError(false);
    }
    setCheckedRadio(idx);
  };
  const inputChageHandler = (event) => {
    const regex = /^(\d{0,6})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
    const onlyNumbers = event.target.value.replace(/[^\d]/g, '');
    const filtered = onlyNumbers.replace(regex, (_regex, $1, $2, $3, $4) =>
      [$1, $2, $3, $4].filter((group) => !!group).join(' ')
    );
    // eslint-disable-next-line no-param-reassign
    event.target.value = filtered;
  };
  useEffect(() => {
    if (errors.includes('yes-or-no') || errors.includes('yes-or-no-skip')) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [errors]);

  useEffect(() => {
    setCheckedRadio(undefined);
  }, [name]);

  return (
    <div className={`wmnds-fe-group ${hasError && 'wmnds-fe-group--error'}`}>
      <div className="wmnds-fe-radios" role="radiogroup">
        {hasError && (
          <span className="wmnds-fe-error-message">Please select at least one option</span>
        )}
        <p>{label}</p>
        <fieldset
          style={{ border: 'none' }}
          name={`yes-or-no${options[0].inputLabel1 || options[0].inputs ? '' : '-skip'}`}
        >
          {options.map((option, idx) => (
            <div key={option.name} className="wmnds-m-b-md">
              <Radio
                key={option.name}
                name={`yes-or-no${options[0].inputLabel1 || options[0].inputs ? '' : '-skip'}`}
                text={option.option}
                id={option.name}
                value={option.option}
                register={register}
                onChange={(e) => checkBoxesChangeHandler(e, idx)}
              />
              {(option.inputLabel1 || option.inputs) && checkedRadio === 0 && (
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
                            onChange={option.type === 'NumberFormat' && inputChageHandler}
                            maxLength={option.maxLength}
                          />
                        </div>
                      )}
                    </>
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
YesOrNo.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  required: PropTypes.bool.isRequired,

  defaultValue: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default YesOrNo;
