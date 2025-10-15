import {
  Box,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Paper,
} from '@mui/material';
import { useState } from 'react';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import ErrorIcon from '@mui/icons-material/Error';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import DescriptionIcon from '@mui/icons-material/Description';
import GavelIcon from '@mui/icons-material/Gavel';
import HomeIcon from '@mui/icons-material/Home';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import type { FormElement, TextElement, SectionElement, StageElement } from '../types/elements';

interface RendererProps {
  elements: FormElement[];
  onElementsChange: (elements: FormElement[]) => void;
}

const STAGE_ICONS: Record<string, React.ReactElement> = {
  'person': <PersonIcon sx={{ fontSize: 40 }} />,
  'check-circle': <CheckCircleIcon sx={{ fontSize: 40 }} />,
  'assignment': <AssignmentIcon sx={{ fontSize: 40 }} />,
  'present': <PresentToAllIcon sx={{ fontSize: 40 }} />,
  'handshake': <HandshakeIcon sx={{ fontSize: 40 }} />,
  'health': <HealthAndSafetyIcon sx={{ fontSize: 40 }} />,
  'family': <FamilyRestroomIcon sx={{ fontSize: 40 }} />,
  'hospital': <LocalHospitalIcon sx={{ fontSize: 40 }} />,
  'money': <AttachMoneyIcon sx={{ fontSize: 40 }} />,
  'bank': <AccountBalanceIcon sx={{ fontSize: 40 }} />,
  'verified': <VerifiedUserIcon sx={{ fontSize: 40 }} />,
  'contact': <ContactPhoneIcon sx={{ fontSize: 40 }} />,
  'document': <DescriptionIcon sx={{ fontSize: 40 }} />,
  'legal': <GavelIcon sx={{ fontSize: 40 }} />,
  'home': <HomeIcon sx={{ fontSize: 40 }} />,
  'car': <DriveEtaIcon sx={{ fontSize: 40 }} />,
};

export default function Renderer({ elements, onElementsChange }: RendererProps) {
  const [radioValues, setRadioValues] = useState<Record<string, string>>({});

  const parseTextWithHTML = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;

    // Regex para encontrar tags HTML
    const tagRegex = /<(strong|b|em|i|u)>(.*?)<\/\1>/g;
    let match;

    while ((match = tagRegex.exec(text)) !== null) {
      // Agregar texto antes del tag
      if (match.index > currentIndex) {
        parts.push(text.substring(currentIndex, match.index));
      }

      // Agregar el contenido del tag con estilos
      const tagName = match[1];
      const content = match[2];

      switch (tagName) {
        case 'strong':
        case 'b':
          parts.push(
            <Box key={match.index} component="span" sx={{ fontWeight: 700 }}>
              {content}
            </Box>
          );
          break;
        case 'em':
        case 'i':
          parts.push(
            <Box
              key={match.index}
              component="span"
              sx={{ fontStyle: 'italic' }}
            >
              {content}
            </Box>
          );
          break;
        case 'u':
          parts.push(
            <Box
              key={match.index}
              component="span"
              sx={{ textDecoration: 'underline' }}
            >
              {content}
            </Box>
          );
          break;
      }

      currentIndex = match.index + match[0].length;
    }

    // Agregar texto restante
    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const cloneElementWithNewId = (element: FormElement): FormElement => {
    const newId = crypto.randomUUID();

    if (element.type === 'section') {
      return {
        ...element,
        id: newId,
        children: element.children.map(child => cloneElementWithNewId(child)),
      };
    }

    return {
      ...element,
      id: newId,
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementData = e.dataTransfer.getData('element');
    const fromRenderer = e.dataTransfer.getData('fromRenderer');

    if (elementData) {
      const element: FormElement = JSON.parse(elementData);

      // Si viene del Renderer, no hacer nada (se queda en el Renderer)
      if (fromRenderer === 'true') {
        return;
      }

      // Si viene de Factory, clonar con nuevo ID y agregar
      const elementWithNewId = cloneElementWithNewId(element);
      onElementsChange([...elements, elementWithNewId]);
    }
  };

  const handleRadioChange = (elementId: string, value: string) => {
    setRadioValues({
      ...radioValues,
      [elementId]: value,
    });
  };

  const handleDragStartFromRenderer = (e: React.DragEvent, element: FormElement) => {
    e.dataTransfer.setData('element', JSON.stringify(element));
    e.dataTransfer.setData('fromRenderer', 'true');
    e.dataTransfer.setData('elementId', element.id);
  };

  const handleStageClick = (stageId: string) => {
    const updatedElements = elements.map(el => {
      if (el.type === 'stage') {
        return { ...el, isActive: el.id === stageId };
      }
      return el;
    });
    onElementsChange(updatedElements);
  };

  const handleSectionDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSectionDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const elementData = e.dataTransfer.getData('element');
    const fromRenderer = e.dataTransfer.getData('fromRenderer');
    const elementId = e.dataTransfer.getData('elementId');

    if (!elementData) return;

    const element: FormElement = JSON.parse(elementData);

    // Si viene del Renderer, mover el elemento a la section
    if (fromRenderer === 'true') {
      // Remover el elemento de su ubicación actual
      const updatedElements = removeElementById(elements, elementId);
      // Agregar el elemento a la section
      const finalElements = addElementToSection(updatedElements, sectionId, element);
      onElementsChange(finalElements);
    } else {
      // Si viene de Factory, clonar con nuevo ID y agregar a la section
      const elementWithNewId = cloneElementWithNewId(element);
      const updatedElements = addElementToSection(elements, sectionId, elementWithNewId);
      onElementsChange(updatedElements);
    }
  };

  const removeElementById = (elements: FormElement[], elementId: string): FormElement[] => {
    return elements
      .filter(el => el.id !== elementId)
      .map(el => {
        if (el.type === 'section') {
          return {
            ...el,
            children: removeElementById(el.children, elementId)
          };
        }
        return el;
      });
  };

  const addElementToSection = (elements: FormElement[], sectionId: string, newElement: FormElement): FormElement[] => {
    return elements.map(el => {
      if (el.type === 'section' && el.id === sectionId) {
        return {
          ...el,
          children: [...el.children, newElement]
        };
      }
      if (el.type === 'section') {
        return {
          ...el,
          children: addElementToSection(el.children, sectionId, newElement)
        };
      }
      return el;
    });
  };


  const isSectionVisible = (section: SectionElement, allElements: FormElement[]): boolean => {
    if (!section.condition) return true;

    // Buscar el radio por nombre
    const radio = allElements.find(
      el => el.type === 'radio' && (el as any).name === section.condition?.dependsOn
    );

    if (!radio) return false;

    // Verificar la respuesta del radio
    const dependentValue = radioValues[radio.id];
    return dependentValue === section.condition.value;
  };

  const renderElement = (element: FormElement): React.ReactNode => {
    if (element.type === 'text') {
      return renderTextElement(element);
    } else if (element.type === 'button') {
      return (
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: 'green',
            '&:hover': { backgroundColor: 'darkgreen' },
          }}
        >
          {element.label}
        </Button>
      );
    } else if (element.type === 'radio') {
      return (
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={radioValues[element.id] || ''}
            onChange={(e) => handleRadioChange(element.id, e.target.value)}
            sx={{ gap: 0, mt: -1 }}
          >
            {element.options.map((option, idx) => (
              <FormControlLabel
                key={idx}
                value={option}
                control={
                  <Radio
                    sx={{
                      color: 'green',
                      '&.Mui-checked': {
                        color: 'green',
                      },
                      py: 0.25,
                    }}
                  />
                }
                label={option}
                sx={{ my: 0, py: 0 }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    } else if (element.type === 'section') {
      return renderSection(element);
    } else if (element.type === 'stage') {
      return renderStage(element);
    }
    return null;
  };

  const handleDeleteStage = (e: React.MouseEvent, stageId: string) => {
    e.stopPropagation(); // Evitar que active el stage al eliminar
    const updatedElements = elements.filter(el => el.id !== stageId);
    onElementsChange(updatedElements);
  };

  const renderStage = (stage: StageElement) => {
    return (
      <Paper
        onClick={() => handleStageClick(stage.id)}
        elevation={stage.isActive ? 8 : 2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          p: 3,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: stage.isActive ? '#4caf50' : '#fff',
          color: stage.isActive ? '#fff' : '#333',
          border: stage.isActive ? '3px solid #2e7d32' : '2px solid #ddd',
          minHeight: '130px',
          height: '100%',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
            backgroundColor: stage.isActive ? '#45a049' : '#f9f9f9',
          },
          '&:hover .delete-button': {
            opacity: 1,
          },
        }}
      >
        {/* Botón de eliminar */}
        <Box
          className="delete-button"
          onClick={(e) => handleDeleteStage(e, stage.id)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            backgroundColor: '#d32f2f',
            color: '#fff',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#b71c1c',
            },
            zIndex: 10,
          }}
        >
          <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>×</Typography>
        </Box>

        <Box
          sx={{
            color: stage.isActive ? '#fff' : '#4caf50',
            transition: 'color 0.3s ease',
          }}
        >
          {STAGE_ICONS[stage.icon] || <PersonIcon sx={{ fontSize: 40 }} />}
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: stage.isActive ? 700 : 500,
            textAlign: 'center',
          }}
        >
          {stage.name}
        </Typography>
        {stage.isActive && (
          <Box
            sx={{
              width: '80%',
              height: '4px',
              backgroundColor: '#fff',
              borderRadius: '2px',
              mt: 1,
            }}
          />
        )}
      </Paper>
    );
  };

  const renderSection = (section: SectionElement) => {
    const isVisible = isSectionVisible(section, elements);

    // Si tiene condición y no se cumple, no renderizar nada
    if (section.condition && !isVisible) {
      return null;
    }

    return (
      <Box
        sx={{
          border: '2px solid #9c27b0',
          borderRadius: 2,
          padding: 2,
          backgroundColor: '#f3e5f5',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            pb: 1,
            borderBottom: '1px solid #9c27b0',
          }}
        >
          <AccountTreeIcon sx={{ color: '#9c27b0' }} />
          <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 600 }}>
            {section.title}
          </Typography>
        </Box>
        {section.condition && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#7b1fa2',
                fontStyle: 'italic',
              }}
            >
              Vinculado a: {section.condition.dependsOn} = "{section.condition.value}"
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minHeight: '80px',
            border: '2px dashed #ce93d8',
            borderRadius: 1,
            padding: 2,
            backgroundColor: 'rgba(156, 39, 176, 0.05)',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(156, 39, 176, 0.1)',
            }
          }}
          onDragOver={handleSectionDragOver}
          onDrop={(e) => handleSectionDrop(e, section.id)}
        >
          {section.children.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', py: 2, fontStyle: 'italic' }}
            >
              Arrastra elementos aquí
            </Typography>
          ) : (
            section.children.map((child) => (
              <Card
                key={child.id}
                draggable
                onDragStart={(e) => handleDragStartFromRenderer(e, child)}
                sx={{
                  boxShadow: 1,
                  cursor: 'grab',
                  '&:active': { cursor: 'grabbing' },
                  '&:hover': { boxShadow: 3 }
                }}
              >
                <CardContent>{renderElement(child)}</CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    );
  };

  const renderTextElement = (element: TextElement) => {
    const textType = element.textType || 'statement';

    const getTextStyle = () => {
      switch (textType) {
        case 'statement':
          return {
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            pl: 2,
          };
        case 'agentNote':
          return {
            color: '#666',
            fontWeight: 300,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            pl: 2,
          };
        case 'verbatimDisclosure':
          return {
            color: '#000',
            border: '2px dashed #d32f2f',
            borderRadius: '4px',
            padding: '12px',
            paddingLeft: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          };
        case 'regularQuestion':
          return {
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            pl: 2,
          };
        default:
          return {};
      }
    };

    const getIcon = () => {
      switch (textType) {
        case 'statement':
          return <RecordVoiceOverIcon sx={{ color: '#000', fontSize: 28 }} />;
        case 'agentNote':
          return <StickyNote2Icon sx={{ color: '#666', fontSize: 28 }} />;
        case 'verbatimDisclosure':
          return <ErrorIcon sx={{ color: '#d32f2f', fontSize: 28 }} />;
        case 'regularQuestion':
          return <HelpOutlineIcon sx={{ color: 'green', fontSize: 28 }} />;
        default:
          return null;
      }
    };

    return (
      <Box sx={getTextStyle()}>
        {getIcon()}
        <Typography variant="body1" sx={{ flex: 1, fontSize: '1.1rem', fontWeight: 500 }}>
          {parseTextWithHTML(element.text)}
        </Typography>
      </Box>
    );
  };

  // Separar stages de otros elementos
  const stages = elements.filter(el => el.type === 'stage') as StageElement[];
  const otherElements = elements.filter(el => el.type !== 'stage');

  return (
    <Box
      sx={{
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        minWidth: 0,
        backgroundColor: '#fafafa',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ p: 2, pb: 0, width: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Renderizador
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Arrastra los elementos aquí
        </Typography>
      </Box>

      {/* Stages Section - Grid Horizontal */}
      {stages.length > 0 && (
        <Box
          sx={{
            p: 2,
            pt: 0,
            borderBottom: '2px solid #ddd',
            backgroundColor: '#f5f5f5',
            width: '100%',
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#4caf50', fontWeight: 600 }}>
            Stages
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: stages.length <= 3
                ? `repeat(${stages.length}, 1fr)`
                : 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 2,
              width: '100%',
            }}
          >
            {stages.map((stage) => (
              <Box
                key={stage.id}
                draggable
                onDragStart={(e) => handleDragStartFromRenderer(e, stage)}
                sx={{
                  cursor: 'grab',
                  '&:active': { cursor: 'grabbing' }
                }}
              >
                {renderStage(stage)}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Other Elements Section - Vertical */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          width: '100%',
          border: stages.length > 0 ? 'none' : '2px dashed #ccc',
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {otherElements.length === 0 && stages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              border: '2px dashed #ccc',
              borderRadius: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Arrastra stages y elementos aquí
            </Typography>
          </Box>
        ) : otherElements.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              border: '2px dashed #ccc',
              borderRadius: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Arrastra elementos aquí
            </Typography>
          </Box>
        ) : null}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {otherElements.map((element) => {
            if (element.type === 'section') {
              // Verificar si la sección debe mostrarse
              const isVisible = isSectionVisible(element, elements);
              if (element.condition && !isVisible) {
                return null; // No renderizar secciones ocultas
              }

              return (
                <Box
                  key={element.id}
                  draggable
                  onDragStart={(e) => handleDragStartFromRenderer(e, element)}
                  sx={{
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' }
                  }}
                >
                  {renderElement(element)}
                </Box>
              );
            }

            // Radio sin fondo, más integrado
            if (element.type === 'radio') {
              return (
                <Box
                  key={element.id}
                  draggable
                  onDragStart={(e) => handleDragStartFromRenderer(e, element)}
                  sx={{
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' },
                    py: 0.5
                  }}
                >
                  {renderElement(element)}
                </Box>
              );
            }

            return (
              <Card
                key={element.id}
                draggable
                onDragStart={(e) => handleDragStartFromRenderer(e, element)}
                sx={{
                  boxShadow: 2,
                  cursor: 'grab',
                  '&:active': { cursor: 'grabbing' },
                  '&:hover': { boxShadow: 4 }
                }}
              >
                <CardContent>{renderElement(element)}</CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
