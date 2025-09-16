import { GetElement, insertClipPath, svgNS } from "../ts/helpers";
import { FirstOrder } from "./Setpoint";
import { Signal } from "./Signal";

export function generateWaveSVG(clipPath: SVGClipPathElement) {
    clipPath.innerHTML = `<style>
        .path-0{
        animation:pathAnim-0 4s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        }
            @keyframes pathAnim-0{
            0%{
                d: path("M 0,800 L 0,150 C 37.499458087710494,181.22809220439345 74.99891617542099,212.4561844087869 128,200 C 181.001083824579,187.5438155912131 249.5037933860266,131.40335456924583 302,111 C 354.4962066139734,90.59664543075418 390.98591028047264,105.93039731422982 439,101 C 487.01408971952736,96.06960268577018 546.5525654920829,70.8750561738349 593,89 C 639.4474345079171,107.1249438261651 672.8038277511961,168.5693779904306 716,165 C 759.1961722488039,161.4306220095694 812.2321235031326,92.84743186444263 864,77 C 915.7678764968674,61.152568135557374 966.2676782362737,98.04089455179889 1010,133 C 1053.7323217637263,167.95910544820111 1090.6971635517723,200.98898992836183 1136,194 C 1181.3028364482277,187.01101007163817 1234.9436675566367,140.00314573475376 1287,126 C 1339.0563324433633,111.99685426524624 1389.5281662216817,130.99842713262314 1440,150 L 1440,800 L 0,800 Z");
            }
            25%{
                d: path("M 0,800 L 0,150 C 56.544198895027634,123.41462898834227 113.08839779005527,96.82925797668454 152,114 C 190.91160220994473,131.17074202331546 212.19060773480658,192.09759708160408 262,191 C 311.8093922651934,189.90240291839592 390.1491712707183,126.78035369689918 438,104 C 485.8508287292817,81.21964630310082 503.2127071823204,98.78098813079913 551,128 C 598.7872928176796,157.21901186920087 677.0000000000001,198.09569377990428 725,219 C 772.9999999999999,239.90430622009572 790.7872928176796,240.8362367495837 838,207 C 885.2127071823204,173.1637632504163 961.8508287292818,104.55935922176107 1025,78 C 1088.1491712707182,51.44064077823893 1137.8093922651933,66.92632636337203 1173,79 C 1208.1906077348067,91.07367363662797 1228.9116022099447,99.73533532475085 1271,111 C 1313.0883977900553,122.26466467524915 1376.5441988950276,136.13233233762458 1440,150 L 1440,800 L 0,800 Z");
            }
            50%{
                d: path("M 0,800 L 0,150 C 37.18513574241982,109.29521002405562 74.37027148483963,68.59042004811124 128,95 C 181.62972851516037,121.40957995188876 251.7040498030612,214.93352983161066 309,213 C 366.2959501969388,211.06647016838934 410.8135293029157,113.67546062544608 456,77 C 501.1864706970843,40.32453937455392 547.0418329852758,64.364627666605 582,99 C 616.9581670147242,133.635372333395 641.0191387559809,178.86602870813394 694,171 C 746.9808612440191,163.13397129186606 828.8816119908007,102.17125750085913 887,92 C 945.1183880091993,81.82874249914087 979.4544132808164,122.44894128842952 1019,117 C 1058.5455867191836,111.55105871157048 1103.300734885934,60.032977345422836 1155,77 C 1206.699265114066,93.96702265457716 1265.3426471754474,179.4191493298792 1314,203 C 1362.6573528245526,226.5808506701208 1401.3286764122763,188.2904253350604 1440,150 L 1440,800 L 0,800 Z");
            }
            75%{
                d: path("M 0,800 L 0,150 C 48.578207195537814,167.38356816199212 97.15641439107563,184.76713632398423 146,181 C 194.84358560892437,177.23286367601577 243.95254963123534,152.31502286605516 295,142 C 346.04745036876466,131.68497713394484 399.03338708398314,135.9727722117952 449,137 C 498.96661291601686,138.0272277882048 545.9139020328321,135.79388828676412 591,136 C 636.0860979671679,136.20611171323588 679.311004784689,138.85167464114835 722,160 C 764.688995215311,181.14832535885165 806.842078828412,220.79941314864257 858,217 C 909.157921171588,213.20058685135743 969.3206799016627,165.95067276428136 1013,145 C 1056.6793200983373,124.04932723571865 1083.8752015649368,129.39789579423197 1136,134 C 1188.1247984350632,138.60210420576803 1265.1785138385894,142.45774405879087 1320,145 C 1374.8214861614106,147.54225594120913 1407.4107430807053,148.77112797060457 1440,150 L 1440,800 L 0,800 Z");
            }
            100%{
                d: path("M 0,800 L 0,150 C 37.499458087710494,181.22809220439345 74.99891617542099,212.4561844087869 128,200 C 181.001083824579,187.5438155912131 249.5037933860266,131.40335456924583 302,111 C 354.4962066139734,90.59664543075418 390.98591028047264,105.93039731422982 439,101 C 487.01408971952736,96.06960268577018 546.5525654920829,70.8750561738349 593,89 C 639.4474345079171,107.1249438261651 672.8038277511961,168.5693779904306 716,165 C 759.1961722488039,161.4306220095694 812.2321235031326,92.84743186444263 864,77 C 915.7678764968674,61.152568135557374 966.2676782362737,98.04089455179889 1010,133 C 1053.7323217637263,167.95910544820111 1090.6971635517723,200.98898992836183 1136,194 C 1181.3028364482277,187.01101007163817 1234.9436675566367,140.00314573475376 1287,126 C 1339.0563324433633,111.99685426524624 1389.5281662216817,130.99842713262314 1440,150 L 1440,800 L 0,800 Z");
            }
            }</style>`;
    
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M 0,800 L 0,150 C 37.499458087710494,181.22809220439345 74.99891617542099,212.4561844087869 128,200 C 181.001083824579,187.5438155912131 249.5037933860266,131.40335456924583 302,111 C 354.4962066139734,90.59664543075418 390.98591028047264,105.93039731422982 439,101 C 487.01408971952736,96.06960268577018 546.5525654920829,70.8750561738349 593,89 C 639.4474345079171,107.1249438261651 672.8038277511961,168.5693779904306 716,165 C 759.1961722488039,161.4306220095694 812.2321235031326,92.84743186444263 864,77 C 915.7678764968674,61.152568135557374 966.2676782362737,98.04089455179889 1010,133 C 1053.7323217637263,167.95910544820111 1090.6971635517723,200.98898992836183 1136,194 C 1181.3028364482277,187.01101007163817 1234.9436675566367,140.00314573475376 1287,126 C 1339.0563324433633,111.99685426524624 1389.5281662216817,130.99842713262314 1440,150 L 1440,800 L 0,800 Z");
    path.setAttribute("stroke","none"); 
    path.classList.add("transition-all","duration-300","ease-in-out","delay-150","path-0");
    clipPath.appendChild(path);
    
    return path;
}

export function setWaveTransform(wave: SVGPathElement, tx: number, ty: number, sx: number, sy: number) {
    wave.setAttribute("transform",`translate(${tx},${ty}) scale(${sx},${sy})`);
}

export type EvaporatorDescriptor = {
    id: string,
    flowInSignal: Signal<number>,
    mantleSignal: Signal<boolean>
};

const EvapEmptyHeight = 50;
export class Evaporator {
    private wave: SVGPathElement;
    private full: boolean;
    private height: FirstOrder;
    private dims: [x: number, y: number, w: number, h: number];

    private bubbleGroup: SVGGElement;

    private flowIn: number;
    private mantleIsOn: boolean;

    public flowOut: Signal<number>;

    constructor(descriptor: EvaporatorDescriptor) {
        const fill = GetElement<SVGPathElement>(descriptor.id);
        const bbox = fill.getBBox();
        const clip = insertClipPath(fill, "evapFillClip", bbox);
        this.height = new FirstOrder(EvapEmptyHeight, 10000);

        // Inputs and Outputs
        this.flowIn = descriptor.flowInSignal.get();
        this.mantleIsOn = descriptor.mantleSignal.get();
        this.full = (this.flowIn > 0);
        this.flowOut = new Signal<number>(this.flowIn);
        // Like and Subscribe
        descriptor.flowInSignal.subscribe((flow: number) => {
            this.flowIn = flow;
            if (flow > 0) this.full = true;
            else if (this.mantleIsOn) this.full = false;

            if (this.mantleIsOn) this.flowOut.set(flow);
        });
        descriptor.mantleSignal.subscribe((mantleIsOn: boolean) => {
            this.mantleIsOn = mantleIsOn;
            if (mantleIsOn) {
                this.flowOut.set(this.flowIn);
                if (this.flowIn === 0) this.full = false;
            }
            else {
                this.flowOut.set(0);
            }
        });

        // Bubbles init
        this.bubbleGroup = GetElement<SVGGElement>("evapBubbles");

        this.dims = [bbox.x, bbox.y, bbox.width, bbox.height];
        this.wave = generateWaveSVG(clip);
        this.animate();
    }

    private animate = () => {
        let prevtime: number | null = null;
        let bubbleTimer = 0;

        const frame = (time: number) => {
            if (prevtime === null) prevtime = time;
            const deltaTime = time - prevtime;
            prevtime = time;

            const target = this.full ? 0 : EvapEmptyHeight;
            this.height.set(target);
            const dy = (this.flowIn !== 0 || this.mantleIsOn) ? this.height.iterate(deltaTime) : this.height.get();
            const [x, y, w, h] = this.dims;
            setWaveTransform(this.wave, x, y + dy, w/1440, h/1200);

            if (this.mantleIsOn) {
                bubbleTimer -= deltaTime;
                if (bubbleTimer <= 0) {
                    bubbleTimer = Math.max(bubbleTimer + 200, 0);
                    const c = document.createElementNS(svgNS, "circle");
                    c.setAttribute("stroke", "#FFFFFF");
                    c.setAttribute("r","2.5");
                    c.setAttribute("cx",`${4 + this.dims[0] + Math.random() * (this.dims[2]-8)}`);
                    c.setAttribute("cy",`${this.dims[1] + this.dims[3] - 30}`);
                    this.bubbleGroup.appendChild(c);
                }
            }
            this.animateBubbles(deltaTime);

            requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    private animateBubbles = (deltaTime: number) => {
        const vel = -25;
        const top = this.height.get() + this.dims[1] + 10;
        const dt = Math.min(deltaTime / 1000, 300);
        const nodes = this.bubbleGroup.childNodes;
        for (const child of nodes) {
            if (child.nodeName !== "circle") continue;
            const bubble = child as SVGCircleElement; 

            const y = Number(bubble.getAttribute("cy")!);
            const x = Number(bubble.getAttribute("cx")!);
            const dy = vel * dt;
            var s;
            if (y+dy < top) {
                bubble.remove();
                continue;
            }
            else if ((s = y+dy - top) <= 5) {
                bubble.setAttribute("opacity",`${s / 5}`);
            }

            bubble.setAttribute("cy",`${y+dy}`);
            bubble.setAttribute("cx",`${x + 12 * Math.cos((y+dy)/2) * dt}`);
        }
    }
}
