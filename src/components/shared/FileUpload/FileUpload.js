import React, { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';

/* eslint-disable react/prop-types */
const FileUpload = ({
  label = '',
  name = '',
  defaultValue = '',
  errorMsg = '',
  details = '',
  required = false,
  register,
  unregister,
}) => {
  const [file, setFile] = useState();
  const [fileMetaData, setFileMetaData] = useState('');
  const reset = () => {
    setFile(undefined);
    setFileMetaData('');
  };
  const fileChangeHandler = (event) => {
    setFileMetaData(event.target.files[0]);
    setFile(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="wmnds-fe-group ">
      <div className="wmnds-fe-file-upload">
        <p className="wmnds-m-t-lg wmnds-m-b-lg">{details}</p>
        <p>{label}</p>
        <label
          htmlFor="fileUploader"
          className="wmnds-btn wmnds-btn--primary wmnds-fe-file-upload__label "
          style={{
            display: `${file ? 'none' : ''}`,
          }}
        >
          Choose file
          <input
            type="file"
            name="fileUploader"
            id="fileUploader"
            className="wmnds-fe-file-upload__input"
            onChange={fileChangeHandler}
            ref={register}
            accept="image/png,image/jpeg,image/jpg,application/pdf"
          />
          <svg className="wmnds-btn__icon wmnds-btn__icon--right">
            <use xlinkHref="#wmnds-general-paperclip" href="#wmnds-general-paperclip" />
          </svg>
        </label>
        {file && (
          <button
            htmlFor="fileUploader"
            className="wmnds-btn wmnds-btn--primary wmnds-fe-file-upload__label "
            style={{
              backgroundColor: '#d4351c',
            }}
            onClick={reset}
            type="button"
          >
            Remove file
            <svg className="wmnds-btn__icon wmnds-btn__icon--right">
              <use xlinkHref="#wmnds-general-trash" href="#wmnds-general-trash" />
            </svg>
          </button>
        )}
        <span>{file ? file.name : 'no file selected'}</span>
      </div>

      {fileMetaData && (
        <>
          <div style={{ marginTop: 20 }}>
            {fileMetaData.type === 'application/pdf' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/pdf-icon.svg" alt="pdf logo" width={20} height={20} />
                <p style={{ marginBottom: 0 }}>{fileMetaData.name}</p>
              </div>
            ) : (
              <img src={file} alt="File" width={200} height={200} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

// PropTypes
FileUpload.propTypes = {
  label: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
};

export default FileUpload;
