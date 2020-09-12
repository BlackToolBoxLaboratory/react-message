import React from 'react';

const createContext = (name) => {
  const context = React.createContext();
  context.displayName = name;
  return context;
};

export default createContext;
