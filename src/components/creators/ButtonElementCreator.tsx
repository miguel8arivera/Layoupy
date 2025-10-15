import { Box, Button } from '@mui/material';
import type { ButtonElement } from '../../types/elements';

interface ButtonElementCreatorProps {
  onCreateElement: (element: ButtonElement) => void;
}

export default function ButtonElementCreator({
  onCreateElement,
}: ButtonElementCreatorProps) {
  const handleCreate = () => {
    const newElement: ButtonElement = {
      id: crypto.randomUUID(),
      type: 'button',
      label: 'Next',
    };
    onCreateElement(newElement);
  };

  return (
    <Box>
      <Button
        variant="contained"
        fullWidth
        onClick={handleCreate}
        sx={{
          backgroundColor: 'green',
          '&:hover': { backgroundColor: 'darkgreen' },
        }}
      >
        Create Button Element
      </Button>
    </Box>
  );
}
