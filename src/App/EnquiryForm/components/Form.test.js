import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { FormProvider } from '../../../globalState/ContactUsContext';
import Form from './Form';

jest.mock('../../ContactUs/newData.json', () => ({
  pages: [
    {
      currentStepId: 'test-form',
      formComponents: [
        {
          name: 'address',
          title: 'Where?',
          answerTitle: 'Where?',
          components: [
            {
              type: 'Address',
              name: 'address',
              id: 'address',
              allowMapView: true,
              errorMsg: 'Enter an address',
              inputs: [
                { name: 'street', label: 'Street', required: true, errorMsg: 'Enter a street' },
              ],
            },
          ],
        },
        {
          name: 'other',
          title: 'Next step',
          components: [
            {
              type: 'Input',
              name: 'other',
              label: 'Other',
              id: 'other',
              required: true,
              errorMsg: 'Enter a value',
            },
          ],
        },
        {
          name: 'date',
          title: 'Date step',
          components: [
            {
              type: 'Date',
              name: 'date',
              id: 'date',
              label: 'Date',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}));

jest.mock('../../../components/shared/MapView/MapView', () => () => (
  <button
    type="button"
    onClick={() => {
      global.document.querySelector('.mapPoint').value =
        'https://www.google.com/maps/search/?api=1&query=52.5,-2';
      global.document.querySelector('.searchAddress').value = 'Birmingham';
    }}
  >
    Select point
  </button>
));

beforeEach(() => {
  window.location.hash = '#?test-form';
});

test('remembers map view and its answer when navigating back, and remembers switching to list view', async () => {
  render(
    <FormProvider>
      <Form />
    </FormProvider>
  );

  await act(async () => fireEvent.click(screen.getByText('Map view')));
  fireEvent.click(screen.getByText('Select point'));
  await act(async () => fireEvent.click(screen.getByText('Continue')));
  expect(screen.getByText('Next step')).toBeInTheDocument();
  await act(async () => fireEvent.click(screen.getByText('< Back')));
  expect(screen.getByText('List view')).toBeInTheDocument();
  expect(document.querySelector('.mapPoint').value).toContain('52.5,-2');
  expect(document.querySelector('.searchAddress').value).toBe('Birmingham');

  await act(async () => fireEvent.click(screen.getByText('Continue')));
  await act(async () => fireEvent.click(screen.getByText('< Back')));
  expect(document.querySelector('.mapPoint').value).toContain('52.5,-2');
  expect(document.querySelector('.searchAddress').value).toBe('Birmingham');

  await act(async () => fireEvent.click(screen.getByText('List view')));
  fireEvent.change(screen.getByLabelText('Street *'), { target: { value: 'High Street' } });
  await act(async () => fireEvent.click(screen.getByText('Continue')));
  await act(async () => fireEvent.click(screen.getByText('< Back')));
  expect(screen.getByText('Map view')).toBeInTheDocument();
  expect(screen.getByLabelText('Street *')).toHaveValue('High Street');
});

test('remembers map view even when no location was selected', async () => {
  render(
    <FormProvider>
      <Form />
    </FormProvider>
  );
  await act(async () => fireEvent.click(screen.getByText('Map view')));
  await act(async () => fireEvent.click(screen.getByText('Continue')));
  await act(async () => fireEvent.click(screen.getByText('< Back')));
  expect(screen.getByText('List view')).toBeInTheDocument();
});

test('prevents continuing when a required input is empty', async () => {
  render(
    <FormProvider>
      <Form />
    </FormProvider>
  );
  await act(async () => fireEvent.click(screen.getByText('Map view')));
  fireEvent.click(screen.getByText('Select point'));
  await act(async () => fireEvent.click(screen.getByText('Continue')));

  expect(document.querySelector('label[for="other"]')).toHaveTextContent('Other *');
  await act(async () => fireEvent.click(screen.getByText('Continue')));

  expect(screen.getByText('Next step')).toBeInTheDocument();
  expect(screen.getByText('Enter a value')).toBeInTheDocument();
});

test('rejects invalid and future dates with the appropriate error', async () => {
  render(
    <FormProvider>
      <Form />
    </FormProvider>
  );
  await act(async () => fireEvent.click(screen.getByText('Map view')));
  fireEvent.click(screen.getByText('Select point'));
  await act(async () => fireEvent.click(screen.getByText('Continue')));
  fireEvent.change(screen.getByLabelText('Other *'), { target: { value: 'test' } });
  await act(async () => fireEvent.click(screen.getByText('Continue')));

  fireEvent.change(document.querySelector('[name="day"]'), { target: { value: '31' } });
  fireEvent.change(document.querySelector('[name="month"]'), { target: { value: '02' } });
  fireEvent.change(document.querySelector('[name="year"]'), { target: { value: '2025' } });
  await act(async () => fireEvent.click(screen.getByText('Continue')));

  expect(screen.getByText('Date step')).toBeInTheDocument();
  expect(screen.getByText('Enter a valid date')).toBeInTheDocument();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  fireEvent.change(document.querySelector('[name="day"]'), {
    target: { value: String(tomorrow.getDate()) },
  });
  fireEvent.change(document.querySelector('[name="month"]'), {
    target: { value: String(tomorrow.getMonth() + 1) },
  });
  fireEvent.change(document.querySelector('[name="year"]'), {
    target: { value: String(tomorrow.getFullYear()) },
  });
  await act(async () => fireEvent.click(screen.getByText('Continue')));

  expect(screen.getByText("The date can't be in the future")).toBeInTheDocument();
});

test('limits date years to the current year and previous 99 calendar years', async () => {
  render(
    <FormProvider>
      <Form />
    </FormProvider>
  );
  await act(async () => fireEvent.click(screen.getByText('Map view')));
  fireEvent.click(screen.getByText('Select point'));
  await act(async () => fireEvent.click(screen.getByText('Continue')));
  fireEvent.change(screen.getByLabelText('Other *'), { target: { value: 'test' } });
  await act(async () => fireEvent.click(screen.getByText('Continue')));

  const currentYear = new Date().getFullYear();
  fireEvent.change(document.querySelector('[name="day"]'), { target: { value: '15' } });
  fireEvent.change(document.querySelector('[name="month"]'), { target: { value: '06' } });
  const yearField = document.querySelector('[name="year"]');

  fireEvent.change(yearField, { target: { value: String(currentYear - 100) } });
  await act(async () => fireEvent.click(screen.getByText('Continue')));
  expect(screen.getByText('Enter a valid date')).toBeInTheDocument();

  fireEvent.change(yearField, { target: { value: String(currentYear - 99) } });
  await act(async () => fireEvent.click(screen.getByText('Continue')));
  expect(screen.queryByText('Enter a valid date')).not.toBeInTheDocument();

  fireEvent.change(yearField, { target: { value: String(currentYear + 1) } });
  await act(async () => fireEvent.click(screen.getByText('Continue')));
  expect(screen.getByText("The date can't be in the future")).toBeInTheDocument();
});
