import React from 'react';
// Components;
import Icon from '../../../shared/Icon/Icon';
// Styles
import s from '../../App.module.scss';

function StartPage() {
  return (
    <div className="wmnds-container">
      <h1>Contact Us</h1>
      <p>
        <a href="www.google.com" target="_self" className="wmnds-link">
          Contact an operator
        </a>
        if your enquiry is about bus, train or tram services. This includes service issues, lost
        property and staff. You’ll need to
        <a href="www.google.com" target="_self" className="wmnds-link">
          contact the West Midlands Combined Authority
        </a>
        if your enquiry is about corporate strategy and transport development.
      </p>
      <h2>Find who you need to contact</h2>
      <p>
        Answer questions and we&#39;ll direct you to the right place so we can solve your enquiry.
      </p>
      <a
        href="www.google.com"
        title="This is a start link"
        target="_self"
        className="wmnds-btn wmnds-btn--start"
      >
        Start
        <Icon iconName="general-chevron-right" className="wmnds-btn__icon wmnds-btn__icon--right" />
      </a>

      <div>
        <Icon iconName="general-warning-triangle" className={`${s.iconDimension}`} />
        <h5>
          If your Swift card number begins with 633597 0112, your Swift card is
          <a href="www.google.com" target="_self" className="wmnds-link">
            <span className={`${s.textMetro}`}>managed by National Express West Midlands.</span>
          </a>
        </h5>
      </div>
      <div>
        <p>
          You can also visit a
          <a href="www.google.com" target="_self">
            travel centre
          </a>
          to get bus, train and tram travel information, tables and tickets.
        </p>
      </div>
      <div>
        You can also check online for:
        <ul>
          <li>
            <a href="www.google.com" target="_self" title="Link title" className="wmnds-link">
              service updates and disruptions
            </a>
          </li>
          <li>
            {' '}
            <a href="www.google.com" target="_self" title="Link title" className="wmnds-link">
              planned roadworks and major events
            </a>
          </li>
        </ul>
      </div>
      <div className="wmnds-p-sm">
        <h2>Give us a call</h2>
        <div className="wmnds-inset-text" aria-label="call us">
          <h4>Customer Services</h4>
          <p>Phone: 0345 303 6760</p>
          Mondays, Tuesdays, Thursdays and Fridays, 8am to 6pm <br />
           Wednesdays, 10am to 6pm
          <br />
          Saturdays, 9am to 1pm
          <br />
          Sundays and Bank Holidays, Closed
        </div>
      </div>
    </div>
  );
}

export default StartPage;
