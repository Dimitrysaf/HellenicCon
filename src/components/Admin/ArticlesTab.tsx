
'use client';

import { useState, useEffect } from 'react';
import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import Add from '@/components/Admin/Add';
import AddModal from '@/components/Admin/Modal';
import ErrorDialog from '@/components/Error';

interface HierarchicalConstitutionPart {
    id: string;
    number: number;
    name: string;
    content: string | null;
    parent_id: string | null;
    type: string;
    children: HierarchicalConstitutionPart[];
}

const ArticlesTab = () => {
    const [data, setData] = useState<HierarchicalConstitutionPart[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [contentType, setContentType] = useState<'Title' | 'Chapter' | 'Section' | 'Article'>('Article');
    const [parents, setParents] = useState<any[]>([]);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('/api/constitution');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch constitution data');
            }
            const result = await response.json();
            console.log('API result:', result);
            setData(result);
            // Flatten the hierarchical data to a simple list of parents
            const flatten = (items: HierarchicalConstitutionPart[]) => {
                let flatList: any[] = [];
                items.forEach(item => {
                    if (item && item.id && item.name) { // Ensure item and its id/name are valid
                        flatList.push(item);
                    }
                    if (item.children) {
                        flatList = flatList.concat(flatten(item.children));
                    }
                });
                console.log('Flattened parents list:', flatList);
                return flatList;
            };
            setParents(flatten(result));
        } catch (error: any) {
            console.error('Error fetching constitution data:', error);
            setErrorTitle('Data Fetch Error');
            setErrorMessage(error.message || 'An unknown error occurred while fetching data.');
            setErrorOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (type: 'Title' | 'Chapter' | 'Section' | 'Article') => {
        setContentType(type);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        fetchData(); // Refetch data after closing the modal
    };

    const handleErrorClose = () => {
        setErrorOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };

    const renderContent = (items: HierarchicalConstitutionPart[]) => {
        return items.map((item) => (
            <Box key={item.id} sx={{ ml: item.parent_id ? 2 : 0 }}>
                <Typography variant={item.type === 'title' ? 'h4' : item.type === 'chapter' ? 'h5' : 'h6'}>
                    {item.name}
                </Typography>
                {item.content && <Typography variant="body1" dangerouslySetInnerHTML={{ __html: item.content }} />}
                {item.children && item.children.length > 0 && renderContent(item.children)}
            </Box>
        ));
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography 
                variant="h1" 
                gutterBottom 
                sx={{ 
                    display: 'flex', 
                    fontSize: {
                    xs: '2.5rem',
                    sm: '3.5rem',
                    md: '4.5rem',
                    lg: '6rem',
                    },
                    wordBreak: 'break-word', 
                    overflowWrap: 'break-word',
                }}
                >
                <b>Articles</b>
                </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            {data && renderContent(data)}
            <Add onAdd={handleOpenModal} />
            <AddModal open={modalOpen} onClose={handleCloseModal} contentType={contentType} parents={parents} />
            <ErrorDialog open={errorOpen} onClose={handleErrorClose} title={errorTitle} message={errorMessage} />
        </Box>
    );
};

export default ArticlesTab;
