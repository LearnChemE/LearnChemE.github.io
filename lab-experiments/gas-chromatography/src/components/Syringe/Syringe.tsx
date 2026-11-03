import type { Accessor } from "solid-js";


type SyringeProps = {
    fill: Accessor<number>;
};

export const Syringe = (props: SyringeProps) => {
    const pHeight = 20;

    return (
        <g transform="translate(65, 50)">

{/* Tip */}
<g id="tip" transform="translate(0, 0)">
    <path d="M5.5 20C5.83333 20 6.16667 20 6.5 20C6.49479 19.6667 6.48958 19.3333 6.48438 19C6.39062 13 6.29688 7 6.20313 1C6.19792 0.666668 6.19271 0.333332 6.1875 0C6.0625 0 5.9375 0 5.8125 0C5.80729 0.333332 5.80208 0.666668 5.79688 1C5.70313 7 5.60938 13 5.51562 19C5.51042 19.3333 5.50521 19.6667 5.5 20Z" fill="black"/>
    <path d="M6 18.5C6.82843 18.5 7.5 19.1716 7.5 20V22C7.5 22.8284 6.82843 23.5 6 23.5C5.17157 23.5 4.5 22.8284 4.5 22V20C4.5 19.1716 5.17157 18.5 6 18.5Z" fill="#D9D9D9" stroke="black"/>
    <path d="M12 76C12 77.6569 9.31371 79 6 79C2.68629 79 0 77.6569 0 76C0 74.3431 2.68629 73 6 73C9.31371 73 12 74.3431 12 76Z" fill="#D9D9D9"/>
    <mask id="stroke0_236_192" fill="white">
    <path d="M12 76C12 77.6569 9.31371 79 6 79C2.68629 79 0 77.6569 0 76C0 74.3431 2.68629 73 6 73C9.31371 73 12 74.3431 12 76Z"/>
    </mask>
    <path d="M12 76C12 77.6569 9.31371 79 6 79C2.68629 79 0 77.6569 0 76C0 74.3431 2.68629 73 6 73C9.31371 73 12 74.3431 12 76Z" stroke-width="2" stroke="black" mask="url(#stroke0_236_192)"/>
    <path d="M12 24C12 25.6569 9.31371 27 6 27C2.68629 27 0 25.6569 0 24C0 22.3431 2.68629 21 6 21C9.31371 21 12 22.3431 12 24Z" fill="#D9D9D9"/>
    <mask id="stroke1_236_192" fill="white">
    <path d="M12 24C12 25.6569 9.31371 27 6 27C2.68629 27 0 25.6569 0 24C0 22.3431 2.68629 21 6 21C9.31371 21 12 22.3431 12 24Z"/>
    </mask>
    <path d="M12 24C12 25.6569 9.31371 27 6 27C2.68629 27 0 25.6569 0 24C0 22.3431 2.68629 21 6 21C9.31371 21 12 22.3431 12 24Z" stroke-width="2" stroke="black" mask="url(#stroke1_236_192)"/>
    <path d="M0 24H12V26H0V24Z" fill="#D9D9D9"/>
    <mask id="stroke2_236_192" fill="white">
    <path d="M0 24H12V26H0V24Z"/>
    </mask>
    <path d="M12 24H11V26H12H13V24H12ZM0 26H1V24H0H-1V26H0Z" fill="black" mask="url(#stroke2_236_192)"/>
    <path d="M12 26C12 27.6569 9.31371 29 6 29C2.68629 29 0 27.6569 0 26C0 24.3431 2.68629 23 6 23C9.31371 23 12 24.3431 12 26Z" fill="#D9D9D9"/>
    <mask id="stroke3_236_192" fill="white">
    <path d="M12 26C12 27.6569 9.31371 29 6 29C2.68629 29 0 27.6569 0 26C0 24.3431 2.68629 23 6 23C9.31371 23 12 24.3431 12 26Z"/>
    </mask>
    <path d="M12 26C12 27.6569 9.31371 29 6 29C2.68629 29 0 27.6569 0 26C0 24.3431 2.68629 23 6 23C9.31371 23 12 24.3431 12 26Z" stroke-width="2" stroke="black" mask="url(#stroke3_236_192)"/>
</g>

{/* Fill */}
<g id="fill" transform="translate(0, 23)">
    <rect y="6" width="12" height={Math.max(pHeight * props.fill() - 4, 0)} fill="#2F5574" fill-opacity="0.6"/>
    <path d="M6 0C9.31371 0 12 1.34315 12 3V6H0V3C0 1.34315 2.68629 0 6 0Z" fill="#2F5574" fill-opacity="0.6"/>
</g>

{/* Plunger */}
<g id="plunger" transform={`translate(0, ${23 + pHeight * props.fill()})`}>
    <path d="M12 3C12 4.65685 9.31371 6 6 6C2.68629 6 0 4.65685 0 3C0 1.34315 2.68629 0 6 0C9.31371 0 12 1.34315 12 3Z" fill="#D9D9D9"/>
    <mask id="stroke0_236_204" fill="white">
    <path d="M12 3C12 4.65685 9.31371 6 6 6C2.68629 6 0 4.65685 0 3C0 1.34315 2.68629 0 6 0C9.31371 0 12 1.34315 12 3Z"/>
    </mask>
    <path d="M12 3C12 4.65685 9.31371 6 6 6C2.68629 6 0 4.65685 0 3C0 1.34315 2.68629 0 6 0C9.31371 0 12 1.34315 12 3Z" stroke-width="2" stroke="black" mask="url(#stroke0_236_204)"/>
    <path d="M0 3H12V5H0V3Z" fill="#D9D9D9"/>
    <mask id="stroke1_236_204" fill="white">
    <path d="M0 3H12V5H0V3Z"/>
    </mask>
    <path d="M12 3H11V5H12H13V3H12ZM0 5H1V3H0H-1V5H0Z" fill="black" mask="url(#stroke1_236_204)"/>
    <path d="M12 5C12 6.65685 9.31371 8 6 8C2.68629 8 0 6.65685 0 5C0 3.34315 2.68629 2 6 2C9.31371 2 12 3.34315 12 5Z" fill="#D9D9D9"/>
    <mask id="stroke2_236_204" fill="white">
    <path d="M12 5C12 6.65685 9.31371 8 6 8C2.68629 8 0 6.65685 0 5C0 3.34315 2.68629 2 6 2C9.31371 2 12 3.34315 12 5Z"/>
    </mask>
    <path d="M12 5C12 6.65685 9.31371 8 6 8C2.68629 8 0 6.65685 0 5C0 3.34315 2.68629 2 6 2C9.31371 2 12 3.34315 12 5Z" stroke-width="2" stroke="black" mask="url(#stroke2_236_204)"/>
    <path d="M4 5.5H8V55.5H4V5.5Z" fill="#D9D9D9"/>
    <mask id="stroke3_236_204" fill="white">
    <path d="M4 5.5H8V55.5H4V5.5Z"/>
    </mask>
    <path d="M8 5.5H7V55.5H8H9V5.5H8ZM4 55.5H5V5.5H4H3V55.5H4Z" fill="black" mask="url(#stroke3_236_204)"/>
    <path d="M4.5 5.5C4.5 4.94772 4.89543 4.5 6 4.5C7.10457 4.5 7.5 4.94772 7.5 5.5" stroke="black"/>
    <path d="M12 56C12 57.6569 9.31371 59 6 59C2.68629 59 0 57.6569 0 56C0 54.3431 2.68629 53 6 53C9.31371 53 12 54.3431 12 56Z" fill="#D9D9D9"/>
    <mask id="stroke4_236_204" fill="white">
    <path d="M12 56C12 57.6569 9.31371 59 6 59C2.68629 59 0 57.6569 0 56C0 54.3431 2.68629 53 6 53C9.31371 53 12 54.3431 12 56Z"/>
    </mask>
    <path d="M12 56C12 57.6569 9.31371 59 6 59C2.68629 59 0 57.6569 0 56C0 54.3431 2.68629 53 6 53C9.31371 53 12 54.3431 12 56Z" stroke-width="2" stroke="black" mask="url(#stroke4_236_204)"/>
    <path d="M0 56H12V58H0V56Z" fill="#D9D9D9"/>
    <mask id="stroke5_236_204" fill="white">
    <path d="M0 56H12V58H0V56Z"/>
    </mask>
    <path d="M12 56H11V58H12H13V56H12ZM0 58H1V56H0H-1V58H0Z" fill="black" mask="url(#stroke5_236_204)"/>
    <path d="M12 58C12 59.6569 9.31371 61 6 61C2.68629 61 0 59.6569 0 58C0 56.3431 2.68629 55 6 55C9.31371 55 12 56.3431 12 58Z" fill="#D9D9D9"/>
    <mask id="stroke6_236_204" fill="white">
    <path d="M12 58C12 59.6569 9.31371 61 6 61C2.68629 61 0 59.6569 0 58C0 56.3431 2.68629 55 6 55C9.31371 55 12 56.3431 12 58Z"/>
    </mask>
    <path d="M12 58C12 59.6569 9.31371 61 6 61C2.68629 61 0 59.6569 0 58C0 56.3431 2.68629 55 6 55C9.31371 55 12 56.3431 12 58Z" stroke-width="2" stroke="black" mask="url(#stroke6_236_204)"/>
</g>

{/* Body */}
<g id="body" transform="translate(0, 23)">
    <path d="M6 0C9.31371 0 12 1.34315 12 3V52H0V3C0 1.34315 2.68629 0 6 0Z" fill="url(#paint0_linear_236_215)" fill-opacity="0.5"/>
    <mask id="stroke0_236_215" fill="white">
    <path d="M6 0C9.31371 0 12 1.34315 12 3V52H0V3C0 1.34315 2.68629 0 6 0Z"/>
    </mask>
    <path d="M6 0C9.31371 0 12 1.34315 12 3V52H0V3C0 1.34315 2.68629 0 6 0Z" stroke-width="2" stroke="black" mask="url(#stroke0_236_215)"/>
    <path d="M12 51C12 52.6569 9.31371 52 6 52C2.68629 52 0 52.6569 0 51C0 49.3431 2.68629 48 6 48C9.31371 48 12 49.3431 12 51Z" fill="#D9D9D9"/>
    <mask id="stroke1_236_215" fill="white">
    <path d="M12 51C12 52.6569 9.31371 52 6 52C2.68629 52 0 52.6569 0 51C0 49.3431 2.68629 48 6 48C9.31371 48 12 49.3431 12 51Z"/>
    </mask>
    <path d="M12 51C12 52.6569 9.31371 52 6 52C2.68629 52 0 52.6569 0 51C0 49.3431 2.68629 48 6 48C9.31371 48 12 49.3431 12 51Z" stroke-width="2" stroke="black" mask="url(#stroke1_236_215)"/>
    <path d="M0 51H12V53H0V51Z" fill="#D9D9D9"/>
    <mask id="stroke2_236_215" fill="white">
    <path d="M0 51H12V53H0V51Z"/>
    </mask>
    <path d="M12 51H11V53H12H13V51H12ZM0 53H1V51H0H-1V53H0Z" fill="black" mask="url(#stroke2_236_215)"/>
    <path d="M0.5 53C0.5 51.3431 2.68629 50.5 6 50.5C9.31371 50.5 11.5 51.3431 11.5 53" stroke="black"/>
    <path d="M4.5 53C4.5 52.4477 4.89543 52 6 52C7.10457 52 7.5 52.4477 7.5 53" stroke="black"/>
    <defs>
    <linearGradient id="paint0_linear_236_215" x1="0" y1="26" x2="12" y2="26" gradientUnits="userSpaceOnUse">
    <stop stop-color="#3E5A5B"/>
    <stop offset="0.471154" stop-color="#84BFC1"/>
    <stop offset="0.658654" stop-color="white"/>
    <stop offset="0.836538" stop-color="#84BFC1"/>
    <stop offset="1" stop-color="#3E5A5B"/>
    </linearGradient>
    </defs>
</g>

        </g>
    );
}