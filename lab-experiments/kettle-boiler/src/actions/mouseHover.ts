export interface onMouseHoverProps {
    onEnter: (e: MouseEvent) => void;
    onLeave?: (e: MouseEvent) => void;
};

export function mouseHover(el: HTMLElement, props: onMouseHoverProps) {
    el.addEventListener("mouseenter", props.onEnter);
    if (props.onLeave) el.addEventListener("mouseleave", props.onLeave);
    return () => {
        el.removeEventListener("mousemove", props.onEnter);
        if (props.onLeave) el.removeEventListener("mouseleave", props.onLeave);
    }
}