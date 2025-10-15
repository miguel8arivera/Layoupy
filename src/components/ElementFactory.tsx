import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CategoryIcon from '@mui/icons-material/Category';
import { useState } from 'react';
import type { FormElement } from '../types/elements';
import TextElementCreator from './creators/TextElementCreator';
import RadioElementCreator from './creators/RadioElementCreator';
import ButtonElementCreator from './creators/ButtonElementCreator';
import SectionElementCreator from './creators/SectionElementCreator';
import StageElementCreator from './creators/StageElementCreator';

const DRAWER_WIDTH = 200;

interface ElementFactoryProps {
  isVisible: boolean;
  onToggle: () => void;
  onRemoveFromRenderer: (elementId: string) => void;
}

export default function ElementFactory({
  isVisible,
  onToggle,
  onRemoveFromRenderer,
}: ElementFactoryProps) {
  const [selectedType, setSelectedType] = useState<'text' | 'radio' | 'button' | 'section' | 'stage'>(
    'text'
  );
  const [elements, setElements] = useState<FormElement[]>([]);

  const handleCreateElement = (element: FormElement) => {
    setElements([...elements, element]);
  };

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, element: FormElement) => {
    e.dataTransfer.setData('element', JSON.stringify(element));
  };

  const handleTypeSelect = (type: 'text' | 'radio' | 'button' | 'section' | 'stage') => {
    setSelectedType(type);
    if (!isVisible) {
      onToggle();
    }
  };

  const handleDragOverFactory = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropInFactory = (e: React.DragEvent) => {
    e.preventDefault();
    const fromRenderer = e.dataTransfer.getData('fromRenderer');
    const elementId = e.dataTransfer.getData('elementId');

    // Solo procesar si viene del Renderer
    if (fromRenderer === 'true' && elementId) {
      onRemoveFromRenderer(elementId);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      width: isVisible ? 'auto' : `${DRAWER_WIDTH}px`,
      flexShrink: 0,
    }}>
      {/* Drawer Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            position: 'relative',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Types
          </Typography>
        </Box>
        <List sx={{ flexGrow: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedType === 'text'}
              onClick={() => handleTypeSelect('text')}
            >
              <ListItemIcon>
                <TextFieldsIcon />
              </ListItemIcon>
              <ListItemText primary="Texto" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedType === 'radio'}
              onClick={() => handleTypeSelect('radio')}
            >
              <ListItemIcon>
                <RadioButtonCheckedIcon />
              </ListItemIcon>
              <ListItemText primary="Opciones" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedType === 'button'}
              onClick={() => handleTypeSelect('button')}
            >
              <ListItemIcon>
                <SmartButtonIcon />
              </ListItemIcon>
              <ListItemText primary="Botón" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedType === 'section'}
              onClick={() => handleTypeSelect('section')}
            >
              <ListItemIcon>
                <AccountTreeIcon />
              </ListItemIcon>
              <ListItemText primary="Section" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedType === 'stage'}
              onClick={() => handleTypeSelect('stage')}
            >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Stage" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ p: 1 }}>
          <Button
            onClick={onToggle}
            fullWidth
            startIcon={
              isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />
            }
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              justifyContent: 'flex-start',
              color: isVisible ? '#757575' : '#1976d2',
              backgroundColor: isVisible
                ? 'rgba(0, 0, 0, 0.02)'
                : 'rgba(25, 118, 210, 0.08)',
              '&:hover': {
                backgroundColor: isVisible
                  ? 'rgba(0, 0, 0, 0.08)'
                  : 'rgba(25, 118, 210, 0.15)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {isVisible ? 'Hide' : 'Show'}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                Factory
              </Typography>
            </Box>
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      {isVisible && (
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            backgroundColor: '#f5f5f5',
            overflowY: 'auto',
          }}
          onDragOver={handleDragOverFactory}
          onDrop={handleDropInFactory}
        >
          <Typography variant="h5" gutterBottom>
            Fábrica de Elementos
          </Typography>

          {/* Creator Section */}
          <Box sx={{ mb: 3, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
            {selectedType === 'text' && (
              <TextElementCreator onCreateElement={handleCreateElement} />
            )}
            {selectedType === 'radio' && (
              <RadioElementCreator
                onCreateElement={handleCreateElement}
                existingElements={elements}
              />
            )}
            {selectedType === 'button' && (
              <ButtonElementCreator onCreateElement={handleCreateElement} />
            )}
            {selectedType === 'section' && (
              <SectionElementCreator
                onCreateElement={handleCreateElement}
                availableElements={elements}
              />
            )}
            {selectedType === 'stage' && (
              <StageElementCreator />
            )}
          </Box>

          {/* Elements List */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Elementos Creados
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {elements.map((element) => (
              <Card
                key={element.id}
                draggable
                onDragStart={(e) => handleDragStart(e, element)}
                sx={{
                  cursor: 'grab',
                  '&:active': { cursor: 'grabbing' },
                  '&:hover': { boxShadow: 3 },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      {element.type === 'text' ? (
                        <Typography variant="body1">{element.text}</Typography>
                      ) : element.type === 'button' ? (
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
                      ) : element.type === 'section' ? (
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <AccountTreeIcon fontSize="small" />
                            {element.title}
                          </Typography>
                          {element.condition && (
                            <Typography variant="caption" color="text.secondary">
                              Visible cuando: {element.condition.value}
                            </Typography>
                          )}
                        </Box>
                      ) : element.type === 'radio' ? (
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {element.name}
                          </Typography>
                          {element.options.map((opt, idx) => (
                            <Typography
                              key={idx}
                              variant="body2"
                              sx={{ ml: 1 }}
                            >
                              ○ {opt}
                            </Typography>
                          ))}
                        </Box>
                      ) : element.type === 'stage' ? (
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <CategoryIcon fontSize="small" />
                            {element.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Icon: {element.icon}
                          </Typography>
                        </Box>
                      ) : null}
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteElement(element.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
