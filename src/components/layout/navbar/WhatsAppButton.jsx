import { useState, useEffect } from 'react';
import { Box, Modal, Typography, TextField, IconButton, Button } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import './WhatsAppButton.css';

const WhatsAppButton = ({ phoneNumber, defaultMessage }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(defaultMessage);
  const [showText, setShowText] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSend = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    handleClose();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShowText(true);
      setTimeout(() => {
        setShowText(false);
      }, 5000);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Box className="whatsapp-button-container">
        <Box className={`whatsapp-text-container ${showText ? 'show-text' : ''}`}>
          <Typography className="whatsapp-text">Envíanos un mensaje</Typography>
        </Box>
        <Box className="whatsapp-button" onClick={handleOpen}>
          <WhatsAppIcon style={{ fontSize: '30px' }} />
        </Box>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Enviar mensaje por WhatsApp</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="success" onClick={handleSend} startIcon={<WhatsAppIcon />}>
              Enviar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default WhatsAppButton;
