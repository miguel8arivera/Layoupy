import { Box, TextField, Button } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import type { RadioElement, FormElement } from '../../types/elements'

interface RadioElementCreatorProps {
  onCreateElement: (element: RadioElement) => void
  existingElements: FormElement[]
}

export default function RadioElementCreator({ onCreateElement, existingElements }: RadioElementCreatorProps) {
  const [radioName, setRadioName] = useState<string>('')
  const [numOptions, setNumOptions] = useState<number>(2)
  const [radioOptions, setRadioOptions] = useState<string[]>(['', ''])

  const validateName = (name: string): boolean => {
    // Verificar que empiece con mayúscula
    if (name.length === 0) {
      toast.error('El nombre no puede estar vacío')
      return false
    }

    if (name[0] !== name[0].toUpperCase()) {
      toast.error('El nombre debe empezar con mayúscula')
      return false
    }

    // Verificar que no tenga espacios
    if (name.includes(' ')) {
      toast.error('El nombre no puede contener espacios')
      return false
    }

    // Verificar que no exista ya
    const existingRadios = existingElements.filter(el => el.type === 'radio') as RadioElement[]
    const isDuplicate = existingRadios.some(radio => radio.name === name)

    if (isDuplicate) {
      toast.error(`Single select ya existe con ese nombre: ${name}`)
      return false
    }

    return true
  }

  const handleNumOptionsChange = (value: number) => {
    const num = Math.max(2, Math.min(10, value))
    setNumOptions(num)
    const newOptions = Array(num).fill('').map((_, i) => radioOptions[i] || '')
    setRadioOptions(newOptions)
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...radioOptions]
    newOptions[index] = value
    setRadioOptions(newOptions)
  }

  const handleCreate = () => {
    if (!validateName(radioName.trim())) {
      return
    }

    const validOptions = radioOptions.filter(opt => opt.trim() !== '')
    if (validOptions.length >= 2) {
      const newElement: RadioElement = {
        id: crypto.randomUUID(),
        type: 'radio',
        name: radioName.trim(),
        options: validOptions
      }
      onCreateElement(newElement)
      setRadioName('')
      setRadioOptions(Array(numOptions).fill(''))
      toast.success(`Single select "${radioName}" creado exitosamente`)
    } else {
      toast.error('Debes tener al menos 2 opciones válidas')
    }
  }

  return (
    <Box>
      <TextField
        fullWidth
        value={radioName}
        onChange={(e) => setRadioName(e.target.value)}
        label="Nombre del Single Select (ej: AreYouAdult)"
        variant="outlined"
        sx={{ mb: 2 }}
        placeholder="EmpiezaConMayuscula"
        helperText="Debe empezar con mayúscula y no contener espacios"
      />
      <TextField
        fullWidth
        type="number"
        value={numOptions}
        onChange={(e) => handleNumOptionsChange(Number(e.target.value))}
        label="Número de opciones (2-10)"
        variant="outlined"
        sx={{ mb: 2 }}
        inputProps={{ min: 2, max: 10 }}
      />

      {radioOptions.map((option, index) => (
        <TextField
          key={index}
          fullWidth
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          label={`Opción ${index + 1}`}
          variant="outlined"
          sx={{ mb: 1 }}
        />
      ))}

      <Button
        variant="contained"
        fullWidth
        onClick={handleCreate}
        sx={{ mt: 1 }}
      >
        Crear Elemento
      </Button>
    </Box>
  )
}
