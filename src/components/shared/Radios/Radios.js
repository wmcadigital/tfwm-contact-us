import React from 'react';
import PropTypes from 'prop-types';
import dompurify from 'dompurify';
// Import contexts
// eslint-disable-next-line import/no-unresolved
import { useForm } from 'react-hook-form';
// Import components
import Radio from './Radio/Radio';

const { sanitize } = dompurify;

// eslint-disable-next-line react/prop-types
const Radios = ({ name, label, classes, radios, onChange, fieldValidation, register }) => {
  const { errors } = useForm();

  return (
    <>
      {label && <h2 className="wmnds-fe-question">{label}</h2>}
      {fieldValidation ? (
        <div className="wmnds-msg-summary wmnds-msg-summary--error wmnds-m-b-lg">
          <div className="wmnds-msg-summary__header">
            <svg className="wmnds-msg-summary__icon">
              <use
                xlinkHref="#wmnds-general-warning-triangle"
                href="#wmnds-general-warning-triangle"
              />
            </svg>
            <h3 className="wmnds-msg-summary__title">There is a problem</h3>
          </div>
          <span className="wmnds-msg-summary__info">Please choose an option</span>
        </div>
      ) : null}
      <div className={`wmnds-fe-group ${fieldValidation ? 'wmnds-fe-group--error' : ''}`}>
        <fieldset className="wmnds-fe-fieldset">
          <legend className="wmnds-fe-fieldset__legend">
            {/* If there is an error, show here */}
            {fieldValidation && (
              <span className="wmnds-fe-error-message">Please choose an option</span>
            )}
            <div className="wmnds-fe-radios">
              {/* Loop through radios and display each radio button */}
              {radios?.map((radio) => (
                <Radio
                  key={radio.text}
                  name={name}
                  text={radio.text}
                  value={radio.value}
                  id={radio.id}
                  onChange={onChange}
                  fieldValidation={fieldValidation}
                  defaultChecked={radio.selected}
                  register={register}
                />
              ))}
            </div>
          </legend>
        </fieldset>
      </div>
    </>
  );
};

// PropTypes
Radios.propTypes = {
  fieldValidation: PropTypes.bool,
  classes: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
  radios: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any, PropTypes.bool)).isRequired,
};

Radios.defaultProps = {
  fieldValidation: null,
  onChange: PropTypes.func,

  classes: null,
  label: null,
};

export default Radios;
