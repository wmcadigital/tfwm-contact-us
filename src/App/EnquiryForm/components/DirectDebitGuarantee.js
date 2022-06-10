import React, { useContext } from 'react';

import { FormDataContext } from '../../../globalState';

import classes from '../../App.module.scss';

const DirectDebitGuarantee = () => {
  const [{ stepNum }, formDispatch] = useContext(FormDataContext);

  return (
    <div className="wmnds-container wmnds-container--main">
      {stepNum !== 0 && (
        <button
          type="button"
          className="wmnds-btn wmnds-m-b-md wmnds-btn--link"
          onClick={() => {
            formDispatch({
              type: 'CHANGE-PAGE',
              payload: { page: 'ANSWERS', stepNum },
            });
          }}
        >
          &lt; Back
        </button>
      )}
      <div className="bg-white " style={{ width: '40rem', backgroundColor: 'white', padding: 30 }}>
        {' '}
        <h1 className=" wmnds-m-t-xs  wmnds-m-b-xs ">The Direct Debit Guarantee</h1>
        <ul>
          <li>
            This Guarantee is offered by all banks and building societies that accept instructions
            to pay Direct Debits.
          </li>
          <li>
            If there are any changes to the amount, date or interval of your Direct Debit West
            Midlands Combined Authority will notify you 10 working days in advance of your account
            being debited or as otherwise agreed. If you request West Midlands Combined Authority to
            collect a payment, confirmation of amount and date will be given to you at the time of
            the request.
          </li>
          <li>
            If an error is made in the payment of your Direct Debit, by West Midlands Combined
            Authority or your bank or building society, you are entitled to a full and immediate
            refund of the amount paid from you bank or building society.
          </li>
          <li>
            If you receive a refund you are not entitled to, you must pay it back when West Midlands
            Combined Authority asks you to.
          </li>
          <li>
            You can cancel a Direct Debit at any time by simply contacting your bank or building
            society. Written confirmation may be required. Please also notify us.
          </li>
        </ul>
        <img src="/direct-debit-logo.png" alt="direct debit logo" className={classes.ddLogo} />
      </div>
    </div>
  );
};
export default DirectDebitGuarantee;
