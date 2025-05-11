import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import SendIcon from "@mui/icons-material/Send";

export const ChatIcon = () => (
  <ChatBubbleOutlineIcon style={{ width: 48, height: 48 }} />
);
export const ImageIcon = () => <ImageOutlinedIcon />;
export const MicrophoneIcon = () => <MicNoneOutlinedIcon />;
export { SendIcon };

// LoadingIcon is no longer needed as we're using CircularProgress
