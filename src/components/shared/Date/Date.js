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
  label,
  showTime,
}) => {
  const dateError = errors.includes('year') || errors.includes('month') || errors.includes('day');
  const timeError = errors.includes('hour') || errors.includes('minute');
  return (
    <div className="wmnds-fe-group">
      {showTime && (
        <div className="wmnds-fe-group  ">
          <div className={`wmnds-fe-dropdown ${timeError && 'wmnds-fe-group--error'}`}>
            {timeError && <span className="wmnds-fe-error-message">Enter a valid time</span>}
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
                  --
                </option>
                {Array.from(Array(24).keys()).map((val) => (
                  <option value={val}>{val}</option>
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
                  --
                </option>
                {Array.from(Array(60).keys()).map((val) => (
                  <option value={val}>{val}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      <div id="date-input" className={`wmnds-fe-group ${dateError && 'wmnds-fe-group--error'}`}>
        <div className="wmnds-fe-date-input">
          {dateError && <span className="wmnds-fe-error-message">Enter a valid date</span>}
          <p style={{ marginBottom: 30 }}>{label}</p>

          <div className="wmnds-fe-date-input__day">
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
