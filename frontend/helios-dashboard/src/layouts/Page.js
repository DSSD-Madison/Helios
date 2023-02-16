import * as React from 'react';

import { Box } from '@mui/material';
import Navigation from '../components/Navigation';

const Page = ({ title, children }) => {
  React.useEffect(() => {
    document.title = `${title} | Helios` || "";
  }, [title]);

  return (
    <>
      <Navigation title={title} />

      <Box sx={{p: 5}}>
        {children}
      </Box>
    </>
  );
}

export default Page;