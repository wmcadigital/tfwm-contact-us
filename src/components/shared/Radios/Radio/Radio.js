/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import dompurify from 'dompurify';

const { sanitize } = dompurify;

// eslint-disable-next-line react/prop-types
const Radio = ({ name, text, value, id, onChange, fieldValidation, defaultChecked, register }) => {
  return (
    <>
      <label className="wmnds-fe-radios__container">
        <div
          dangerouslySetInnerHTML={{
            __html: sanitize(text),
          }}
        />
        <input
          className="wmnds-fe-radios__input"
          id={id}
          name={name}
          type="radio"
          ref={register}
          onChange={onChange}
          value={value}
          defaultChecked={defaultChecked}
        />
        <span className="wmnds-fe-radios__checkmark" />
      </label>
    </>
  );
};

// PropTypes
Radio.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

Radio.defaultProps = {
  onChange: null,
};

export default Radio;
