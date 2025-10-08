import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Button,

} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  onShareWhatsApp?: () => void;
  onShareMail?: () => void;
  onCopyLink?: () => void;
}


const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onClose,
  onShareWhatsApp,
  onShareMail,
  onCopyLink,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          width: 610,
          p: 1,
        },
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderBottom={"1px solid #CDCED1"}
        px={2}
        pt={1}
      >
        <DialogTitle
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            textAlign: "center",
            flex: 1,
            p: 0,
          }}
        >
          Share
        </DialogTitle>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          mt={1}
        >
          {/* WhatsApp */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<WhatsAppIcon sx={{ color: "#25D366" }} />}
            onClick={onShareWhatsApp}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              color: "text.primary",
              bgcolor: "background.paper",
              borderColor: "#CDCED1",
            }}
          >
            Whatsapp
          </Button>

          {/* Mail */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<EmailIcon sx={{ color: "black" }} />}
            onClick={onShareMail}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              color: "text.primary",
              bgcolor: "background.paper",
              borderColor: "#CDCED1",
            }}
          >
            Mail
          </Button>

          {/* Copy Link */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={onCopyLink}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              color: "text.primary",
              bgcolor: "background.paper",
              borderColor: "#CDCED1",
            }}
          >
            Copy Link
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
