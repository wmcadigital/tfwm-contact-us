import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1920;
const JPEG_QUALITY = 0.8;

const ACCEPTED_TYPES = 'image/png,image/jpeg,image/jpg,application/pdf';

const compressImage = (file) =>
  new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width <= MAX_IMAGE_DIMENSION && height <= MAX_IMAGE_DIMENSION) {
        resolve(file);
        return;
      }

      if (width > height) {
        height = Math.round((height / width) * MAX_IMAGE_DIMENSION);
        width = MAX_IMAGE_DIMENSION;
      } else {
        width = Math.round((width / height) * MAX_IMAGE_DIMENSION);
        height = MAX_IMAGE_DIMENSION;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: file.lastModified,
          });
          resolve(compressedFile);
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };

    img.src = url;
  });

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
  setValue,
  onFileChange = () => {},
}) => {
  const [files, setFiles] = useState([]);
  const [sizeError, setSizeError] = useState('');

  useEffect(() => {
    let initial = [];
    if (defaultValue && Array.isArray(defaultValue)) {
      initial = defaultValue.every((f) => f instanceof Blob) ? defaultValue : [];
    } else if (defaultValue && !Array.isArray(defaultValue)) {
      initial = typeof defaultValue === 'string' ? [] : [defaultValue];
    }
    setFiles(initial);
    setValue(name, initial);
    onFileChange(name, initial);
  }, [defaultValue, name, setValue, onFileChange]);

  const addFiles = async (newFiles) => {
    const remaining = MAX_FILES - files.length;
    if (remaining <= 0) return;

    const fileList = Array.from(newFiles).slice(0, remaining);
    const compressed = await Promise.all(fileList.map(compressImage));
    const oversized = compressed.find((f) => f.size > MAX_FILE_SIZE);
    if (oversized) {
      const sizeMB = (oversized.size / (1024 * 1024)).toFixed(1);
      setSizeError(`"${oversized.name}" is ${sizeMB}MB and exceeds the 2MB limit`);
      return;
    }
    setSizeError('');
    const updated = [...files, ...compressed];
    setFiles(updated);
    setValue(name, updated);
    onFileChange(name, updated);
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    setValue(name, updated);
    onFileChange(name, updated);
  };

  const hasReachedMax = files.length >= MAX_FILES;

  return (
    <div className="wmnds-fe-group ">
      <input type="hidden" name={name} ref={register} />
      <div className="wmnds-fe-file-upload">
        <p className="wmnds-m-t-lg wmnds-m-b-lg">{details}</p>
        <p>{label}</p>
        <p className="wmnds-m-b-md">
          {files.length} of {MAX_FILES} files
        </p>
        {sizeError && <span className="wmnds-fe-error-message">{sizeError}</span>}

        {!hasReachedMax && (
          <div>
            <button
              type="button"
              className="wmnds-btn wmnds-btn--primary wmnds-fe-file-upload__label"
              onClick={() => document.getElementById('fileUploader').click()}
            >
              Add file
              <svg className="wmnds-btn__icon wmnds-btn__icon--right">
                <use xlinkHref="#wmnds-general-plus" href="#wmnds-general-plus" />
              </svg>
            </button>
            <input
              type="file"
              name="fileUploader"
              id="fileUploader"
              className="wmnds-fe-file-upload__input"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.length) {
                  addFiles(e.target.files);
                  e.target.value = '';
                }
              }}
              accept={ACCEPTED_TYPES}
              multiple
            />
          </div>
        )}

        {files.length > 0 && (
          <ul className="wmnds-list wmnds-m-t-md">
            {files.map((file, idx) => (
              <li
                key={`${file.name}-${file.size}-${file.lastModified}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 8,
                  flexWrap: 'wrap',
                }}
              >
                {(() => {
                  if (file.type === 'application/pdf') {
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src="/pdf-icon.svg" alt="pdf logo" width={24} height={24} />
                        <span>{file.name}</span>
                      </div>
                    );
                  }
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {file instanceof Blob ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          width={48}
                          height={48}
                          style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                      ) : (
                        <img src="/pdf-icon.svg" alt="file" width={24} height={24} />
                      )}
                      <span>{file.name}</span>
                    </div>
                  );
                })()}
                <button
                  type="button"
                  className="wmnds-btn wmnds-btn--link"
                  onClick={() => removeFile(idx)}
                  style={{ color: '#d4351c' }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
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
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.object)]),
  setValue: PropTypes.func,
  onFileChange: PropTypes.func,
};

FileUpload.defaultProps = {
  defaultValue: '',
  setValue: () => {},
  onFileChange: () => {},
};

export default FileUpload;
