/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

import GetMap from 'components/shared/Map/Map';

import React, { useContext, useState, useEffect, useRef } from 'react';

import { FormDataContext } from '../../../globalState';

import classes from '../../App.module.scss';
import Data from '../../ContactUs/newData.json';

const CheckYourAnswers = () => {
  const [{ formData, stepNum, formId }, formDispatch] = useContext(FormDataContext);
  const params = window.location.hash.slice(2);
  const formToLoad = formId || params;
  const [errorMsg, setErrorMsg] = useState('');
  const { emailIndex } = Data.pages.find((pageData) => pageData.currentStepId === formToLoad);
  const { emailHeader } = Data.pages.find((pageData) => pageData.currentStepId === formToLoad);
  const emails = [
    'swiftsupport@tfwm.org.uk',
    'ticketing@tfwm.org.uk',
    'customerservices@tfwm.org.uk',
    'swiftcorporate@tfwm.org.uk',
  ];
  const prevStep = () => {
    formDispatch({
      type: 'CHANGE-PAGE',
      payload: { page: 'COMPLAINT', stepNum, pageType: '' },
    });
  };
  const changeForm = (stepNumber) => {
    formDispatch({
      type: 'CHANGE-PAGE',
      payload: { page: 'COMPLAINT', stepNum: stepNumber, pageType: 'change' },
    });
  };
  // returns the base64 string of files
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const sendEmailHandler = async () => {
    const checkAnswersEl = document.getElementById('answers-container');

    // replace map with google maps link
    if (formData.address && formData.address.value[0][1].indexOf('www.google.com') !== -1) {
      document.getElementById('answerMapDiv').replaceWith(formData.address.value[0][1]);
    }
    // remove change button
    const editedText = checkAnswersEl.outerHTML.replaceAll(
      '<td data-header="Header 2" style="vertical-align: top; width: 70px; text-align: right;"><button type="button" class="wmnds-btn wmnds-btn--link">Change</button></td>',
      ''
    );

    const base64Content = editedText && btoa(unescape(encodeURIComponent(editedText)));
    const file = formData.file ? formData.file.value[0][1][0] : undefined;
    let base64File;
    let fileData;

    if (file) {
      base64File = await toBase64(file);
      fileData = [{ name: file.name, type: file.type, content: base64File.split('base64,')[1] }];
    }
    const answerObject = {};
    const dataMap = formData;
    delete dataMap.file;
    const extract = Object.keys(formData).map((key) => {
      let sectionTitle = '';
      sectionTitle = formData[key].answerTitle;
      const sectionValues =
        formData[key].value.length < 2
          ? formData[key].value[0][1]
          : `${formData[key].value[0][1]} ${formData[key].value[1][1]}`;
      formData[key].value.map((i) => {
        return i;
      });
      let sectionValuesEdited = sectionValues.toString();
      if (sectionValuesEdited.includes('Yes')) {
        sectionValuesEdited = sectionValuesEdited.substring(4);
      }
      answerObject[sectionTitle] = sectionValuesEdited;
      return answerObject;
    });
    const postData = await fetch(`https://internal-api.wmca.org.uk/emails/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        to: emailIndex,
        subject: emailHeader,
        body: '{"M":"j"}',
        bodyHtml: base64Content,
        from: formData.contact ? formData.contact.value[0][1] : 'test@test.com',
        files: file ? fileData : [],
      }),
    }).then((response) => {
      // If the response is successful(200: OK)
      if (response.status === 200) {
        formDispatch({
          type: 'CHANGE-PAGE',
          payload: { page: 'SUCCESS', stepNum },
        });
      }
    });
  };

  const checkboxHandler = async () => {
    const checkboxes = [...document.querySelectorAll(`.checkox-option`)];

    const findCheckedBoxes = [...document.querySelectorAll(`input:checked`)];
    if (findCheckedBoxes.length < checkboxes.length) {
      setErrorMsg(`Please select ${params === 'step-update-DD' ? 'all' : 'both'}  options`);
    } else {
      await sendEmailHandler();

      formDispatch({
        type: 'CHANGE-PAGE',
        payload: { page: 'SUCCESS', stepNum },
      });
      setErrorMsg('');
    }
  };

  const getCoords = (value) => {
    const coords = value.split('query=')[1].split(',');

    return coords;
  };
  const groupBySection = Object.values(formData).reduce(
    (groups, item) => ({
      ...groups,
      [item.section]: [...(groups[item.section] || []), item],
    }),
    {}
  );
  const formAnswers = Object.entries(groupBySection);

  return (
    <div className="wmnds-container wmnds-container--main">
      <div className="wmnds-col-1 wmnds-m-b-md">
        <button type="button" className="wmnds-btn wmnds-btn--link" onClick={prevStep}>
          &lt; Back
        </button>
      </div>
      <div
        className="bg-white wmnds-p-lg"
        id="check-your-answers"
        style={{ maxWidth: '40rem', backgroundColor: 'white' }}
      >
        <h2 className=" wmnds-m-t-lg">Check your answers</h2>
        <div id="answers-container" style={{ textAlign: 'left' }}>
          {formAnswers.map((answers) => (
            <>
              <h3>{answers[0]}</h3>
              <table className="wmnds-table wmnds-table--without-header">
                <tbody>
                  {answers[1].map((data) => (
                    <tr>
                      <th
                        scope="row"
                        data-header="Header 1"
                        style={{ verticalAlign: 'top', width: 192 }}
                      >
                        {data.answerTitle || 'Answer'}
                      </th>
                      <td data-header="Header 2" style={{ verticalAlign: 'top' }}>
                        {data.answerTitle === 'Supporting documents' &&
                          (data.value[0][1].length === 0 ? (
                            'None'
                          ) : (
                            <>
                              {data.value[0][1][0].type === 'application/pdf' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <img src="/pdf-icon.svg" alt="pdf logo" width={20} height={20} />
                                  <p style={{ marginBottom: 0 }}>{data.value[0][1][0].name}</p>
                                </div>
                              ) : (
                                <img
                                  src={URL.createObjectURL(data.value[0][1][0])}
                                  alt="File"
                                  style={{ marginTop: 20 }}
                                  width={200}
                                  height={200}
                                />
                              )}
                            </>
                          ))}
                        {data.answerTitle === 'What was the date and time of the issue?' && (
                          <>
                            {data.value[0][1]}:{data.value[1][1]}
                            <br />
                            {data.value[2][1]}/{data.value[3][1]}/{data.value[4][1]}
                          </>
                        )}
                        {data.answerTitle === 'Date of birth' && (
                          <>
                            {data.value[0][1]}/{data.value[1][1]}/{data.value[2][1]}
                          </>
                        )}
                        {data.answerTitle === 'Name' && (
                          <>
                            {data.value[0][1]} {data.value[1][1]}
                          </>
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
                        {data.answerTitle !== 'Name' &&
                          data.answerTitle !== 'Date of birth' &&
                          data.answerTitle !== 'Supporting documents' &&
                          data.answerTitle !== 'Contact preference' &&
                          data.answerTitle !== 'What was the date and time of the issue?' &&
                          data.value[0][0] !== 'postcode' && (
                            <>
                              {data.value.map((value) => (
                                <>
                                  {value[0] !== 'yes-or-no-skip' && value[1] === 'Yes' ? (
                                    ''
                                  ) : (
                                    <>
                                      {value[1]} <br />
                                    </>
                                  )}
                                </>
                              ))}
                            </>
                          )}
                        {data.answerTitle === 'Contact preference' && (
                          <>
                            {data.value.map((value) => (
                              <>
                                {value[0] !== 'CC-pref-phone-name' &&
                                value[0] !== 'CC-pref-email-address' ? (
                                  ''
                                ) : (
                                  <>
                                    {value[1]} <br />
                                  </>
                                )}
                              </>
                            ))}
                          </>
                        )}
                      </td>
                      <td
                        data-header="Header 2"
                        style={{
                          verticalAlign: 'top',
                          width: 70,
                          textAlign: 'right',
                          '@media (max-width: 768)': {
                            textAlign: 'left',
                          },
                        }}
                      >
                        <button
                          type="button"
                          className="wmnds-btn wmnds-btn--link"
                          onClick={() => changeForm(data.stepNum)}
                        >
                          Change
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ))}
        </div>

        <h3>Now send your request</h3>
        <p>
          By submitting this request you are confirming that, to the best of your knowledge, the
          details you are providing are correct.
        </p>

        <div className="wmnds-fe-group">
          <div className={`wmnds-fe-checkboxes ${errorMsg && 'wmnds-fe-group--error'}`}>
            {errorMsg && <span className="wmnds-fe-error-message">{errorMsg}</span>}
            {params === 'step-update-DD' && (
              <div>
                <label className="wmnds-fe-checkboxes__container" htmlFor="checkboxes_option0">
                  Please pay West Midlands Combined Authority Direct Debits from the account
                  detailed in this Instruction subject to the safeguards assured by the
                  <button
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      color: '#1d7bbf',
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                    }}
                    onClick={() => {
                      formDispatch({
                        type: 'CHANGE-PAGE',
                        payload: { page: 'DIRECT-DEBIT-GUARANTEE', stepNum },
                      });
                    }}
                    type="button"
                  >
                    <a href="#">Direct Debit Guarantee</a>
                  </button>
                  . I understand that this Instruction may remain with West Midlands Combined
                  Authority and, if so, details will be passed electronically to my bank/building
                  society.
                  <input
                    id="checkboxes_option0"
                    className="wmnds-fe-checkboxes__input checkox-option"
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
                <img
                  src="/direct-debit-logo.png"
                  alt="direct debit logo"
                  className={classes.ddLogo}
                  style={{ transform: 'scale(0.6)', marginLeft: '30px', marginBottom: '20px' }}
                />
              </div>
            )}

            <label className="wmnds-fe-checkboxes__container" htmlFor="checkboxes_option1">
              Agree to the{' '}
              <a
                href="https://www.tfwm.org.uk/terms-and-conditions/transport-for-west-midlands-website/"
                target="_blank"
                rel="noreferrer"
              >
                terms and conditions
              </a>
              <input
                id="checkboxes_option1"
                className="wmnds-fe-checkboxes__input checkox-option"
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
              <a
                href="https://www.tfwm.org.uk/policies/privacy-and-cookies-policy/"
                target="_blank"
                rel="noreferrer"
              >
                privacy policy
              </a>
              <input
                id="checkboxes_option2"
                className="wmnds-fe-checkboxes__input checkox-option"
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
        <button className="wmnds-btn wmnds-btn--start" type="button" onClick={checkboxHandler}>
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
