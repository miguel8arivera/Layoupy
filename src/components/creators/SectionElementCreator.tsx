import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import type { SectionElement, FormElement, RadioElement } from '../../types/elements';

interface SectionElementCreatorProps {
  onCreateElement: (element: SectionElement) => void;
  availableElements: FormElement[];
}

export default function SectionElementCreator({
  onCreateElement,
  availableElements,
}: SectionElementCreatorProps) {
  const [title, setTitle] = useState('');
  const [selectedRadioName, setSelectedRadioName] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  // Filtrar solo elementos de tipo radio para usar como condiciones
  const radioElements = availableElements.filter(
    (el) => el.type === 'radio'
  ) as RadioElement[];

  // Obtener opciones del radio seleccionado por nombre
  const selectedRadio = radioElements.find((el) => el.name === selectedRadioName);
  const availableValues = selectedRadio?.options || [];

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('El título de la sección no puede estar vacío');
      return;
    }

    if (!selectedRadioName) {
      toast.error('Debes seleccionar un Single Select');
      return;
    }

    if (!selectedValue) {
      toast.error('Debes seleccionar un valor');
      return;
    }

    const newSection: SectionElement = {
      id: crypto.randomUUID(),
      type: 'section',
      title: title,
      condition: {
        dependsOn: selectedRadioName,
        value: selectedValue,
      },
      children: [],
    };
    onCreateElement(newSection);
    setTitle('');
    setSelectedRadioName('');
    setSelectedValue('');
    toast.success(`Section "${title}" creada exitosamente`);
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#9c27b0' }}>
        Crear Section Condicional
      </Typography>

      <TextField
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label="Título de la Section"
        placeholder="Ej: Información adicional"
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Vinculado a Single Select</InputLabel>
        <Select
          value={selectedRadioName}
          label="Vinculado a Single Select"
          onChange={(e) => {
            setSelectedRadioName(e.target.value);
            setSelectedValue('');
          }}
        >
          {radioElements.length === 0 ? (
            <MenuItem disabled>
              <em>No hay Single Selects creados</em>
            </MenuItem>
          ) : (
            radioElements.map((radio) => (
              <MenuItem key={radio.id} value={radio.name}>
                {radio.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {selectedRadioName && availableValues.length > 0 && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Mostrar cuando la respuesta sea</InputLabel>
          <Select
            value={selectedValue}
            label="Mostrar cuando la respuesta sea"
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            {availableValues.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Nota: Los elementos se agregarán a la section directamente en el Renderizador
      </Typography>

      <Button
        variant="contained"
        fullWidth
        onClick={handleCreate}
        startIcon={<AccountTreeIcon />}
        sx={{
          backgroundColor: '#9c27b0',
          '&:hover': { backgroundColor: '#7b1fa2' }
        }}
      >
        Crear Section
      </Button>
    </Box>
  );
}
