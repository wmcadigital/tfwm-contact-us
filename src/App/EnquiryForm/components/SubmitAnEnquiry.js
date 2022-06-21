import React, { useContext } from 'react';
import { FormDataContext } from 'globalState';
import dompurify from 'dompurify';

import Data from '../../ContactUs/newData.json';

const { sanitize } = dompurify;

const SubmitAnEnquiry = () => {
  const [{ formId }, formDispatch] = useContext(FormDataContext);
  const { formStartContent } = Data.pages.find((page) => page.currentStepId === formId);

  return (
    <div className="wmnds-container wmnds-container--main ">
      {' '}
      <h1 className=" wmnds-m-t-xs wmnds-m-b-xs">
        {formStartContent ? formStartContent.title : 'Submit an enquiry'}
      </h1>
      <h2 className="wmnds-p-t-md wmnds-m-t-xs">Use this service to:</h2>
      <p>{formStartContent ? formStartContent.serviceUse : '• Contact Customer Services'}</p>
      <p>
        {formStartContent ? formStartContent.processTime : 'This process takes around 5 minutes.'}
      </p>
      {formStartContent && (
        <div
          dangerouslySetInnerHTML={{
            __html: sanitize(formStartContent.children),
          }}
        />
      )}
      <button
        className="wmnds-btn wmnds-btn--start"
        onClick={() =>
          formDispatch({
            type: 'CHANGE-PAGE',
            payload: { page: 'COMPLAINT', stepNum: 0 },
          })
        }
        type="button"
      >
        Start now
        <svg className="wmnds-btn__icon wmnds-btn__icon--right ">
          <use xlinkHref="#wmnds-general-chevron-right" href="#wmnds-general-chevron-right" />
        </svg>
      </button>
    </div>
  );
};
export default SubmitAnEnquiry;
