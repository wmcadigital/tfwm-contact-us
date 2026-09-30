/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

import GetMap from 'components/shared/Map/Map';

import React, { useContext, useState } from 'react';

import { FormDataContext } from '../../../globalState';

import classes from '../../App.module.scss';
import Data from '../../ContactUs/newData.json';

const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

const CheckYourAnswers = () => {
  const [{ formData, stepNum, formId }, formDispatch] = useContext(FormDataContext);
  // Normalize `formData` into a flat object with camelCase keys
  const toCamelCase = (str = '') =>
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
  const formatDisplayValueForField = (value, fieldKey = '', answerTitle = '') => {
    if (typeof value !== 'string') return value;
    const isPhoneField =
      /phone|telephone|mobile/i.test(fieldKey) || /phone|telephone|mobile/i.test(answerTitle);
    return isPhoneField && /\d/.test(value) ? formatPhoneNumber(value) : value;
  };

  const buildSubmissionData = (data) => {
    if (!data || typeof data !== 'object') return {};

    // Aliases for the "change" questions: when answered "Yes", the section's data
    // is sent under the alias (e.g. update-name -> changeName) instead of the
    // generic keys.
    const CHANGE_ALIAS_MAP = {
      'update-name': 'changeName',
      'update-address': 'changeAddress',
      'update-email': 'changeEmail',
      'update-phone': 'changePhone',
    };
    const isYesAnswer = (item) =>
      Array.isArray(item.value) &&
      item.value.some((pair) => /^yes-or-no(-skip)?$/.test(pair[0]) && pair[1] === 'Yes');
    const changedSectionAliases = Object.keys(data).reduce((accumulator, key) => {
      if (CHANGE_ALIAS_MAP[key] && isYesAnswer(data[key])) accumulator[key] = CHANGE_ALIAS_MAP[key];
      return accumulator;
    }, {});

    return Object.keys(data).reduce((accumulator, key) => {
      const item = data[key];
      if (!item || !Array.isArray(item.value)) return accumulator;

      const stripCcPrefix = (k) => k.replace(/^CC-/i, '');

      // "Change" questions answered "Yes" are emitted under their alias
      if (changedSectionAliases[key]) {
        if (key === 'update-name') {
          const firstNamePair = item.value.find((pair) =>
            /^first[-_]?name$/i.test(stripCcPrefix(pair[0]))
          );
          const lastNamePair = item.value.find((pair) =>
            /^last[-_]?name$/i.test(stripCcPrefix(pair[0]))
          );
          if (firstNamePair && firstNamePair[1]) accumulator.newFirstName = firstNamePair[1];
          if (lastNamePair && lastNamePair[1]) accumulator.newLastName = lastNamePair[1];
        } else if (key === 'update-email') {
          const emailPair = item.value.find((pair) => /^email$/i.test(stripCcPrefix(pair[0])));
          if (emailPair && emailPair[1]) accumulator.changeEmail = emailPair[1];
        } else if (key === 'update-phone') {
          const phonePair = item.value.find((pair) =>
            /^phone[-_]?name$/i.test(stripCcPrefix(pair[0]))
          );
          if (phonePair && phonePair[1]) accumulator.changePhone = formatPhoneNumber(phonePair[1]);
        }
        return accumulator;
      }

      // The updated address is collected in the separate `address` section
      if (key === 'address' && changedSectionAliases['update-address']) {
        const addr = {};
        item.value.forEach((pair) => {
          if (pair[0]) addr[toCamelCase(pair[0])] = pair[1];
        });
        if (Object.keys(addr).length > 0) accumulator.changeAddress = addr;
        return accumulator;
      }

      // Handle name specially (firstName / lastName)
      const nameFieldKeys = item.value.map((pair) => pair[0]);
      const isNameSection =
        nameFieldKeys.some((k) => /^first[-_]?name$/i.test(k)) &&
        nameFieldKeys.some((k) => /^last[-_]?name$/i.test(k));
      if (isNameSection && item.value.length >= 2) {
        const firstNamePair = item.value.find((pair) => /^first[-_]?name$/i.test(pair[0]));
        const lastNamePair = item.value.find((pair) => /^last[-_]?name$/i.test(pair[0]));
        accumulator.firstName = (firstNamePair && firstNamePair[1]) || accumulator.firstName;
        accumulator.lastName = (lastNamePair && lastNamePair[1]) || accumulator.lastName;
        return accumulator;
      }
      // Handle email specially
      const isEmailKey = (pair) => {
        const k = pair[0].replace(/^CC-/i, '');
        return /email/i.test(k) && !/^pref-?email(-address)?$/i.test(k);
      };
      if (
        (/email/i.test(item.answerTitle || key) || item.value.some(isEmailKey)) &&
        item.value.length >= 1
      ) {
        const emailPair =
          item.value.find(isEmailKey) || item.value.find((pair) => pair[0] !== 'yes-or-no-skip');
        if (emailPair && EMAIL_REGEX.test(emailPair[1])) {
          accumulator.emailAddress = emailPair[1] || accumulator.emailAddress;
        }
        return accumulator;
      }
      // Handle file uploader specially
      if (/file|upload|document/i.test(item.answerTitle || key) && item.value.length >= 1) {
        const uploadedFilesArray = item.value[0][1];
        if (
          uploadedFilesArray &&
          Array.isArray(uploadedFilesArray) &&
          uploadedFilesArray.length > 0
        ) {
          accumulator.files = uploadedFilesArray.map((file) => ({
            name: file.name,
            type: file.type,
            content: file, // will be converted to base64 later
          }));
        }
        return accumulator;
      }

      item.value.forEach((pair) => {
        const fieldKey = pair[0];
        let value = pair[1];
        if (!fieldKey || fieldKey === 'yes-or-no-skip') return;

        // Format phone numbers with +44
        // Matches: phone, telephone, mobile, pref-phone, CC-phone-name, CC-pref-phone-name, etc.
        const isPhoneField =
          /phone|telephone|mobile/i.test(fieldKey) ||
          /phone|telephone|mobile/i.test(item.answerTitle || key);
        if (isPhoneField && typeof value === 'string' && /\d/.test(value)) {
          value = formatPhoneNumber(value);
        }

        // Strip the "CC-" prefix (used for "updated" details on pass forms)
        // so the API receives e.g. firstName, not ccFirstName.
        const cleanFieldKey = fieldKey.replace(/^CC-/i, '');

        const propertyName = toCamelCase(cleanFieldKey) || toCamelCase(item.answerTitle || key);

        if (accumulator[propertyName]) {
          if (Array.isArray(accumulator[propertyName])) accumulator[propertyName].push(value);
          else accumulator[propertyName] = [accumulator[propertyName], value];
        } else {
          accumulator[propertyName] = value;
        }
      });
      return accumulator;
    }, {});
  };

  const encodeDataToBase64 = (data) => {
    const jsonString = JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(jsonString)));
  };
  const submissionData = buildSubmissionData(formData);
  const submissionDataBase64 = encodeDataToBase64(submissionData);
  const urlHashParams = window.location.hash.slice(2);
  const targetStepId = formId || urlHashParams;
  const [errorMessage, setErrorMessage] = useState('');

  const currentPage =
    Data?.pages?.find((pageData) => pageData.currentStepId === targetStepId) || {};
  const { emailIndex } = Data.pages.find((pageData) => pageData.currentStepId === targetStepId);
  const { emailHeader = '', text = '' } = currentPage;
  const goBack = () => {
    formDispatch({
      type: 'CHANGE-PAGE',
      payload: { page: 'COMPLAINT', stepNum, pageType: '' },
    });
  };
  const goToChangeStep = (stepNumber) => {
    formDispatch({
      type: 'CHANGE-PAGE',
      payload: { page: 'COMPLAINT', stepNum: stepNumber, pageType: 'change' },
    });
  };

  // returns the base64 string of files
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const sendEmail = async () => {
    const answersContainerEl = document.getElementById('answers-container');

    // replace map with google maps link
    if (formData.address && formData.address.value[0][1].indexOf('www.google.com') !== -1) {
      document.getElementById('answerMapDiv').replaceWith(formData.address.value[0][1]);
    }
    // remove change button
    const editedText = answersContainerEl.outerHTML.replaceAll(
      '<td data-header="Header 2" style="vertical-align: top; width: 70px; text-align: right;"><button type="button" class="wmnds-btn wmnds-btn--link">Change</button></td>',
      ''
    );

    const file = formData.file ? formData.file.value[0][1][0] : undefined;
    let base64File;
    let attachments;

    if (file) {
      base64File = await fileToBase64(file);
      attachments = [{ name: file.name, type: file.type, content: base64File.split('base64,')[1] }];
    }

    let fetchResponse;
    // console.log(emailIndex);
    try {
      fetchResponse = await fetch(`${process.env.REACT_APP_EMAIL_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 7,
          subject: emailHeader,
          body: '{"M":"j"}',
          bodyHtml: submissionDataBase64,
          from: 'donotreply@tfwm.org.uk',
          files: file ? attachments : [],
          displayName: formData.name
            ? `${formData.name.value[0][1]} ${formData.name.value[1][1]}`
            : 'No Name',
        }),
      });
    } catch (e) {
      return false;
    }

    return fetchResponse.status === 200;
  };
  const handleCheckboxes = async () => {
    const checkboxOptions = [...document.querySelectorAll(`.checkox-option`)];

    const checkedBoxes = [...document.querySelectorAll(`input:checked`)];
    if (checkedBoxes.length < checkboxOptions.length) {
      setErrorMessage(
        `Please select ${urlHashParams === 'step-update-DD' ? 'all' : 'both'}  options`
      );
    } else {
      const success = await sendEmail();
      if (success) {
        formDispatch({
          type: 'CHANGE-PAGE',
          payload: { page: 'SUCCESS', stepNum },
        });
        setErrorMessage('');
      } else {
        setErrorMessage('Sorry, there was a problem sending your form. Please try again.');
      }
    }
  };

  const parseCoords = (value) => {
    const coords = value.split('query=')[1].split(',');

    return coords;
  };
  const groupedAnswers = Object.values(formData).reduce(
    (groups, item) => ({
      ...groups,
      [item.section]: [...(groups[item.section] || []), item],
    }),
    {}
  );
  const sectionEntries = Object.entries(groupedAnswers);

  return (
    <div className="wmnds-container wmnds-container--main">
      <div className="wmnds-col-1 wmnds-m-b-md">
        <button type="button" className="wmnds-btn wmnds-btn--link" onClick={goBack}>
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
          {sectionEntries.map((answers) => (
            <React.Fragment key={answers[0]}>
              <h3>{answers[0]}</h3>
              <table className="wmnds-table wmnds-table--without-header">
                <tbody>
                  {answers[1].map((data) => (
                    <tr key={data.answerTitle}>
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
                              lat={parseCoords(data.value[0][1])[1]}
                              lang={parseCoords(data.value[0][1])[0]}
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
                                <React.Fragment key={value[0]}>
                                  {value[0] !== 'yes-or-no-skip' && value[1] === 'Yes' ? (
                                    ''
                                  ) : (
                                    <>
                                      {formatDisplayValueForField(
                                        value[1],
                                        value[0],
                                        data.answerTitle
                                      )}{' '}
                                      <br />
                                    </>
                                  )}
                                </React.Fragment>
                              ))}
                            </>
                          )}
                        {data.answerTitle === 'Contact preference' && (
                          <>
                            {data.value.map((value) => (
                              <React.Fragment key={value[0]}>
                                {value[0] !== 'CC-pref-phone-name' &&
                                value[0] !== 'CC-pref-email-address' ? (
                                  ''
                                ) : (
                                  <>
                                    {formatDisplayValueForField(
                                      value[1],
                                      value[0],
                                      data.answerTitle
                                    )}{' '}
                                    <br />
                                  </>
                                )}
                              </React.Fragment>
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
                        }}
                      >
                        <button
                          type="button"
                          className="wmnds-btn wmnds-btn--link"
                          onClick={() => goToChangeStep(data.stepNum)}
                        >
                          Change
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </React.Fragment>
          ))}
        </div>

        <h3>Now send your request</h3>
        <p>
          By submitting this request you are confirming that, to the best of your knowledge, the
          details you are providing are correct.
        </p>

        <div className="wmnds-fe-group">
          <div className="wmnds-fe-checkboxes">
            {urlHashParams === 'step-update-DD' && (
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
        {errorMessage && <span className="wmnds-fe-error-message">{errorMessage}</span>}
        <button className="wmnds-btn wmnds-btn--start" type="button" onClick={handleCheckboxes}>
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
