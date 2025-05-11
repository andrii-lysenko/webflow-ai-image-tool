import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import SendIcon from "@mui/icons-material/Send";
import { SvgIconProps } from "@mui/material";

export const ChatIcon = (props: SvgIconProps) => (
  <ChatBubbleOutlineIcon {...props} />
);
export const ImageIcon = () => <ImageOutlinedIcon />;
export const MicrophoneIcon = () => <MicNoneOutlinedIcon />;
export { SendIcon };
