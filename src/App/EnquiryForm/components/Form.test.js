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
              required: false,
              errorMsg: 'Enter a value',
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
  fireEvent.change(screen.getByLabelText('Street'), { target: { value: 'High Street' } });
  await act(async () => fireEvent.click(screen.getByText('Continue')));
  await act(async () => fireEvent.click(screen.getByText('< Back')));
  expect(screen.getByText('Map view')).toBeInTheDocument();
  expect(screen.getByLabelText('Street')).toHaveValue('High Street');
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
