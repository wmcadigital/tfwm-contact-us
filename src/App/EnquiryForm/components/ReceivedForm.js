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
}) => {
  return (
    <div className="wmnds-container wmnds-container--main">
      <div style={{ maxWidth: 608 }}>
        {' '}
        <div className="wmnds-msg-summary wmnds-msg-summary--success-fill ">
          <h3 className=" wmnds-text-align-center">{successTitle}</h3>
          <div
            className="wmnds-text-align-center wmnds-m-t-lg"
            dangerouslySetInnerHTML={{
              __html: sanitize(successText),
            }}
          />
        </div>
        <h2 className="wmnds-m-t-lg">{title}</h2>
        <p>{text1}</p>
        <p>{text2}</p>
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
};

export default ReceivedForm;
