import { useContext } from 'react';

import QueueContext from '../components/QueueContext.jsx';

const useMessage = () => {
  return useContext(QueueContext);
};

export { useMessage };
