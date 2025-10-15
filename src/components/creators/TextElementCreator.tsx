import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState } from 'react';
import type { TextElement, TextType } from '../../types/elements';

interface TextElementCreatorProps {
  onCreateElement: (element: TextElement) => void;
}

export default function TextElementCreator({
  onCreateElement,
}: TextElementCreatorProps) {
  const [inputText, setInputText] = useState('');
  const [textType, setTextType] = useState<TextType>('statement');

  const handleCreate = () => {
    if (inputText.trim()) {
      const newElement: TextElement = {
        id: crypto.randomUUID(),
        type: 'text',
        text: inputText,
        textType: textType,
      };
      onCreateElement(newElement);
      setInputText('');
      setTextType('statement');
    }
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Tipo de Texto</InputLabel>
        <Select
          value={textType}
          label="Tipo de Texto"
          onChange={(e) => setTextType(e.target.value as TextType)}
        >
          <MenuItem value="statement">Statement</MenuItem>
          <MenuItem value="agentNote">Agent Note</MenuItem>
          <MenuItem value="verbatimDisclosure">Verbatim Disclosure</MenuItem>
          <MenuItem value="regularQuestion">Regular Question</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        multiline
        rows={3}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Escribe el texto..."
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button variant="contained" fullWidth onClick={handleCreate}>
        Create Text Element
      </Button>
    </Box>
  );
}
