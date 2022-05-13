import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

/* eslint-disable react/prop-types */
const Calendar = ({
  dayDefaultValue = undefined,
  monthDefaultValue = undefined,
  yearDefaultValue = undefined,
  required = false,
  name = '',
  register,
  errors,
}) => {
  const [hasError, setHasError] = useState();
  const dateChangeHandler = () => {
    // const findDateInputs = [...document.querySelectorAll(`input`)].map(
    //   (checkbox) => checkbox.value
    // );
    // const dateIsEmpty = findDateInputs.every((value) => value === '');
    // if (dateIsEmpty) {
    //   setIsRequired(false);
    //   setHasError(false);
    //   return;
    // }
    // if (!dateIsEmpty) {
    //   setIsRequired(true);
    // }
    // if (findDateInputs.includes('')) {
    //   setHasError(true);
    // } else {
    //   setHasError(false);
    // }
  };

  useEffect(() => {
    if (errors.length > 0) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [errors]);

  return (
    <div className="wmnds-fe-group">
      <div className="wmnds-fe-group  ">
        <div className="wmnds-fe-dropdown">
          <label className="wmnds-fe-label" htmlFor="dropdown-example">
            <p style={{ marginBottom: 10 }}>Time</p>
            <select
              className="wmnds-fe-dropdown__select "
              id="hour"
              name="hour"
              style={{ width: 100, marginRight: 20 }}
              ref={register}
            >
              <option value="" selected="true">
                00
              </option>
              {Array.from(Array(24).keys()).map((val) => (
                <option value={val + 1}>{val + 1}</option>
              ))}
            </select>

            <select
              className="wmnds-fe-dropdown__select "
              id="minute"
              name="minute"
              style={{ width: 100 }}
              placeholder="00"
              ref={register}
            >
              <option value="" selected="true">
                00
              </option>
              {Array.from(Array(60).keys()).map((val) => (
                <option value={val + 1}>{val + 1}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div id="date-input" className={`wmnds-fe-group ${hasError && 'wmnds-fe-group--error'}`}>
        <div className="wmnds-fe-date-input">
          {hasError && <span className="wmnds-fe-error-message">Enter a valid date</span>}

          <div className="wmnds-fe-date-input__day">
            <p style={{ marginBottom: 10 }}>Date</p>

            <label className="wmnds-fe-label" htmlFor="LastUsedDateDay">
              Day{' '}
              <input
                className={`wmnds-fe-input ${errors.includes('year') && 'wmnds-fe-input--error'}`}
                inputMode="numeric"
                id="LastUsedDateDay"
                name="day"
                type="text"
                maxLength="2"
                minLength="1"
                pattern="[0-9]*"
                onChange={dateChangeHandler}
                defaultValue={dayDefaultValue}
                ref={register}
              />
            </label>
          </div>
          <div className="wmnds-fe-date-input__month">
            <label className="wmnds-fe-label" htmlFor="LastUsedDateMonth">
              Month{' '}
              <input
                className={`wmnds-fe-input ${errors.includes('year') && 'wmnds-fe-input--error'}`}
                inputMode="numeric"
                name="month"
                id="LastUsedDateDay"
                type="text"
                maxLength="2"
                minLength="1"
                pattern="[0-9]*"
                onChange={dateChangeHandler}
                defaultValue={monthDefaultValue}
                ref={register}
              />
            </label>
          </div>
          <div className="wmnds-fe-date-input__year">
            <label className="wmnds-fe-label" htmlFor="year">
              Year{' '}
              <input
                className={`wmnds-fe-input ${errors.includes('year') && 'wmnds-fe-input--error'}`}
                inputMode="numeric"
                name="year"
                id="year"
                type="text"
                maxLength="4"
                minLength="4"
                pattern="[0-9]*"
                onChange={dateChangeHandler}
                defaultValue={yearDefaultValue}
                ref={register}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes
Calendar.propTypes = {
  name: PropTypes.string.isRequired,
  required: PropTypes.string.isRequired,
  dayDefaultValue: PropTypes.string.isRequired,
  monthDefaultValue: PropTypes.string.isRequired,
  yearDefaultValue: PropTypes.string.isRequired,
};

export default Calendar;
