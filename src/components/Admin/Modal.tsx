
'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { Box, Button, Modal, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Divider, Tooltip } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import SaveIcon from '@mui/icons-material/Save';


import CancelIcon from '@mui/icons-material/Cancel';
import ErrorDialog from '@/components/Error';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    contentType: 'Title' | 'Chapter' | 'Section' | 'Article';
    parents: any[];
}

const AddModal = ({ open, onClose, contentType, parents }: ModalProps) => {
    const [id, setId] = useState(uuidv4());
    const [name, setName] = useState('');
    const [number, setNumber] = useState(1);
        const [parentId, setParentId] = useState<string | null>('');
    const [content, setContent] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (open) {
            setId(uuidv4());
            // Reset other fields as well
            setName('');
            setParentId('');
            setContent('');
        }
    }, [open]);

    useEffect(() => {
        if (parentId === '' || parents.length === 0) {
            setNumber(1);
        } else {
            const parent = parents.find(p => p.id === parentId);
            if (parent && parent.children) {
                setNumber(parent.children.length + 1);
            } else {
                setNumber(1);
            }
        }
    }, [parentId, parents]);

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setNumber(value < 1 ? 1 : value);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const applyFormatting = (format: string) => {
        const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = content.substring(start, end);
            const newContent = `${content.substring(0, start)}${format}${selectedText}${format}${content.substring(end)}`;
            setContent(newContent);
        }
    };

    let disableReason = '';
    let canSave = true;

    if (!name) {
        canSave = false;
        disableReason = 'Name cannot be empty.';
    } else if (contentType !== 'Title' && parentId === '') {
        canSave = false;
        disableReason = 'Parent must be selected.';
    } else if (contentType === 'Article' && !content) {
        canSave = false;
        disableReason = 'Content cannot be empty for articles.';
    }

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/constitution', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name, number, parent_id: parentId === '' ? null : parentId, content, type: contentType.toLowerCase() })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save data');
            }
            onClose();
        } catch (error: any) {
            console.error('Error saving constitution part:', error);
            setErrorTitle('Save Error');
            setErrorMessage(error.message || 'An unknown error occurred while saving data.');
            setErrorOpen(true);
        }
    };

    const handleErrorClose = () => {
        setErrorOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ ...style, width: '80%' }}>
                <Typography variant="h6" component="h2">Add {contentType}</Typography>
                <TextField label="ID" value={id} disabled fullWidth margin="normal" />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField label="Number" type="number" value={number} onChange={handleNumberChange} fullWidth margin="normal" inputProps={{ min: 1 }} />
                    <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
                </Box>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Parent</InputLabel>
                    <Select value={parentId} onChange={(e) => setParentId(e.target.value)}>
                        <MenuItem value="">None</MenuItem>
                        {parents.filter(p => p && typeof p === 'object' && 'id' in p && 'name' in p).map((p) => {
                            console.log('Parent object in map:', p);
                            return (
                                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <Divider sx={{ my: 2 }} />
                {contentType === 'Article' && (
                    <Box>
                        <Button onClick={() => applyFormatting('**')}>Bold</Button>
                        <TextField
                            id="content-textarea"
                            label="Content"
                            multiline
                            rows={45}
                            value={content}
                            onChange={handleContentChange}
                            fullWidth
                            margin="normal"
                        />
                    </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button variant="outlined" startIcon={<CancelIcon />} onClick={onClose}>
                        Cancel
                    </Button>
                    <Tooltip title={disableReason} placement="top" arrow>
                        <span>
                            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSubmit} disabled={!canSave}>
                                Save
                            </Button>
                        </span>
                    </Tooltip>
                </Box>
            </Box>
        </Modal>
    );
};

const style = {
    position: 'absolute' as 'absolute',
    top: '5%',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
};

export default AddModal;


