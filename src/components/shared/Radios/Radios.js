import React from 'react';
import PropTypes from 'prop-types';
// import dompurify from 'dompurify';
// Import contexts
// eslint-disable-next-line import/no-unresolved
// import { useFormContext } from 'react-hook-form';
// Import components
import Radio from './Radio/Radio';

// const { sanitize } = dompurify;

const Radios = ({ name, classes, radios, onChange }) => {
  // const { errors } = useFormContext();

  return (
    <div className={`wmnds-fe-group ${classes}`}>
      <fieldset className="wmnds-fe-fieldset">
        <legend className="wmnds-fe-fieldset__legend">
          {/* {label && <h2 className="wmnds-fe-question">{label}</h2>} */}
          {/* If there is an error, show here */}
          {/* {errors[name] && (
            <span
              className="wmnds-fe-error-message"
              dangerouslySetInnerHTML={{
                __html: sanitize(errors[name].message),
              }}
            />
          )} */}
        </legend>
        <div className="wmnds-fe-radios">
          {/* Loop through radios and display each radio button */}
          {radios.map((radio) => (
            <Radio
              key={radio.text}
              name={name}
              text={radio.text}
              value={radio.value}
              id={radio.id}
              onChange={onChange}
              // fieldValidation={fieldValidation}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
};

// PropTypes
Radios.propTypes = {
  // fieldValidation: PropTypes.func,
  classes: PropTypes.string,
  name: PropTypes.string.isRequired,
  // label: PropTypes.string,
  onChange: PropTypes.func,
  radios: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string, PropTypes.string)).isRequired,
};

Radios.defaultProps = {
  // fieldValidation: null,
  onChange: PropTypes.func,

  classes: null,
  // label: null,
};

export default Radios;
