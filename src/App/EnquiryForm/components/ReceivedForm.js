import React from 'react';

import PropTypes from 'prop-types';

import dompurify from 'dompurify';

const { sanitize } = dompurify;

const ReceivedForm = ({
  successTitle = '',
  successText = '',
  title = '',
  text1 = '',
  text2 = '',
  text3 = '',
}) => {
  return (
    <div className="wmnds-container wmnds-container--main">
      <div style={{ maxWidth: 608 }}>
        {' '}
        <div className="wmnds-msg-summary wmnds-msg-summary--success-fill ">
          <h3 className="wmnds-text-align-center wmnds-m-t-md wmnds-m-b-md">{successTitle}</h3>
          {successText && (
            <div
              className="wmnds-text-align-center wmnds-m-t-lg"
              style={{ color: 'white' }}
              dangerouslySetInnerHTML={{
                __html: sanitize(successText),
              }}
            />
          )}{' '}
        </div>
        <h2 className="wmnds-m-t-lg">{title}</h2>
        <p>{text1}</p>
        <p>{text2}</p>
        <p>{text3}</p>
      </div>
    </div>
  );
};
// PropTypes
ReceivedForm.propTypes = {
  successTitle: PropTypes.string.isRequired,
  successText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string.isRequired,
  text3: PropTypes.string.isRequired,
};

export default ReceivedForm;
