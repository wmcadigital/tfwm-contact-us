import GetMap from 'components/shared/Map/Map';
import React, { useContext, useState } from 'react';

import { FormDataContext } from '../../../globalState';

import classes from '../../App.module.scss';

const CheckYourAnswers = () => {
  const [{ formData, stepNum }, formDispatch] = useContext(FormDataContext);
  const [errorMsg, setErrorMsg] = useState('');
  const prevStep = () => {
    formDispatch({
      type: 'CHANGE-PAGE',
      payload: { page: 'COMPLAINT', stepNum },
    });
  };
  const changeForm = (stepNumber) => {
    formDispatch({
      type: 'CHANGE-PAGE',
      payload: { page: 'COMPLAINT', stepNum: stepNumber },
    });
  };

  const checkCheckboxes = () => {
    const findCheckedBoxes = [...document.querySelectorAll(`input:checked`)];
    if (findCheckedBoxes.length < 2) {
      setErrorMsg('Please select both options');
    } else {
      formDispatch({
        type: 'CHANGE-PAGE',
        payload: { page: 'SUCCESS', stepNum },
      });
      setErrorMsg('');
      // sendEmailHandler();
    }
  };

  const formDataArray = Object.values(formData).filter((data) => data.answerTitle);
  console.log(formDataArray);
  const getCoords = (value) => {
    const coords = value.split('query=')[1].split(',');

    return coords;
  };
  return (
    <div className="wmnds-container wmnds-container--main">
      <div className="wmnds-col-1 wmnds-m-b-md">
        <button type="button" className="wmnds-btn wmnds-btn--link" onClick={prevStep}>
          &lt; Back
        </button>
      </div>
      <div className="bg-white wmnds-p-lg" style={{ width: '40rem', backgroundColor: 'white' }}>
        <h2 className=" wmnds-m-t-lg">Check your answers</h2>
        <h3>About you</h3>
        <table className="wmnds-table wmnds-table--without-header">
          <tbody>
            <tr>
              <th scope="row" data-header="Header 1">
                Name
              </th>
              <td data-header="Header 2">
                {formData.name.value[0][1]} {formData.name.value[0][1]}
              </td>
              <td data-header="Header 2">
                <button
                  type="button"
                  className={`wmnds-btn wmnds-btn--link ${classes.floatRight}`}
                  style={{ float: 'right' }}
                  onClick={() => changeForm(formData.name.stepNum)}
                >
                  Change
                </button>
              </td>
            </tr>
            <tr>
              <th scope="row" data-header="Header 1">
                How would you like to be contacted?
              </th>
              <td data-header="Header 2">
                {formData.contact.value.map((contact) => (
                  <>
                    <span>
                      {contact[0] === 'phone' ? 'Phone' : 'Email'} <br /> {contact[1]}
                    </span>
                    <br />
                  </>
                ))}
              </td>
              <td data-header="Header 2">
                <button
                  type="button"
                  className={`wmnds-btn wmnds-btn--link ${classes.floatRight}`}
                  style={{ float: 'right' }}
                  onClick={() => changeForm(formData.contact.stepNum)}
                >
                  Change
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <h3>Your enquiry</h3>
        <table className="wmnds-table wmnds-table--without-header">
          <tbody>
            {formDataArray.map((data) => (
              <tr>
                <th scope="row" data-header="Header 1">
                  {data.answerTitle}
                </th>
                <td data-header="Header 2">
                  {data.answerTitle === 'Supporting documents' && (
                    <img
                      src={URL.createObjectURL(data.value[0][1][0])}
                      alt="File"
                      style={{ marginTop: 20 }}
                      width={200}
                      height={200}
                    />
                  )}
                  {data.value[0][0] === 'postcode' && (
                    <>
                      {data.value[1][1]}
                      <br />

                      <GetMap
                        lat={getCoords(data.value[0][1])[1]}
                        lang={getCoords(data.value[0][1])[0]}
                      />
                    </>
                  )}
                  {data.answerTitle !== 'Supporting documents' && data.value[0][0] !== 'postcode' && (
                    <>
                      {data.value.map((value) => (
                        <>
                          {value[1]} <br />
                        </>
                      ))}
                    </>
                  )}
                </td>
                <td data-header="Header 2">
                  <button
                    type="button"
                    className={`wmnds-btn wmnds-btn--link `}
                    style={{ float: 'right' }}
                    onClick={() => changeForm(data.stepNum)}
                  >
                    Change
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Now send your complaint</h3>
        <p>
          By submitting this complaint you are confirming that, to the best of your knowledge, the
          details you are providing are correct.
        </p>

        <div className="wmnds-fe-group">
          <div className={`wmnds-fe-checkboxes ${errorMsg && 'wmnds-fe-group--error'}`}>
            {errorMsg && <span className="wmnds-fe-error-message">{errorMsg}</span>}
            <label className="wmnds-fe-checkboxes__container" htmlFor="checkboxes_option1">
              Agree to the{' '}
              <a href="https://www.tfwm.org.uk/terms-and-conditions/transport-for-west-midlands-website/">
                terms and conditions
              </a>
              <input
                id="checkboxes_option1"
                className="wmnds-fe-checkboxes__input"
                value="terms-and-conditions"
                name="checkbox-example"
                type="checkbox"
              />
              <span className="wmnds-fe-checkboxes__checkmark">
                <svg className="wmnds-fe-checkboxes__icon">
                  <use xlinkHref="#wmnds-general-checkmark" href="#wmnds-general-checkmark" />
                </svg>
              </span>
            </label>
            <label className="wmnds-fe-checkboxes__container" htmlFor="checkboxes_option2">
              Agree to the{' '}
              <a href="https://www.tfwm.org.uk/policies/privacy-and-cookies-policy/">
                privacy policy
              </a>
              <input
                id="checkboxes_option2"
                className="wmnds-fe-checkboxes__input"
                value="privacy-policy"
                name="checkbox-example"
                type="checkbox"
              />
              <span className="wmnds-fe-checkboxes__checkmark">
                <svg className="wmnds-fe-checkboxes__icon">
                  <use xlinkHref="#wmnds-general-checkmark" href="#wmnds-general-checkmark" />
                </svg>
              </span>
            </label>
          </div>
        </div>
        <button className="wmnds-btn wmnds-btn--start" type="button" onClick={checkCheckboxes}>
          Accept and send
          <svg className="wmnds-btn__icon wmnds-btn__icon--right ">
            <use xlinkHref="#wmnds-general-chevron-right" href="#wmnds-general-chevron-right" />
          </svg>
        </button>
      </div>
    </div>
  );
};
export default CheckYourAnswers;
