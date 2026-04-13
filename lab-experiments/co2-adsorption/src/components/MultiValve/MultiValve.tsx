import { getAngleFromDown, getSVGCoords, resolveProperty } from "../../globals";
import "./MultiValve.css";
import { createSignal, type Accessor, type Component, type Setter } from "solid-js";

interface MultiValveProps {
  x: number | Accessor<number>;
  y: number | Accessor<number>;
  directions?: number[] | Accessor<number[]>;
  angle?: Accessor<number>;
  setAngle: Setter<number>;
}

export const MultiValve: Component<MultiValveProps> = (props) => {
    const directions = resolveProperty(props.directions, [0]);
    const angle = resolveProperty(props.angle, directions()[0]);
    const x = resolveProperty(props.x);
    const y = resolveProperty(props.y);

    const cx = 25.5;
    const cy = 36;

    const nextAng = () => {
      const dirs = directions();
      const curAngle = angle();
      const curIdx = dirs.findIndex(val => val === curAngle);
      if (curIdx === -1) throw new Error(`Couldn't find angle ${curAngle} in directions array: ${dirs.toString()}`);

      props.setAngle((curIdx + 1) % dirs.length);
    }

  // Render
  return (
    <g transform={`translate(${x()}, ${y()})`}>

<rect x="0.5" y="10.5" width="4" height="15" rx="0.5" fill="url(#paint0_linear_45_20)" stroke="black"/>
<rect x="25.5" y="0.5" width="4" height="15" rx="0.5" transform="rotate(90 25.5 0.5)" fill="url(#paint1_linear_45_20)" stroke="black"/>
<rect x="25.5" y="31.5" width="4" height="15" rx="0.5" transform="rotate(90 25.5 31.5)" fill="url(#paint2_linear_45_20)" stroke="black"/>
<rect x="31.5" y="10.5" width="4" height="15" rx="0.5" fill="url(#paint3_linear_45_20)" stroke="black"/>
<g clip-path="url(#paint4_angular_45_20_clip_path)" data-figma-skip-parse="true"><g transform="matrix(-0.016 0.016 -0.016 -0.016 18 18)"><foreignObject x="-1062.5" y="-1062.5" width="2125" height="2125"><div style="background:conic-gradient(from 90deg,rgba(52, 53, 54, 1) 0deg,rgba(186, 190, 194, 1) 180deg,rgba(53, 53, 54, 1) 360deg);height:100%;width:100%;opacity:1"></div></foreignObject></g></g><circle cx="18" cy="18" r="15.5" data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_ANGULAR&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.20598490536212921,&#34;g&#34;:0.20912753045558929,&#34;b&#34;:0.21305583417415619,&#34;a&#34;:1.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.7294117808341980,&#34;g&#34;:0.74509805440902710,&#34;b&#34;:0.76078432798385620,&#34;a&#34;:1.0},&#34;position&#34;:0.50},{&#34;color&#34;:{&#34;r&#34;:0.20784313976764679,&#34;g&#34;:0.20784313976764679,&#34;b&#34;:0.21176470816135406,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.20598490536212921,&#34;g&#34;:0.20912753045558929,&#34;b&#34;:0.21305583417415619,&#34;a&#34;:1.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.7294117808341980,&#34;g&#34;:0.74509805440902710,&#34;b&#34;:0.76078432798385620,&#34;a&#34;:1.0},&#34;position&#34;:0.50},{&#34;color&#34;:{&#34;r&#34;:0.20784313976764679,&#34;g&#34;:0.20784313976764679,&#34;b&#34;:0.21176470816135406,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;transform&#34;:{&#34;m00&#34;:-32.0,&#34;m01&#34;:-32.0,&#34;m02&#34;:50.0,&#34;m10&#34;:32.0,&#34;m11&#34;:-32.0,&#34;m12&#34;:18.0},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}" stroke="black"/>
<g clip-path="url(#paint5_angular_45_20_clip_path)" data-figma-skip-parse="true"><g transform="matrix(-0.008 0.008 -0.008 -0.008 18 18)"><foreignObject x="-1125" y="-1125" width="2250" height="2250"><div style="background:conic-gradient(from 90deg,rgba(143, 143, 143, 1) 0deg,rgba(242, 242, 242, 1) 180deg,rgba(144, 144, 144, 1) 360deg);height:100%;width:100%;opacity:1"></div></foreignObject></g></g><circle cx="18" cy="18" r="7.5" data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_ANGULAR&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.56377702951431274,&#34;g&#34;:0.56377702951431274,&#34;b&#34;:0.56377702951431274,&#34;a&#34;:1.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.95046573877334595,&#34;g&#34;:0.95046573877334595,&#34;b&#34;:0.95046573877334595,&#34;a&#34;:1.0},&#34;position&#34;:0.50},{&#34;color&#34;:{&#34;r&#34;:0.56470590829849243,&#34;g&#34;:0.56470590829849243,&#34;b&#34;:0.56470590829849243,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.56377702951431274,&#34;g&#34;:0.56377702951431274,&#34;b&#34;:0.56377702951431274,&#34;a&#34;:1.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.95046573877334595,&#34;g&#34;:0.95046573877334595,&#34;b&#34;:0.95046573877334595,&#34;a&#34;:1.0},&#34;position&#34;:0.50},{&#34;color&#34;:{&#34;r&#34;:0.56470590829849243,&#34;g&#34;:0.56470590829849243,&#34;b&#34;:0.56470590829849243,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;transform&#34;:{&#34;m00&#34;:-16.0,&#34;m01&#34;:-16.0,&#34;m02&#34;:34.0,&#34;m10&#34;:16.0,&#34;m11&#34;:-16.0,&#34;m12&#34;:18.0},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}" stroke="black"/>

<g 
  class="drag-exempt clickable" 
  transform={`translate(${angle()}, ${cx}, ${cy})`}
  onClick={nextAng}>
  <rect x="24.5" y="15.5" width="5" height="10" rx="1.5" transform="rotate(90 24.5 15.5)" fill="#D9D9D9" stroke="black"/>
  <path d="M16.3926 18.9277V17.0732L18 16.1445L19.6074 17.0732V18.9277L18 19.8564L16.3926 18.9277Z" fill="#F2F2F2" stroke="black" stroke-width="0.25"/>
  <path d="M77.5 18C77.5 21.0376 75.0376 23.5 72 23.5H24C23.1716 23.5 22.5 22.8284 22.5 22V14C22.5 13.1716 23.1716 12.5 24 12.5H72L72.2832 12.5068C75.1892 12.6542 77.5 15.0574 77.5 18Z" fill="#E8AD17" stroke="black"/>
</g>

<defs>
<clipPath id="paint4_angular_45_20_clip_path"><circle cx="18" cy="18" r="15.5"/></clipPath><clipPath id="paint5_angular_45_20_clip_path"><circle cx="18" cy="18" r="7.5"/></clipPath><linearGradient id="paint0_linear_45_20" x1="2.5" y1="25" x2="2.5" y2="11" gradientUnits="userSpaceOnUse">
<stop stop-color="#585C61"/>
<stop offset="0.7" stop-color="#BABEC2"/>
<stop offset="1" stop-color="#8A8A97"/>
</linearGradient>
<linearGradient id="paint1_linear_45_20" x1="28.5" y1="15" x2="28.5" y2="0.999999" gradientUnits="userSpaceOnUse">
<stop stop-color="#585C61"/>
<stop offset="0.7" stop-color="#BABEC2"/>
<stop offset="1" stop-color="#8A8A97"/>
</linearGradient>
<linearGradient id="paint2_linear_45_20" x1="28.5" y1="46" x2="28.5" y2="32" gradientUnits="userSpaceOnUse">
<stop stop-color="#585C61"/>
<stop offset="0.7" stop-color="#BABEC2"/>
<stop offset="1" stop-color="#8A8A97"/>
</linearGradient>
<linearGradient id="paint3_linear_45_20" x1="33.5" y1="25" x2="33.5" y2="11" gradientUnits="userSpaceOnUse">
<stop stop-color="#585C61"/>
<stop offset="0.7" stop-color="#BABEC2"/>
<stop offset="1" stop-color="#8A8A97"/>
</linearGradient>
</defs>

    </g>
)};

export default MultiValve;