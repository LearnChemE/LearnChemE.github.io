import React, { useRef, useEffect } from "react";
import p5 from "p5";

// src/components/ReactP5Wrapper.tsx

export type P5CanvasInstance = any;

type ReactP5WrapperProps = {
    sketch: (p: P5CanvasInstance) => void;
    onFinish?: () => void;
    className?: string;
    style?: React.CSSProperties;
    // allow arbitrary additional props forwarded to sketch via updateWithProps
    [key: string]: any;
};

const ReactP5Wrapper: React.FC<ReactP5WrapperProps> = ({
    sketch,
    onFinish,
    className,
    style,
    ...rest
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const p5Ref = useRef<P5CanvasInstance | null>(null);

    // create/destroy p5 instance when sketch function changes
    useEffect(() => {
        if (!containerRef.current) return;

        // instantiate p5 with given sketch
        p5Ref.current = new p5((p: P5CanvasInstance) => {
            // provide a default updateWithProps so sketches can call it immediately if needed
            p.updateWithProps = (props: any) => {};
            sketch(p);
        }, containerRef.current);

        // initial props
        if (p5Ref.current?.updateWithProps) {
            p5Ref.current.updateWithProps({ onFinish, ...rest });
        }

        return () => {
            p5Ref.current?.remove();
            p5Ref.current = null;
        };
        // recreate only when the sketch function identity changes
    }, [sketch]);

    // forward props to p5 instance after every render
    useEffect(() => {
        if (p5Ref.current?.updateWithProps) {
            p5Ref.current.updateWithProps({ onFinish, ...rest });
        }
    });

    return <div ref={containerRef} className={className} style={style} />;
};

export default ReactP5Wrapper;