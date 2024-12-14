import React, { useState } from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

interface IProps {
    triggerButton: React.ReactNode;
    title?: string;
    content?: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmModal: React.FC<IProps> = ({
    triggerButton,
    title = 'Confirmation',
    content = 'Are you sure you want to proceed?',
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleConfirm = () => {
        onConfirm()
        setOpen(false)
    }

    return (
        <React.Fragment>
            <span onClick={() => setOpen(true)}>{triggerButton}</span>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <WarningRoundedIcon />
                        {title}
                    </DialogTitle>
                    <Divider />
                    <DialogContent>{content}</DialogContent>
                    <DialogActions>
                        <Button
                            variant="solid"
                            color="danger"
                            onClick={handleConfirm}
                        >
                            {confirmText}
                        </Button>
                        <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
                            {cancelText}
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
};

export default ConfirmModal;
