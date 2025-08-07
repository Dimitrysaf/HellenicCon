'use client';

import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ArticleIcon from '@mui/icons-material/Article';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

interface AddProps {
  onAdd: (type: 'Title' | 'Chapter' | 'Section' | 'Article') => void;
}

const actions = [
  { icon: <CreateNewFolderIcon />, name: 'Title', type: 'Title' },
  { icon: <FolderIcon />, name: 'Chapter', type: 'Chapter' },
  { icon: <FolderOpenIcon />, name: 'Section', type: 'Section' },
  { icon: <ArticleIcon />, name: 'Article', type: 'Article' },
];

export default function Add({ onAdd }: AddProps) {
  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
      direction="up"
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={() => onAdd(action.type as 'Title' | 'Chapter' | 'Section' | 'Article')}
        />
      ))}
    </SpeedDial>
  );
}