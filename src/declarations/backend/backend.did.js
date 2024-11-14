export const idlFactory = ({ IDL }) => {
  return IDL.Service({ 'healthCheck' : IDL.Func([], [IDL.Text], ['query']) });
};
export const init = ({ IDL }) => { return []; };
