import React, { useContext } from 'react';
import { FormDataContext } from 'globalState';

const SubmitAnEnquiry = () => {
  const [, formDispatch] = useContext(FormDataContext);

  return (
    <div className="wmnds-container wmnds-container--main">
      {' '}
      <h1 className=" wmnds-m-t-xs wmnds-m-b-xs">Submit an enquiry</h1>
      <h2 className="wmnds-p-t-md wmnds-m-t-xs">Use this service to:</h2>
      <p>• Contact Customer Services</p>
      <p>This process takes around 5 minutes.</p>
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
