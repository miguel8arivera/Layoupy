import { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
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
import type { StageElement } from '../../types/elements';

interface StageElementCreatorProps {
  onElementCreated?: (element: StageElement) => void;
}

const INSURANCE_ICONS = [
  { value: 'person', label: 'Person', icon: <PersonIcon /> },
  { value: 'check-circle', label: 'Check Circle', icon: <CheckCircleIcon /> },
  { value: 'assignment', label: 'Assignment', icon: <AssignmentIcon /> },
  { value: 'present', label: 'Present', icon: <PresentToAllIcon /> },
  { value: 'handshake', label: 'Handshake', icon: <HandshakeIcon /> },
  { value: 'health', label: 'Health & Safety', icon: <HealthAndSafetyIcon /> },
  { value: 'family', label: 'Family', icon: <FamilyRestroomIcon /> },
  { value: 'hospital', label: 'Hospital', icon: <LocalHospitalIcon /> },
  { value: 'money', label: 'Money', icon: <AttachMoneyIcon /> },
  { value: 'bank', label: 'Bank', icon: <AccountBalanceIcon /> },
  { value: 'verified', label: 'Verified User', icon: <VerifiedUserIcon /> },
  { value: 'contact', label: 'Contact', icon: <ContactPhoneIcon /> },
  { value: 'document', label: 'Document', icon: <DescriptionIcon /> },
  { value: 'legal', label: 'Legal', icon: <GavelIcon /> },
  { value: 'home', label: 'Home', icon: <HomeIcon /> },
  { value: 'car', label: 'Car', icon: <DriveEtaIcon /> },
];

export default function StageElementCreator({
  onElementCreated,
}: StageElementCreatorProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('person');

  const handleDragStart = (e: React.DragEvent) => {
    if (!name.trim()) {
      e.preventDefault();
      return;
    }

    const element: StageElement = {
      id: crypto.randomUUID(),
      type: 'stage',
      name: name.trim(),
      icon,
      isActive: false,
    };

    e.dataTransfer.setData('element', JSON.stringify(element));

    if (onElementCreated) {
      onElementCreated(element);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Stage</Typography>

      <TextField
        label="Stage Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Introduction"
        size="small"
        fullWidth
      />

      <FormControl fullWidth size="small">
        <InputLabel>Icon</InputLabel>
        <Select
          value={icon}
          label="Icon"
          onChange={(e) => setIcon(e.target.value)}
        >
          {INSURANCE_ICONS.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.icon}
                <Typography>{item.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        draggable={!!name.trim()}
        onDragStart={handleDragStart}
        sx={{
          border: '2px dashed #1976d2',
          borderRadius: 2,
          padding: 2,
          textAlign: 'center',
          cursor: name.trim() ? 'grab' : 'not-allowed',
          backgroundColor: name.trim() ? '#e3f2fd' : '#f5f5f5',
          opacity: name.trim() ? 1 : 0.5,
          '&:active': {
            cursor: name.trim() ? 'grabbing' : 'not-allowed',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {INSURANCE_ICONS.find((i) => i.value === icon)?.icon}
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {name.trim() || 'Enter a name'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {name.trim() ? 'Drag to Renderer' : 'Name required'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
