/* eslint-disable react/prop-types */
import React from 'react';
import dompurify from 'dompurify';
// Import contexts
import { FormDataContext } from 'globalState';

const { sanitize } = dompurify;
// eslint-disable-next-line react/prop-types
const LastPage = ({ content }) => {
  console.log('contentt>>>>>>>>>>>>', content.table);
  return (
    <>
      <h3>{content.heading}</h3>
      {content.serviceDetails && (
        <ul className="wmnds-unordered-list">
          {content.serviceDetails.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      )}
      {content.details?.includes('<a href=') ? (
        <div
          dangerouslySetInnerHTML={{
            __html: sanitize(content.details),
          }}
        />
      ) : (
        <p> {content.details}</p>
      )}
      <ul className="wmnds-unordered-list">
        {content.downloadText && (
          <li>
            <div className="wmnds-file-download">
              <div
                className="wmnds-file-download__desc"
                dangerouslySetInnerHTML={{
                  __html: sanitize(content.downloadText),
                }}
              />
            </div>
          </li>
        )}
        {content.info && <li>{content.info}</li>}
      </ul>
      {content.form && (
        <div
          dangerouslySetInnerHTML={{
            __html: sanitize(content.form),
          }}
        />
      )}
      {content.ringRideInfo && (
        <ul className="wmnds-unordered-list">
          {content.ringRideInfo.map((item) => (
            <li
              dangerouslySetInnerHTML={{
                __html: sanitize(item),
              }}
            />
          ))}
        </ul>
      )}
      {content.actionText && content.actionText !== 'Book now' && (
        <a
          href={content.actionLink}
          title={content.actionText}
          target="_self"
          className="wmnds-btn"
        >
          {content.actionText}
          <svg className="wmnds-btn__icon wmnds-btn__icon--right">
            <use xlinkHref="#wmnds-general-chevron-right" href="#wmnds-general-chevron-right" />
          </svg>
        </a>
      )}
      {content.actionText === 'Book now' && (
        <a
          href={content.actionLink}
          title={content.actionText}
          target="_self"
          className="wmnds-btn wmnds-btn--start"
        >
          {content.actionText}
          <svg className="wmnds-btn__icon wmnds-btn__icon--right">
            <use xlinkHref="#wmnds-general-chevron-right" href="#wmnds-general-chevron-right" />
          </svg>
        </a>
      )}

      {content.heading2 && <h3>{content.heading2}</h3>}
      {content.beforeStart && (
        <ul className="wmnds-unordered-list">
          {content.beforeStart.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      )}
      {content.details2 && (
        <p
          dangerouslySetInnerHTML={{
            __html: sanitize(content.details2),
          }}
        />
      )}
      {content.details3 && (
        <p
          dangerouslySetInnerHTML={{
            __html: sanitize(content.details3),
          }}
        />
      )}

      {content.warningText && (
        <div className="wmnds-warning-text">
          <svg className="wmnds-warning-text__icon">
            <use xlinkHref="#wmnds-general-warning-circle" href="#wmnds-general-warning-circle" />
          </svg>
          <p
            dangerouslySetInnerHTML={{
              __html: sanitize(content.warningText),
            }}
          />
        </div>
      )}
      {content.table && (
        <table className="wmnds-table wmnds-table--without-header">
          <caption className="wmnds-table__caption">
            <h3>{content.tableHeading}</h3>
          </caption>
          <tbody>
            {content.table.map((item) => (
              <tr>
                <th
                  scope="row"
                  data-header="Header 1"
                  dangerouslySetInnerHTML={{ __html: sanitize(item.link) }}
                />
                <td>{item.ph}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {content.heading3 && <h3>{content.heading3}</h3>}
      {content.callHelp && <p>{content.callHelp}</p>}
      {content.customerService && (
        <div className="wmnds-inset-text" aria-label="customer services">
          <h4>{content.customerServiceInfo ? content.customerServiceInfo : 'Customer Services'}</h4>
          <p>{content.ph ? content.ph : 'Phone: 0345 303 6760'}</p>
          {content.timings ? (
            <p>{content.timings}</p>
          ) : (
            <>
              <p>Mondays, Tuesdays, Thursdays and Fridays, 8am to 6pm</p>
              <p>Wednesdays, 10am to 6pm</p>
              <p>Saturdays, 9am to 1pm</p>
              <p>Sundays and Bank Holidays, Closed</p>
            </>
          )}
        </div>
      )}
      {content.dangerousProblems && (
        <div className="wmnds-inset-text">{content.dangerousProblems}</div>
      )}
      <br />
      <br />
      <p
        dangerouslySetInnerHTML={{
          __html: sanitize(content.complaint),
        }}
      />
      {content.start && (
        <a
          href={content.actionLink}
          title={content.start}
          target="_self"
          className="wmnds-btn wmnds-btn--start"
        >
          {content.start}
          <svg className="wmnds-btn__icon wmnds-btn__icon--right">
            <use xlinkHref="#wmnds-general-chevron-right" href="#wmnds-general-chevron-right" />
          </svg>
        </a>
      )}
    </>
  );
};

export default LastPage;
