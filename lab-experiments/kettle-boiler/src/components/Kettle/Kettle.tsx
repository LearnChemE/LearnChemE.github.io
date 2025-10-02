import { createEffect, createMemo, createSignal, onMount, type Component } from "solid-js";
import "./Kettle.css";
import { animateChamberEnergyBalance, animateChamberMassBalance, calculateSteamOut, type ChamberFills, type Temperatures } from "./KettleLogic";

export interface KettleProps {
  // Inputs
  feedRate: () => number; // in gal/min
  steamTemp: () => number; // in C

  // Outputs
  onOutletChange?: (outletTemp: number) => void; // Callback for outlet flowrate change
  onEvaporateChange?: (evapCh: number) => void; // Callback for evaporation change, in gal/m
  onSteamOutChange?: (concCh: number) => void; // Callback for steam flowrate change
};

export const Kettle: Component<KettleProps> = (props) => {
  // Start empty
  const [chamberFill, setChamberFill] = createSignal(0); // 0 to 1
  const [pathFill, setPathFill] = createSignal(0); // 0 to 1
  const [overflowFill, setOverflowFill] = createSignal(0); // 0 to 1
  const [internalEvaporateRate, setInternalEvaporateRate] = createSignal(0);
  // Temps
  const [chamberTemperature, setChamberTemperature] = createSignal(298);
  const [overflowTemperature, setOverflowTemperature] = createSignal(298);

  onMount(() => {
    // Initially hide the exterior
    setTimeout(() => {
      document.querySelectorAll('.kettle-exterior').forEach(el => el.classList.add('kettle-exterior-hidden'));
    }, 1000); // Slight delay to ensure CSS transition
  });

  // Memo to update the steam outlet
  const steamOut = createMemo(() => calculateSteamOut(chamberFill(), props.steamTemp(), chamberTemperature()));
  if (props.onSteamOutChange) createEffect(() => props.onSteamOutChange!(steamOut()));

  // Animations for the three fills
  const fills: ChamberFills = { chamberFill, pathFill, overflowFill, setChamberFill, setPathFill, setOverflowFill, internalEvaporateRate, setInternalEvaporateRate };
  const temps: Temperatures = { chamberTemperature, setChamberTemperature, overflowTemperature, setOverflowTemperature };
  animateChamberMassBalance(props, fills);
  animateChamberEnergyBalance(props, fills, temps);

  // Render
  return (
  <>
    <g id="kettle">
      <g id="interior">
        <path
          id="Rectangle 72"
          d="M511.5 392.5V402C511.5 403.381 510.381 404.5 509 404.5H487C485.619 404.5 484.5 403.381 484.5 402V392.5H511.5Z"
          fill="url(#paint44_linear_6_626)"
          stroke="black"
        />
        <path
          id="Rectangle 74_2"
          d="M1025.5 214.5V209C1025.5 208.172 1024.83 207.5 1024 207.5H1000C999.172 207.5 998.5 208.172 998.5 209V214.5H1025.5Z"
          fill="url(#paint45_linear_6_626)"
          stroke="black"
        />
        <path
          id="Rectangle 75_2"
          d="M854.5 214.5V209C854.5 208.172 853.828 207.5 853 207.5H829C828.172 207.5 827.5 208.172 827.5 209V214.5H854.5Z"
          fill="url(#paint46_linear_6_626)"
          stroke="black"
        />
        <path
          id="Rectangle 73_2"
          d="M978.5 397.5V402C978.5 403.381 977.381 404.5 976 404.5H954C952.619 404.5 951.5 403.381 951.5 402V397.5H978.5Z"
          fill="url(#paint47_linear_6_626)"
          stroke="black"
        />
        <path
          id="walls"
          d="M1018 214.011H1023.48C1023.48 214.011 1085 211.05 1085 306.011C1085 400.972 1023.48 397.936 1023.48 397.936H1018V398H529.214C519.75 398 510.298 397.329 500.93 395.99L494.07 395.011C484.702 393.672 475.25 393 465.786 393H435V273C440.816 273 446.449 270.965 450.922 267.248L498.08 228.061C508.758 219.188 522.139 214.238 536 214.011V214H1018V214.011Z"
          fill="url(#paint48_linear_6_626)"
        />
        <g id="trap">
          <rect
            id="Rectangle 63"
            x="435.5"
            y="283.5"
            width="430"
            height="19"
            fill="url(#paint49_linear_6_626)"
            stroke="black"
          />
          <rect
            id="Rectangle 65"
            x="435.5"
            y="307.5"
            width="430"
            height="19"
            fill="url(#paint50_linear_6_626)"
            stroke="black"
          />
          <rect
            id="Rectangle 66"
            x="435.5"
            y="339.5"
            width="430"
            height="19"
            fill="url(#paint51_linear_6_626)"
            stroke="black"
          />
          <rect
            id="Rectangle 64"
            x="435.5"
            y="363.5"
            width="430"
            height="19"
            fill="url(#paint52_linear_6_626)"
            stroke="black"
          />
          <g id="Subtract">
            <mask id="path-161-inside-3_6_626" fill="white">
              <path
                d="M865.538 277C889.132 282.167 907 306.614 907 335.994C907 365.373 889.132 389.819 865.538 394.986V277Z"
              />
            </mask>
            <path
              d="M865.538 277C889.132 282.167 907 306.614 907 335.994C907 365.373 889.132 389.819 865.538 394.986V277Z"
              fill="#686155"
            />
            <path
              d="M865.538 277L865.752 276.024L864.538 275.758V277H865.538ZM865.538 394.986H864.538V396.229L865.752 395.963L865.538 394.986ZM865.538 277L865.324 277.977C888.363 283.022 906 306.978 906 335.994H907H908C908 306.25 889.901 281.311 865.752 276.024L865.538 277ZM907 335.994H906C906 365.009 888.363 388.964 865.324 394.009L865.538 394.986L865.752 395.963C889.9 390.675 908 365.738 908 335.994H907ZM865.538 394.986H866.538V277H865.538H864.538V394.986H865.538Z"
              fill="black"
              mask="url(#path-161-inside-3_6_626)"
            />
          </g>
          <rect
            id="Rectangle 57"
            x="755.5"
            y="279.5"
            width="4"
            height="9"
            rx="1.5"
            fill="url(#paint53_linear_6_626)"
            stroke="black"
          />
          <rect
            id="Rectangle 67"
            x="436.5"
            y="281.5"
            width="318"
            height="5"
            fill="url(#paint54_linear_6_626)"
            stroke="black"
          />
          <rect
            id="Rectangle 68"
            x="755.5"
            y="377.5"
            width="4"
            height="9"
            rx="1.5"
            fill="url(#paint55_linear_6_626)"
            stroke="black"
          />
          <rect
            id="Rectangle 69"
            x="436.5"
            y="379.5"
            width="318"
            height="5"
            fill="url(#paint56_linear_6_626)"
            stroke="black"
          />
          <g id="Repeat group 1_2">
            <rect
              id="Rectangle 62"
              x="533.5"
              y="277.5"
              width="3"
              height="117"
              rx="0.5"
              fill="#686155"
              stroke="black"
            />
            <rect
              id="Rectangle 62_2"
              x="643.5"
              y="277.5"
              width="3"
              height="117"
              rx="0.5"
              fill="#686155"
              stroke="black"
            />
            <rect
              id="Rectangle 62_3"
              x="753.5"
              y="277.5"
              width="3"
              height="117"
              rx="0.5"
              fill="#686155"
              stroke="black"
            />
            <rect
              id="Rectangle 62_4"
              x="863.5"
              y="277.5"
              width="3"
              height="117"
              rx="0.5"
              fill="#686155"
              stroke="black"
            />
          </g>
        </g>
        <path
          id="chamberFill"
          d="M914 398H529.214C519.75 398 510.298 397.329 500.93 395.991L494.07 395.011C484.702 393.673 475.25 393 465.786 393H438V272.817C440.34 272.533 442.62 271.92 444.775 271H914V398Z"
          fill="#3B8CCF"
          fill-opacity="0.6"
          clip-path="url(#chamberClip)"
        />
        <path
          id="overflowFill"
          d="M1056.33 386C1040.3 398.756 1023.51 397.937 1023.48 397.936H1018V398H914V386H1056.33Z"
          fill="#78AEDD"
          clip-path="url(#overflowClip)"
        />
        <path
          id="overflowPath"
          d="M916 397V275C916 274.5 915.5 274 915 274H914"
          stroke="#78AEDD"
          stroke-width={ Math.max(0, 254 * chamberFill() - 248) }
          stroke-dasharray="126.7020263671875"
          stroke-dashoffset={126.7020263671875 * (1 + pathFill())}
        />
        <rect
          id="weir"
          x="912.5"
          y="274.5"
          width="3"
          height="123"
          rx="0.5"
          fill="#878E95"
          stroke="black"
        />
        <path
          id="outline"
          d="M1017.5 214.5V214.511H1023.5L1023.51 214.51H1023.52C1023.52 214.509 1023.53 214.509 1023.55 214.509C1023.57 214.508 1023.62 214.506 1023.67 214.505C1023.78 214.502 1023.95 214.5 1024.17 214.501C1024.61 214.502 1025.27 214.517 1026.1 214.568C1027.76 214.672 1030.14 214.924 1032.99 215.521C1038.71 216.717 1046.33 219.291 1053.95 224.806C1069.16 235.818 1084.5 258.646 1084.5 306.011L1084.49 308.213C1084.02 354.085 1068.93 376.356 1053.95 387.178C1046.33 392.683 1038.71 395.248 1032.99 396.437C1030.14 397.03 1027.76 397.281 1026.1 397.382C1025.27 397.432 1024.61 397.445 1024.17 397.446C1023.95 397.447 1023.78 397.444 1023.67 397.441C1023.62 397.44 1023.57 397.439 1023.55 397.438C1023.53 397.437 1023.52 397.437 1023.52 397.437H1023.51L1023.5 397.436H1017.5V397.5H529.214C519.774 397.5 510.345 396.83 501 395.495L494.141 394.516C484.749 393.174 475.273 392.5 465.786 392.5H435.5V273.494C441.255 273.381 446.807 271.318 451.241 267.633L498.399 228.445C508.989 219.645 522.26 214.736 536.008 214.511L536.5 214.503V214.5H1017.5Z"
          stroke="black"
        />
      </g>
      <g id="exterior" class="kettle-exterior">
        <path
          id="Rectangle 58"
          d="M536.5 397.5H529.214C519.774 397.5 510.345 396.831 501 395.496L494.142 394.515C484.75 393.173 475.274 392.5 465.786 392.5H435.5V273.495C441.255 273.381 446.807 271.318 451.241 267.633L498.399 228.446C509.116 219.541 522.577 214.621 536.5 214.505V397.5Z"
          fill="url(#paint57_linear_6_626)"
          stroke="black"
        />
        <path
          id="Rectangle 59"
          d="M1024.17 214.5C1024.61 214.502 1025.27 214.516 1026.1 214.568C1027.76 214.671 1030.14 214.923 1032.99 215.521C1038.71 216.716 1046.33 219.29 1053.95 224.805C1069.16 235.817 1084.5 258.646 1084.5 306.01C1084.5 353.375 1069.17 376.185 1053.95 387.178C1046.33 392.684 1038.71 395.248 1032.99 396.436C1030.14 397.03 1027.76 397.28 1026.1 397.381C1025.27 397.432 1024.62 397.445 1024.17 397.446C1023.95 397.446 1023.78 397.444 1023.67 397.441C1023.62 397.44 1023.57 397.438 1023.55 397.437C1023.53 397.437 1023.52 397.436 1023.52 397.436H1023.51L1023.5 397.435H1017V214.51H1023.51C1023.51 214.51 1023.51 214.509 1023.52 214.509C1023.52 214.509 1023.53 214.509 1023.55 214.508C1023.57 214.507 1023.62 214.507 1023.67 214.505C1023.78 214.503 1023.95 214.5 1024.17 214.5Z"
          fill="url(#paint58_linear_6_626)"
          stroke="black"
        />
        <g id="Rectangle 60">
          <mask id="path-178-inside-4_6_626" fill="white">
            <path d="M536 214H1018V398H536V214Z" />
          </mask>
          <path
            d="M536 214H1018V398H536V214Z"
            fill="url(#paint59_linear_6_626)"
          />
          <path
            d="M536 214V215H1018V214V213H536V214ZM1018 398V397H536V398V399H1018V398Z"
            fill="black"
            mask="url(#path-178-inside-4_6_626)"
          />
        </g>
        <g id="Subtract_2">
          <mask id="path-180-inside-5_6_626" fill="white">
            <path
              d="M777 246C810.137 246 837 272.863 837 306C837 339.138 810.137 366 777 366C743.863 366 717 339.138 717 306C717 272.863 743.863 246 777 246ZM777 266C754.909 266 737 283.909 737 306C737 328.092 754.909 346 777 346C799.091 346 817 328.092 817 306C817 283.909 799.091 266 777 266Z"
            />
          </mask>
          <path
            d="M777 246C810.137 246 837 272.863 837 306C837 339.138 810.137 366 777 366C743.863 366 717 339.138 717 306C717 272.863 743.863 246 777 246ZM777 266C754.909 266 737 283.909 737 306C737 328.092 754.909 346 777 346C799.091 346 817 328.092 817 306C817 283.909 799.091 266 777 266Z"
            fill="#83878B"
          />
          <path
            d="M777 246V247C809.585 247 836 273.416 836 306H837H838C838 272.311 810.689 245 777 245V246ZM837 306H836C836 338.585 809.585 365 777 365V366V367C810.689 367 838 339.69 838 306H837ZM777 366V365C744.415 365 718 338.585 718 306H717H716C716 339.69 743.311 367 777 367V366ZM717 306H718C718 273.416 744.415 247 777 247V246V245C743.311 245 716 272.311 716 306H717ZM777 266V265C754.356 265 736 283.357 736 306H737H738C738 284.461 755.461 267 777 267V266ZM737 306H736C736 328.644 754.356 347 777 347V346V345C755.461 345 738 327.54 738 306H737ZM777 346V347C799.644 347 818 328.644 818 306H817H816C816 327.54 798.539 345 777 345V346ZM817 306H818C818 283.357 799.644 265 777 265V266V267C798.539 267 816 284.461 816 306H817Z"
            fill="black"
            mask="url(#path-180-inside-5_6_626)"
          />
        </g>
        <g id="Repeat group 1_3">
          <g id="Ellipse 2">
            <circle
              cx="757.958"
              cy="260.17"
              r="3.5"
              transform="rotate(-22.5 757.958 260.17)"
              fill="#C3C5C8"
            />
            <circle
              cx="757.958"
              cy="260.17"
              r="3.5"
              transform="rotate(-22.5 757.958 260.17)"
              stroke="black"
            />
            <circle
              cx="757.958"
              cy="260.17"
              r="3.5"
              transform="rotate(-22.5 757.958 260.17)"
              stroke="black"
              stroke-opacity="0.2"
            />
          </g>
          <g id="Ellipse 2_2">
            <circle
              cx="795.844"
              cy="260.169"
              r="3.5"
              transform="rotate(22.5 795.844 260.169)"
              fill="#C3C5C8"
            />
            <circle
              cx="795.844"
              cy="260.169"
              r="3.5"
              transform="rotate(22.5 795.844 260.169)"
              stroke="black"
            />
            <circle
              cx="795.844"
              cy="260.169"
              r="3.5"
              transform="rotate(22.5 795.844 260.169)"
              stroke="black"
              stroke-opacity="0.2"
            />
          </g>
          <g id="Ellipse 2_3">
            <circle
              cx="822.633"
              cy="286.959"
              r="3.5"
              transform="rotate(67.5 822.633 286.959)"
              fill="#C3C5C8"
            />
            <circle
              cx="822.633"
              cy="286.959"
              r="3.5"
              transform="rotate(67.5 822.633 286.959)"
              stroke="black"
            />
            <circle
              cx="822.633"
              cy="286.959"
              r="3.5"
              transform="rotate(67.5 822.633 286.959)"
              stroke="black"
              stroke-opacity="0.2"
            />
          </g>
          <g id="Ellipse 2_4">
            <circle
              cx="822.633"
              cy="324.844"
              r="3.5"
              transform="rotate(112.5 822.633 324.844)"
              fill="#C3C5C8"
            />
            <circle
              cx="822.633"
              cy="324.844"
              r="3.5"
              transform="rotate(112.5 822.633 324.844)"
              stroke="black"
            />
            <circle
              cx="822.633"
              cy="324.844"
              r="3.5"
              transform="rotate(112.5 822.633 324.844)"
              stroke="black"
              stroke-opacity="0.2"
            />
          </g>
          <g id="Ellipse 2_5">
            <circle
              cx="795.844"
              cy="351.634"
              r="3.5"
              transform="rotate(157.5 795.844 351.634)"
              fill="#C3C5C8"
            />
            <circle
              cx="795.844"
              cy="351.634"
              r="3.5"
              transform="rotate(157.5 795.844 351.634)"
              stroke="black"
            />
            <circle
              cx="795.844"
              cy="351.634"
              r="3.5"
              transform="rotate(157.5 795.844 351.634)"
              stroke="black"
              stroke-opacity="0.2"
            />
          </g>
          <g id="Ellipse 2_6">
            <circle
              cx="757.958"
              cy="351.634"
              r="3.5"
              transform="rotate(-157.5 757.958 351.634)"
              fill="#C3C5C8"
            />
            <circle
              cx="757.958"
              cy="351.634"
              r="3.5"
              transform="rotate(-157.5 757.958 351.634)"
              stroke="black"
            />
            <circle
              cx="757.958"
              cy="351.634"
              r="3.5"
              transform="rotate(-157.5 757.958 351.634)"
              stroke="black"
              stroke-opacity="0.2"
            />
          </g>
          <g id="Ellipse 2_7">
            <circle
              cx="731.169"
              cy="324.844"
              r="3.5"
              transform="rotate(-112.5 731.169 324.844)"
              fill="#C3C5C8"
            />
            <circle
              cx="731.169"
              cy="324.844"
              r="3.5"
              transform="rotate(-112.5 731.169 324.844)"
              stroke="black"
            />
            <circle
              cx="731.169"
              cy="324.844"
              r="3.5"
              transform="rotate(-112.5 731.169 324.844)"
              stroke="black"
              stroke-opacity="0.2"
            />
          </g>
          <g id="Ellipse 2_8">
            <circle
              cx="731.169"
              cy="286.959"
              r="3.5"
              transform="rotate(-67.5 731.169 286.959)"
              fill="#C3C5C8"
            />
            <circle
              cx="731.169"
              cy="286.959"
              r="3.5"
              transform="rotate(-67.5 731.169 286.959)"
              stroke="black"
            />
            <circle
              cx="731.169"
              cy="286.959"
              r="3.5"
              transform="rotate(-67.5 731.169 286.959)"
              stroke="black"
              stroke-opacity="0.2"
            />
          </g>
        </g>
        <circle id="Ellipse 3" cx="777" cy="306" r="40" fill="#161515" />
      </g>
      <g id="base">
        <rect
          id="Rectangle 70"
          x="367.5"
          y="261.5"
          width="27"
          height="14"
          rx="2.5"
          fill="url(#paint60_linear_6_626)"
          stroke="black"
        />
        <rect
          id="Rectangle 71"
          x="367.5"
          y="390.5"
          width="27"
          height="14"
          rx="2.5"
          fill="url(#paint61_linear_6_626)"
          stroke="black"
        />
        <rect
          id="Rectangle 53"
          x="341.5"
          y="273.5"
          width="79"
          height="119"
          fill="url(#paint62_linear_6_626)"
          stroke="black"
        />
        <g id="Group 1">
          <g id="Repeat group 1_4">
            <rect
              id="Rectangle 56"
              x="414.5"
              y="268.5"
              width="27"
              height="9"
              rx="2.5"
              fill="url(#paint63_linear_6_626)"
              stroke="black"
            />
            <rect
              id="Rectangle 56_2"
              x="414.5"
              y="288.5"
              width="27"
              height="9"
              rx="2.5"
              fill="url(#paint64_linear_6_626)"
              stroke="black"
            />
            <rect
              id="Rectangle 56_3"
              x="414.5"
              y="308.5"
              width="27"
              height="9"
              rx="2.5"
              fill="url(#paint65_linear_6_626)"
              stroke="black"
            />
            <rect
              id="Rectangle 56_4"
              x="414.5"
              y="328.5"
              width="27"
              height="9"
              rx="2.5"
              fill="url(#paint66_linear_6_626)"
              stroke="black"
            />
            <rect
              id="Rectangle 56_5"
              x="414.5"
              y="348.5"
              width="27"
              height="9"
              rx="2.5"
              fill="url(#paint67_linear_6_626)"
              stroke="black"
            />
            <rect
              id="Rectangle 56_6"
              x="414.5"
              y="368.5"
              width="27"
              height="9"
              rx="2.5"
              fill="url(#paint68_linear_6_626)"
              stroke="black"
            />
            <rect
              id="Rectangle 56_7"
              x="414.5"
              y="388.5"
              width="27"
              height="9"
              rx="2.5"
              fill="url(#paint69_linear_6_626)"
              stroke="black"
            />
          </g>
          <rect
            id="Rectangle 54"
            x="418.5"
            y="263.5"
            width="19"
            height="139"
            rx="1.5"
            fill="url(#paint70_linear_6_626)"
            stroke="black"
          />
        </g>
        <g id="Group 2">
          <g id="Repeat group 2_2">
            <rect
              id="Rectangle 56_8"
              x="324.5"
              y="268.5"
              width="23"
              height="9"
              rx="2.5"
              fill="url(#paint71_linear_6_626)"
              stroke="black"
            />
            <rect
              id="Rectangle 56_9"
              x="324.5"
              y="288.5"
              width="23"
              height="9"
              rx="2.5"
              fill="url(#paint72_linear_6_626)"
              stroke="black"
            />
            <rect
              id="Rectangle 56_10"
              x="324.5"
              y="308.5"
              width="23"
              height="9"
              rx="2.5"
              fill="url(#paint73_linear_6_626)"
              stroke="black"
            />
            <rect
              id="Rectangle 56_11"
              x="324.5"
              y="328.5"
              width="23"
              height="9"
              rx="2.5"
              fill="url(#paint74_linear_6_626)"
              stroke="black"
            />
            <rect
              id="Rectangle 56_12"
              x="324.5"
              y="348.5"
              width="23"
              height="9"
              rx="2.5"
              fill="url(#paint75_linear_6_626)"
              stroke="black"
            />
            <rect
              id="Rectangle 56_13"
              x="324.5"
              y="368.5"
              width="23"
              height="9"
              rx="2.5"
              fill="url(#paint76_linear_6_626)"
              stroke="black"
            />
            <rect
              id="Rectangle 56_14"
              x="324.5"
              y="388.5"
              width="23"
              height="9"
              rx="2.5"
              fill="url(#paint77_linear_6_626)"
              stroke="black"
            />
          </g>
          <rect
            id="Rectangle 55"
            x="328.5"
            y="263.5"
            width="15"
            height="139"
            rx="1.5"
            fill="url(#paint78_linear_6_626)"
            stroke="black"
          />
          <line
            id="Line 4"
            x1="336"
            y1="264"
            x2="336"
            y2="402"
            stroke="#363636"
            stroke-width="2"
          />
        </g>
        <rect
          id="Rectangle 57_2"
          x="425.5"
          y="263.5"
          width="5"
          height="139"
          fill="#43392A"
          stroke="black"
        />
      </g>
    <defs>
      <clipPath id="chamberClip">
        <rect
          x="435"
          y={398 - 127 * chamberFill()}
          width="479"
          height={127 * chamberFill()}
          fill="white"
        />
      </clipPath>
      <clipPath id="overflowClip">
        <rect
          x="914"
          y={398 - 12 * overflowFill()}
          width="142"
          height={12 * overflowFill()}
          fill="white"
        />
      </clipPath>
    </defs>
    </g>
  </>
)};

export default Kettle;