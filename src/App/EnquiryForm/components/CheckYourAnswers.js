/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

import GetMap from 'components/shared/Map/Map';

import React, { useContext, useState, useEffect, useRef } from 'react';

import { FormDataContext } from '../../../globalState';

import classes from '../../App.module.scss';
import Data from '../../ContactUs/newData.json';

const CheckYourAnswers = () => {
  const [{ formData, stepNum, formId }, formDispatch] = useContext(FormDataContext);
  // JSON-schema-like representation derived from `formData`
  const formDataSchema = {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
        description:
          formData && formData.name
            ? formData.name.answerTitle || "The person's first name"
            : "The person's first name",
      },
      lastName: {
        type: 'string',
        description:
          formData && formData.name
            ? formData.name.answerTitle || "The person's last name"
            : "The person's last name",
      },
      emailAddress: {
        type: 'string',
        format: 'email',
        description:
          formData && formData.email
            ? formData.email.answerTitle || "The person's email address"
            : "The person's email address",
      },
    },
  };
  // Normalize `formData` into a flat object with camelCase keys
  const toCamel = (str = '') =>
    String(str)
      .replace(/[^a-zA-Z0-9 ]+/g, ' ')
      .trim()
      .split(/[\s-_]+/)
      .map((s, i) => (i === 0 ? s.toLowerCase() : s.charAt(0).toUpperCase() + s.slice(1)))
      .join('');

  // Helper function to format phone numbers with +44
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || typeof phoneNumber !== 'string') return phoneNumber;

    const trimmed = phoneNumber.trim();
    // If it already starts with +44 or +, return as is
    if (trimmed.startsWith('+')) return trimmed;
    // If it starts with 0, replace with +44
    if (trimmed.startsWith('0')) return `+44${trimmed.substring(1)}`;
    // Otherwise, prepend +44
    return `+44${trimmed}`;
  };

  // Helper function to format value for display if it's a phone field
  const formatDisplayValue = (value, fieldKey = '', answerTitle = '') => {
    if (typeof value !== 'string') return value;
    const isPhoneField =
      /phone|telephone|mobile/i.test(fieldKey) || /phone|telephone|mobile/i.test(answerTitle);
    return isPhoneField && /\d/.test(value) ? formatPhoneNumber(value) : value;
  };

  const buildNormalizedData = (data) => {
    if (!data || typeof data !== 'object') return {};

    return Object.keys(data).reduce((acc, key) => {
      const item = data[key];
      if (!item || !Array.isArray(item.value)) return acc;

      // Handle name specially (firstName / lastName)
      const nameKeys = item.value.map((pair) => pair[0]);
      const isNameSection =
        nameKeys.some((k) => /^first[-_]?name$/i.test(k)) &&
        nameKeys.some((k) => /^last[-_]?name$/i.test(k));
      if (isNameSection && item.value.length >= 2) {
        const firstNamePair = item.value.find((pair) => /^first[-_]?name$/i.test(pair[0]));
        const lastNamePair = item.value.find((pair) => /^last[-_]?name$/i.test(pair[0]));
        acc.firstName = (firstNamePair && firstNamePair[1]) || acc.firstName;
        acc.lastName = (lastNamePair && lastNamePair[1]) || acc.lastName;
        return acc;
      }
      // Handle email specially
      const emailKeyMatch = (pair) => {
        const k = pair[0].replace(/^CC-/i, '');
        return /email/i.test(k) && !/^pref-?email$/i.test(k);
      };
      if (
        (/email/i.test(item.answerTitle || key) || item.value.some(emailKeyMatch)) &&
        item.value.length >= 1
      ) {
        const emailPair =
          item.value.find(emailKeyMatch) || item.value.find((pair) => pair[0] !== 'yes-or-no-skip');
        if (emailPair) {
          acc.emailAddress = emailPair[1] || acc.emailAddress;
        }
        return acc;
      }
      // Handle file uploader specially
      if (/file|upload|document/i.test(item.answerTitle || key) && item.value.length >= 1) {
        const fileArray = item.value[0][1];
        if (fileArray && Array.isArray(fileArray) && fileArray.length > 0) {
          acc.files = fileArray.map((file) => ({
            name: file.name,
            type: file.type,
            content: file, // will be converted to base64 later
          }));
        }
        return acc;
      }

      item.value.forEach((pair) => {
        const subKey = pair[0];
        let val = pair[1];
        if (!subKey || subKey === 'yes-or-no-skip') return;

        // Format phone numbers with +44
        // Matches: phone, telephone, mobile, pref-phone, CC-phone-name, CC-pref-phone-name, etc.
        const isPhoneField =
          /phone|telephone|mobile/i.test(subKey) ||
          /phone|telephone|mobile/i.test(item.answerTitle || key);
        if (isPhoneField && typeof val === 'string' && /\d/.test(val)) {
          val = formatPhoneNumber(val);
        }

        // Strip the "CC-" prefix (used for "updated" details on pass forms)
        // so the API receives e.g. firstName, not ccFirstName.
        const cleanSubKey = subKey.replace(/^CC-/i, '');

        const prop = toCamel(cleanSubKey) || toCamel(item.answerTitle || key);

        if (acc[prop]) {
          if (Array.isArray(acc[prop])) acc[prop].push(val);
          else acc[prop] = [acc[prop], val];
        } else {
          acc[prop] = val;
        }
      });

      return acc;
    }, {});
  };

  const normalizedDataToBase64 = (data) => {
    const jsonString = JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(jsonString)));
  };

  const normalizedFormData = buildNormalizedData(formData);
  const normalizedFormData2 = normalizedDataToBase64(normalizedFormData);
  const params = window.location.hash.slice(2);
  const formToLoad = formId || params;
  const [errorMsg, setErrorMsg] = useState('');

  // Debug logging for Netlify production issues
  useEffect(() => {
    console.log('Debug Info:', {
      formToLoad,
      formId,
      params,
      dataAvailable: !!Data,
      dataPages: Data?.pages?.length || 0,
      matchedPage: Data?.pages?.find((p) => p.currentStepId === formToLoad),
    });
  }, [formToLoad, formId, params]);

  const currentPage = Data?.pages?.find((pageData) => pageData.currentStepId === formToLoad) || {};
  const { emailIndex = '', emailHeader = '', text = '' } = currentPage;
  const [subject, setSubject] = useState('');
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

    // const base64Content = editedText && btoa(unescape(encodeURIComponent(editedText)));
    const base64Content = normalizedDataToBase64(normalizedFormData);
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

    let response;
    try {
      response = await fetch(`${process.env.REACT_APP_EMAIL_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailIndex,
          subject: emailHeader,
          body: '{"M":"j"}',
          bodyHtml: normalizedFormData2,
          from: 'donoreply@tfwm.org.uk',
          files: file ? fileData : [],
          displayName: formData.name
            ? `${formData.name.value[0][1]} ${formData.name.value[1][1]}`
            : 'No Name',
        }),
      });
    } catch (e) {
      return false;
    }

    return response.status === 200;
  };

  const checkboxHandler = async () => {
    const checkboxes = [...document.querySelectorAll(`.checkox-option`)];

    const findCheckedBoxes = [...document.querySelectorAll(`input:checked`)];
    if (findCheckedBoxes.length < checkboxes.length) {
      setErrorMsg(`Please select ${params === 'step-update-DD' ? 'all' : 'both'}  options`);
    } else {
      const success = await sendEmailHandler();
      if (success) {
        formDispatch({
          type: 'CHANGE-PAGE',
          payload: { page: 'SUCCESS', stepNum },
        });
        setErrorMsg('');
      } else {
        setErrorMsg('Sorry, there was a problem sending your form. Please try again.');
      }
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
        {emailHeader !== '' && (
          <p>
            <strong>{emailHeader}</strong>
          </p>
        )}
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
                                      {formatDisplayValue(value[1], value[0], data.answerTitle)}{' '}
                                      <br />
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
                                    {formatDisplayValue(value[1], value[0], data.answerTitle)}{' '}
                                    <br />
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
          <div className="wmnds-fe-checkboxes">
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
        {errorMsg && <span className="wmnds-fe-error-message">{errorMsg}</span>}
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
