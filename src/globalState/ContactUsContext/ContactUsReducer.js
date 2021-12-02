import Data from '../../components/App/ContactUs/newData.json';

export default (state, action) => {
  const { heading, fields, content } = Data.dashboard.find((item) =>
    item.parentId && item.parentId === action.payload
      ? item.heading
      : item.hasReachedConfirmation && content
  );
  console.log('action>>>>>>>>>>>>>', heading, fields);

  console.log(state);
  switch (action.type) {
    case 'CONTINUE':
      return {
        ...state,
        heading,
        fields,
        description: content?.description,
      };
    default:
      return state;
  }
};
