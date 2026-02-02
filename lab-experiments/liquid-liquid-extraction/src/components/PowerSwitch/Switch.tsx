import { onMount, Show, type Component } from "solid-js";
import "./Switch.css"

export interface PowerSwitchProps {
  x: number;
  y: number;
  label: string;
  isOn: () => boolean;
  setIsOn: (value: boolean) => void;
}

export const PowerSwitch: Component<PowerSwitchProps> = (props) => {
  return (
    <g transform={`translate(${props.x} ${props.y})`}>
        <PowerSwitchBackground label={props.label} />

        <g transform="translate(4 35)">
          <path d="M1 0.5H47C47.2761 0.5 47.5 0.723857 47.5 1V19.7275C47.4999 20.0036 47.2761 20.2275 47 20.2275H1C0.723947 20.2275 0.500144 20.0036 0.5 19.7275V1C0.5 0.723859 0.723857 0.5 1 0.5Z" fill="black" stroke="black"/>
          <rect x="2.18182" y="2.18182" width="43.6364" height="16.3636" fill="#7B0101"/>
          {/* On side */}
          <g class={!props.isOn() ? "switchPress drag-exempt" : "drag-exempt"} onClick={() => props.setIsOn(true)}>
            <Show when={!props.isOn()}>
              <path d="M4.36364 1.09094L24 2.21488V18.5455L4.36364 19.6364V1.09094Z" fill="#D90000"/> 
              <path d="M2.18182 2.21491L4.36364 1.09094V19.6364L2.18182 18.5455V2.21491Z" fill="#7B0101"/>
            </ Show>
          </g>
          <line x1="12.5" y1="3.27271" x2="12.5" y2="16.4628" stroke="#EED5D5" style="pointer-events: none;"/>

          {/* Off side */}
          <g class={props.isOn() ? "switchPress drag-exempt" : "drag-exempt"} onClick={() => props.setIsOn(false)}>
            <Show when={props.isOn()}>
              <path d="M43.6364 1.09088L24 2.18176V18.5454L43.6364 19.6363V1.09088Z" fill="#D90000"/>
              <path d="M45.8182 2.18179L43.6364 1.09088V19.6363L45.8182 18.5454V2.18179Z" fill="#7B0101"/>
            </Show>
          </g>
          <path style="pointer-events: none;" d="M35.4322 4.95453C38.3894 4.95471 40.8179 7.27068 40.8179 10.1655C40.8178 13.0602 38.3893 15.3762 35.4322 15.3764C32.4748 15.3764 30.0455 13.0603 30.0454 10.1655C30.0454 7.27056 32.4748 4.95453 35.4322 4.95453Z" stroke="#EED5D5"/>
        </g>

    </g>
  );
};

const PowerSwitchBackground: Component<{ label: string }> = ({ label }) => {
  let text!: SVGTextElement;
  let box!: SVGRectElement;
  onMount(() => {
    if (!text || !box) {
      throw new Error("Failed to reference after mount");
    }
    const bbox = text.getBBox();
    box.setAttribute("x", `${bbox.x - 2}`);
    box.setAttribute("width", `${bbox.width + 4}`);
  })

  return (
    <g>
        <rect x="0.5" y="17.5" width="55" height="42" rx="3.5" fill="#353535" stroke="black"/>
        <rect x="2" y="22" width="52" height="34" rx="4" fill="#6B6B6B"/>
        <rect x="12" y="20" width="32" height="14" fill="#F6F6F6" ref={box} />
        <text x="27" y="33" fill="black" font-size="14" text-anchor="middle" font-weight={400} ref={text}>{ label }</text>
        <path d="M44 0C44 10.9286 38.5 10.9286 32 10.9286C25.5 10.9286 22 12.1429 22 17" stroke="black"/>
    </g>
  );
}