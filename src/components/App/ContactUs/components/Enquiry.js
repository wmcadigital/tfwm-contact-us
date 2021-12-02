/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { useContext, useState, useReducer } from 'react';
import Radios from 'components/shared/Radios/Radios';
import Button from 'components/shared/Button/Button';
import { GlobalContext } from 'globalState';
import ContactUsReducer from 'globalState/ContactUsContext/ContactUsReducer';

const ContactUs = () => {
  const { dashboard, continueNext } = useContext(GlobalContext);
  console.log(dashboard);
  const [questionVal, setQuestionVal] = useState(null);

  const handleChange = (e) => {
    console.log('changed', e.target);
    return setQuestionVal(e.target.id);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    console.log('clicked');
    return continueNext(questionVal);
  };
  return (
    <div className="wmnds-container">
      <a href="/" title="link title" target="_self" className="wmnds-link">
        <span>&lt; Back</span>
      </a>
      <form className="wmnds-bg-white wmnds-p-lg">
        <h2 className="wmnds-fe-question">{dashboard.heading}</h2>
        {dashboard.description ? (
          <div>{dashboard.description}</div>
        ) : (
          <Radios
            name="Enquiry"
            classes="wmnds-m-b-sm"
            radios={dashboard.fields}
            // fieldValidation={register({
            //   required: `Please select one option to proceed`,
            // })}
            onChange={handleChange}
          />
        )}
        <Button text="Continue" type="submit" onClick={handleContinue}>
          Continue
        </Button>
      </form>
    </div>
  );
};

export default ContactUs;
