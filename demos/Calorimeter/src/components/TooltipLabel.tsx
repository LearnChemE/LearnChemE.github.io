import { Tooltip } from "react-tooltip";

interface TooltipLabelProps {
  name: string;
  content: string;
}

export const TooltipLabel: React.FC<TooltipLabelProps> = ({
  name,
  content,
}) => {
  let key = name.toLowerCase();

  return (
    <>
      <a className="tooltip-anchor" data-tooltip-id={key + "-tooltip"}></a>
      <Tooltip id={key + "-tooltip"}>{content}</Tooltip>
    </>
  );
};
