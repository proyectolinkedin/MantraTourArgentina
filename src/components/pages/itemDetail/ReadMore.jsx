import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const ReadMore = ({ text, maxChars = 1000 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded ? text : text.slice(0, maxChars);

  return (
    <Box>
      <Typography variant="body1">{displayText}</Typography>
      {text.length > maxChars && (
        <Button variant="contained" color="primary" onClick={handleToggle}>
          {isExpanded ? 'Leer menos' : 'Leer más'}
        </Button>
      )}
    </Box>
  );
};

export default ReadMore;
