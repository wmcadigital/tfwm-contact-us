/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from 'react';
import dompurify from 'dompurify';
import { FormDataContext } from 'globalState';

const { sanitize } = dompurify;
// eslint-disable-next-line react/prop-types
const LastPage = ({ content, currentStep }) => {
  const [, formDispatch] = useContext(FormDataContext);

  useEffect(() => {
    const fillFormEl = document.querySelector('#formId');
    console.log('fill', fillFormEl);
    if (fillFormEl) {
      fillFormEl.addEventListener('click', () => {
        formDispatch({
          type: 'FORM-ID',
          payload: { formId: content.formId },
        });
      });
    }
  }, []);
  useEffect(() => {
    /* eslint no-underscore-dangle: 0 */

    window.__8x8Chat = {
      uuid: 'script_1846483120624b05c7b46378.06993588',

      tenant: 'd2VzdG1pZGxhbmRzY29tYmkwMQ',

      channel: 'Ticketing Web Chat',

      domain: 'https://vcc-eu7.8x8.com',

      path: '/.',

      buttonContainerId: '__8x8-chat-button-container-script_1846483120624b05c7b46378.06993588',

      align: 'right',
    };
    const se = document.createElement('script');

    se.type = 'text/javascript';

    se.async = true;

    // eslint-disable-next-line no-underscore-dangle
    se.src = `${window.__8x8Chat.domain + window.__8x8Chat.path}/CHAT/common/js/chat.js`;

    const os = document.getElementsByTagName('script')[0];

    os.parentNode.insertBefore(se, os);
  });
  return (
    <div
      className=" wmnds-col-1 wmnds-col-md-3-4"
      style={{ maxWidth: 640, paddingLeft: 16, paddingRight: 16 }}
    >
      <h2 className="wmnds-m-t-sm">{currentStep?.heading}</h2>
      {content.subheading && <h3 style={{ color: '#3C1053' }}>{content.subheading}</h3>}
      {content.heading && <h3>{content.heading}</h3>}
      {content.details?.includes('<a href=') ? (
        <div
          dangerouslySetInnerHTML={{
            __html: sanitize(content.details),
          }}
          className="wmnds-p-b-xs wmnds-p-t-md"
        />
      ) : (
        <p> {content.details}</p>
      )}
      <ul className="wmnds-unordered-list">
        {content.downloadText && (
          <li>
            <div className="wmnds-file-download">
              <div
                className="wmnds-file-download__desc wmnds-p-l-none"
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
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: sanitize(content.form),
            }}
          />
          <br />
        </>
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
        <div className="wmnds-p-b-lg">
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
        </div>
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
                <td style={{ textAlign: 'right' }}>{item.ph}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {content.heading2 && <h3>{content.heading2}</h3>}

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
      {content.insetText && (
        <div
          className="wmnds-inset-text wmnds-m-b-lg"
          dangerouslySetInnerHTML={{
            __html: sanitize(content.insetText),
          }}
        />
      )}
      <p
        dangerouslySetInnerHTML={{
          __html: sanitize(content.complaint),
        }}
      />
      {content.warningText && (
        <div className="wmnds-warning-text wmnds-p-b-xs">
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

      {content.heading3 && <h3>{content.heading3}</h3>}
      {content.callHelp && (
        <div
          className="wmnds-m-b-md"
          dangerouslySetInnerHTML={{
            __html: sanitize(content.callHelp),
          }}
        />
      )}
      {content.customerService && (
        <div className="wmnds-inset-text" aria-label="customer services">
          <h4>{content.customerServiceInfo ? content.customerServiceInfo : 'Customer Services'}</h4>
          {content.showChat && (
            <>
              <h5>Live Chat</h5>
              <p>
                The chat button will appear below when this service is available. Starting live chat
                will open a window at the bottom of your browser.
              </p>
              <div id="__8x8-chat-button-container-script_1846483120624b05c7b46378.06993588" />
            </>
          )}

          {!content.ringRideInfo && <h4>Telephone</h4>}
          <p>{content.ph ? content.ph : 'Phone: 0345 303 6760'}</p>
          {content.timings ? (
            <p>{content.timings}</p>
          ) : (
            <>
              <div>Mondays, Tuesdays, Thursdays and Fridays, 8am to 6pm</div>
              <div>Wednesdays, 10am to 6pm</div>
              <div>Saturdays, 9am to 1pm</div>
              <div>Sundays and Bank Holidays, Closed</div>
            </>
          )}
        </div>
      )}
      {content.subheading1 && <h3 style={{ color: '#3C1053' }}>{content.subheading1}</h3>}

      {content.heading4 && <h3>{content.heading4}</h3>}
      {content.details4 && (
        <p
          dangerouslySetInnerHTML={{
            __html: sanitize(content.details4),
          }}
        />
      )}
      {content.ringRideInfo1 && (
        <ul className="wmnds-unordered-list">
          {content.ringRideInfo1.map((item) => (
            <li
              dangerouslySetInnerHTML={{
                __html: sanitize(item),
              }}
            />
          ))}
        </ul>
      )}

      {content.heading5 && <h3>{content.heading5}</h3>}
      {content.details5 && (
        <p
          dangerouslySetInnerHTML={{
            __html: sanitize(content.details5),
          }}
        />
      )}
      {content.details6 && (
        <>
          <div className="wmnds-inset-text" aria-label="customer services">
            <h4>West Midlands Bus On Demand</h4>
            <p>Phone: 0345 034 8670</p>
            <>
              <p>Monday to Friday, 8am to 4pm</p>
              <p>Saturdays, 9am to 1pm</p>
              <p>Sundays and Bank Holidays, Closed</p>
            </>
          </div>
          <br />
          <br />
        </>
      )}
      {content.details6 && (
        <p
          dangerouslySetInnerHTML={{
            __html: sanitize(content.details6),
          }}
        />
      )}

      <br />
      <br />
    </div>
  );
};

export default LastPage;
