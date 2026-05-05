
// Hamburger
const menuBtn = document.querySelector('.menu-btn');
const menuContent = document.querySelector('.menu-content');
const menuItems = document.querySelectorAll('.menu-item');
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close-btn');

// Hamburger menu functionality
menuBtn.addEventListener('click', () => {
    menuContent.classList.toggle('show');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !menuContent.contains(e.target)) {
        menuContent.classList.remove('show');
    }
});

// Menu items click handlers
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const modalId = item.getAttribute('data-modal') + '-modal';
        document.getElementById(modalId).style.display = 'block';
        menuContent.classList.remove('show');
    });
});

// Close modal buttons
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// ---- Expander ----
function toggleExpander(header){
  const body=document.getElementById("expander-body");
  header.classList.toggle("open");
  body.classList.toggle("open");
}
 
// ---- Expander content ----
function buildExpanderContent(){
  const A=areaCylinder(DEFAULTS.D,DEFAULTS.L);
  const Qrad_a=qRadiation(DEFAULTS.eps,A,DEFAULTS.Ts,DEFAULTS.Ta);
  const cb=solveCaseB(DEFAULTS.Tin,DEFAULTS.Ta,DEFAULTS.eps,DEFAULTS.L,DEFAULTS.D,DEFAULTS.t,DEFAULTS.k,DEFAULTS.h);
  const old_a=Math.PI*0.5*2.0;
 
  let min_t=null;
  for(let i=0;i<=1200;i++){
    const ti=i*0.30/1200;
    const o=solveCaseB(DEFAULTS.Tin,DEFAULTS.Ta,DEFAULTS.eps,DEFAULTS.L,DEFAULTS.D,ti,DEFAULTS.k,DEFAULTS.h);
    if(o.Tz<=330){min_t=ti;break;}
  }
  const area_pct=100*(A/old_a-1);
 
  document.getElementById("details-body").innerHTML=`
    <p><b>Industrial Reference</b></p>
    <p>Company: <b>Thermo Fisher Scientific</b><br>
      Model: <b>HyPerforma DynaDrive 500 L Single-Use Bioreactor</b><br>
      Diameter: <b>0.63 m</b> &nbsp;|&nbsp; Length: <b>1.87 m</b> &nbsp;|&nbsp; Working volume: <b>500 L</b> &nbsp;|&nbsp; Total volume: <b>586 L</b></p>
    <br>
    <p><b>What changed from the original homework geometry</b></p>
    <p>Original: L = 2.00 m, D = 0.50 m &nbsp;→&nbsp; Updated: L = 1.87 m, D = 0.63 m</p>
    <p>Shell area change: ${old_a.toFixed(3)} → ${A.toFixed(3)} m² (<b>${area_pct>0?"+":""}${area_pct.toFixed(1)}%</b>)</p>
    <br>
    <p><b>Case A baseline</b></p>
    <p>A = πDL = π × 0.63 × 1.87 = <b>${A.toFixed(3)} m²</b> &nbsp;|&nbsp; Q̇_rad = <b>${fmt(Qrad_a)} W</b></p>
    <br>
    <p><b>Case B baseline</b></p>
    <p>r₁ = ${cb.r1.toFixed(3)} m &nbsp;|&nbsp; r₂ = ${cb.r2.toFixed(3)} m &nbsp;|&nbsp; A_out = ${cb.A_out.toFixed(3)} m²</p>
    <p>Q̇_total = <b>${fmt(cb.Q_total)} W</b> &nbsp;|&nbsp; T surface = <b>${cb.Tz.toFixed(1)} K</b></p>
    <p>Q̇_conv = ${fmt(cb.Q_conv)} W &nbsp;|&nbsp; Q̇_rad = ${fmt(cb.Q_rad)} W</p>
    <br>
    <p><b>Safety Challenge baseline</b></p>
    <p>Minimum insulation to keep T surface ≤ 330 K: <b>${min_t!==null?min_t.toFixed(3)+" m":"not achievable in 0–0.30 m"}</b></p>
    <br>
    <p style="color:#555;font-size:0.72rem;">Reference: Dimensions based on Table 6.3 of the Thermo Scientific DynaDrive S.U.B. Service Guide (500 L DynaDrive S.U.B. specifications).</p>
  `;
}

// ---- Constants & defaults ----
const SIGMA = 5.67e-8;
const DEFAULTS = { L:1.87, D:0.63, Ta:310, Ts:600, Tin:650, eps:0.85, t:0.05, k:0.08, h:8.0 };
const WALL_THICK = 0.012;

// Colorscale
const CSCALE = [
  [0.00,"rgb(0,120,255)"],
  [0.35,"rgb(180,230,255)"],
  [0.60,"rgb(255,245,210)"],
  [0.82,"rgb(255,170,80)"],
  [1.00,"rgb(240,59,32)"],
];

// Light theme for Plotly
const PLOTLY_LAYOUT_BASE = {
  paper_bgcolor:"#ffffff00",
  plot_bgcolor:"#ffffff00",
  font:{color:"#000000", family:"Arial, monospace", size:12},
  margin:{l:0,r:0,t:0,b:0},
};

buildExpanderContent();

// ---- Physics ----
function areaCylinder(D,L){ return Math.PI*D*L; }

function qRadiation(eps,A,Ts,Ta){ return eps*SIGMA*A*(Math.pow(Ts,4)-Math.pow(Ta,4)); }

function solveCaseB(Tin,Ta,eps,L,D,t,k,h){
  const r1 = D/2;
  let r2 = r1+Math.max(t,0);
  const A_out = 2*Math.PI*r2*L;
  const R_cond = (t<=1e-9) ? 0 : Math.log(r2/r1)/(2*Math.PI*L*k);
  const R_conv = 1/(h*A_out);

  let Tz=(Tin+Ta)/2, R_rad=null, Q=null;
  for(let i=0;i<40;i++){
    R_rad = 1/(eps*SIGMA*A_out*(Tz**2+Ta**2)*(Tz+Ta));
    const R_surf = 1/(1/R_conv+1/R_rad);
    const R_tot = R_cond+R_surf;
    Q = (Tin-Ta)/R_tot;
    const Tz_new = Tin-Q*R_cond;
    if(Math.abs(Tz_new-Tz)<1e-7){Tz=Tz_new;break;}
    Tz=Tz_new;
  }
  const Q_conv=(Tz-Ta)/R_conv;
  const Q_rad=(Tz-Ta)/R_rad;
  return {Q_total:Q,Tz,Q_conv,Q_rad,R_cond,R_conv,R_rad,A_out,r1,r2};
}

// ---- Colormap interpolation ----
function interpColor(t_norm){
  const s=CSCALE;
  let lo=s[0],hi=s[s.length-1];
  for(let i=0;i<s.length-1;i++){
    if(t_norm>=s[i][0]&&t_norm<=s[i+1][0]){lo=s[i];hi=s[i+1];break;}
  }
  const f=(t_norm-lo[0])/(hi[0]-lo[0]+1e-12);
  const parse=c=>{const m=c.match(/\d+/g).map(Number);return m;};
  const a=parse(lo[1]),b=parse(hi[1]);
  const r=Math.round(a[0]+(b[0]-a[0])*f);
  const g=Math.round(a[1]+(b[1]-a[1])*f);
  const bv=Math.round(a[2]+(b[2]-a[2])*f);
  return`rgb(${r},${g},${bv})`;
}

// ---- Cross-section heatmap (SVG canvas-based via Plotly heatmap) ----
function buildCrossSection(divId, D, t, Tin, Tz, Ta, Qconv, Qrad){
  const r_wall = D/2;
  const r_fluid = Math.max(r_wall-WALL_THICK, 0.001);
  const r_ins = r_wall+Math.max(t,0);
  const r_range = Math.max(r_ins, r_wall+0.015);

  const n=160;
  const xs=[], ys=[];
  for(let i=0;i<n;i++) xs.push(-r_range*1.5 + i*(r_range*3)/(n-1));
  for(let i=0;i<n;i++) ys.push(-r_range*1.5 + i*(r_range*3)/(n-1));

  const z=[], cdata=[];
  for(let j=0;j<n;j++){
    const row=[], crow=[];
    for(let i=0;i<n;i++){
      const R=Math.sqrt(xs[i]**2+ys[j]**2);
      let T=null,reg="";
      if(R<=r_ins){
        if(R<=r_fluid){T=Tin;reg="Fluid";}
        else if(R<=r_wall){T=Tin;reg="Metal wall";}
        else{
          if(r_ins<=r_wall+1e-9){T=Tz;reg="Outer surface";}
          else{T=Tin-(Tin-Tz)*((R-r_wall)/(r_ins-r_wall));reg="Insulation";}
        }
      }
      row.push(T);
      crow.push(reg);
    }
    z.push(row);
    cdata.push(crow);
  }

  const Qt=Math.max(Qconv+Qrad,1e-12);
  const lw_rad=6*(Qrad/Qt);
  const lw_conv=6*(Qconv/Qt);

  const data=[{
    type:"heatmap",x:xs,y:ys,z:z,
    colorscale:CSCALE,zmin:Ta,zmax:Tin,
    showscale:false,
    // colorbar:{title:{text:"T (K)",side:"right"},len:0.8,thickness:12,tickfont:{size:12,color:"#000000"},titlefont:{size:12,color:"#000000"}},
    customdata:cdata,
    hovertemplate:"<b>%{customdata}</b><br>T=%{z:.1f} K<extra></extra>",
    hoverongaps:false,
  }];

  const shapes=[
    {type:"circle",x0:-r_ins,y0:-r_ins,x1:r_ins,y1:r_ins,fillcolor:"rgba(0,0,0,0)",line:{color:"rgb(0,0,0)",width:2.5}},
    {type:"circle",x0:-r_wall,y0:-r_wall,x1:r_wall,y1:r_wall,fillcolor:"rgba(0,0,0,0)",line:{color:"rgb(0,0,0)",width:2}},
    {type:"circle",x0:-r_fluid,y0:-r_fluid,x1:r_fluid,y1:r_fluid,fillcolor:"rgba(0,0,0,0)",line:{color:"rgb(0,0,0)",width:1.5}},
  ];

  const ay_arr=1.35*r_range, a_arr=1.4*r_range, lab_y=1.55*r_range;
  console.log("QradL", lw_rad);
  console.log("QconvL", lw_conv);
  const annotations=[
    {x:-0.38*r_ins,y:a_arr,ax:-0.38*r_ins,ay:ay_arr - 0.2 * lw_rad / 8,xref:"x",yref:"y",axref:"x",ayref:"y",text:"",showarrow:true,arrowwidth:0.8 * lw_rad,arrowhead:2,arrowcolor:"rgb(255, 92, 0)"},
    {x:-0.38*r_ins,y:lab_y,xref:"x",yref:"y",text:"Q̇rad",showarrow:false,font:{size:11,color:"rgba(255,92,0,1)"}},
    {x:0.38*r_ins,y:a_arr,ax:0.38*r_ins,ay:ay_arr - 0.2 * lw_conv / 8,xref:"x",yref:"y",axref:"x",ayref:"y",text:"",showarrow:true,arrowwidth:0.8 * lw_conv,arrowhead:2,arrowcolor:"rgba(0,170,255,1)"},
    {x:0.38*r_ins,y:lab_y,xref:"x",yref:"y",text:"Q̇conv",showarrow:false,font:{size:11,color:"rgba(0,170,255,1)"}},
  ];

  const layout={
    ...PLOTLY_LAYOUT_BASE,
    xaxis:{visible:false,scaleanchor:"y",scaleratio:1,range:[-r_range*1.65,r_range*1.65],fixedrange:true},
    yaxis:{visible:false,range:[-r_range*1.65,r_range*1.65],fixedrange:true},
    shapes,annotations,
    hoverlabel:{bgcolor:"#1c2333",font:{color:"#e6edf3"}},
  };

  Plotly.react(divId, data, layout, {displayModeBar:false,responsive:true});
}

// ---- Vessel side-view (capsule) ----
function capsulePoints(a,r,n=120){
  const nl=Math.max(Math.round(n*0.35),15);
  const na=Math.max(Math.round(n*0.30),25);
  const xb=[],yb=[],xr=[],yr=[],xt=[],yt=[],xl=[],yl=[];
  for(let i=0;i<nl;i++){const f=i/(nl-1);xb.push(-a+f*2*a);yb.push(-r);}
  for(let i=0;i<na;i++){const th=-Math.PI/2+i*Math.PI/(na-1);xr.push(a+r*Math.cos(th));yr.push(r*Math.sin(th));}
  for(let i=0;i<nl;i++){const f=i/(nl-1);xt.push(a-f*2*a);yt.push(r);}
  for(let i=0;i<na;i++){const th=Math.PI/2+i*Math.PI/(na-1);xl.push(-a+r*Math.cos(th));yl.push(r*Math.sin(th));}
  return {
    x:[...xb,...xr,...xt,...xl,xb[0]],
    y:[...yb,...yr,...yt,...yl,yb[0]],
  };
}

function buildVesselSideView(divId, D, t, Tin, Tz, Ta, Qconv, Qrad){
  const r_wall=D/2;
  const r_fluid=Math.max(r_wall-WALL_THICK,0.001);
  const r_ins=r_wall+Math.max(t,0);
  const r_range=Math.max(r_ins,r_wall+0.015);
  const a=0.55*(DEFAULTS.L/2);

  const nx=240,ny=240;
  const x_lo=-(a+r_range), x_hi=a+r_range;
  const xs=[],ys=[];
  for(let i=0;i<nx;i++) xs.push(x_lo+i*(x_hi-x_lo)/(nx-1));
  for(let j=0;j<ny;j++) ys.push(-r_range+j*2*r_range/(ny-1));

  const z=[],cdata=[];
  for(let j=0;j<ny;j++){
    const row=[],crow=[];
    for(let i=0;i<nx;i++){
      const Xc=Math.max(-a,Math.min(a,xs[i]));
      const R=Math.sqrt((xs[i]-Xc)**2+ys[j]**2);
      let T=null,reg="";
      if(R<=r_ins){
        if(R<=r_fluid){T=Tin;reg="Fluid";}
        else if(R<=r_wall){T=Tin;reg="Metal wall";}
        else{
          if(r_ins<=r_wall+1e-9){T=Tz;reg="Outer surface";}
          else{T=Tin-(Tin-Tz)*((R-r_wall)/(r_ins-r_wall));reg="Insulation";}
        }
      }
      row.push(T);
      crow.push(reg);
    }
    z.push(row);
    cdata.push(crow);
  }

  const traces=[{
    type:"heatmap",x:xs,y:ys,z:z,
    colorscale:CSCALE,zmin:Ta,zmax:Tin,
    colorbar:{title:{text:"T (K)",side:"right"},len:0.8,thickness:12,tickfont:{size:12,color:"#000000"},titlefont:{size:12,color:"#000000"}},
    customdata:cdata,
    hovertemplate:"<b>%{customdata}</b><br>T=%{z:.1f} K<extra></extra>",
    hoverongaps:false,
  }];

  for(const [rb,lw] of [[r_ins,2.5],[r_wall,2],[r_fluid,1.5]]){
    const pts=capsulePoints(a,rb);
    traces.push({type:"scatter",x:pts.x,y:pts.y,mode:"lines",line:{color:"#e6edf3",width:lw},hoverinfo:"skip",showlegend:false});
  }

  const Qt=Math.max(Qconv+Qrad,1e-12);
  const lw_rad=6*(Qrad/Qt);
  const lw_conv=6*(Qconv/Qt);

  const ax_x=0.42*(a+r_ins);
  const arr_y=1.38*r_range, ay_arr=1.18*r_range, lab_y=1.50*r_range;
  const annotations=[
    {x:-ax_x,y:arr_y,ax:-ax_x,ay:ay_arr - 0.15 * lw_rad / 8,xref:"x",yref:"y",axref:"x",ayref:"y",text:"",showarrow:true,arrowwidth:0.8 * lw_rad,arrowhead:2,arrowcolor:"rgba(255,92,0,1)"},
    {x:-ax_x,y:lab_y,xref:"x",yref:"y",text:"Q̇rad",showarrow:false,font:{size:11,color:"rgba(255,92,0,1)"}},
    {x:ax_x,y:arr_y,ax:ax_x,ay:ay_arr  - 0.15 * lw_conv / 8,xref:"x",yref:"y",axref:"x",ayref:"y",text:"",showarrow:true,arrowwidth:0.8 * lw_conv,arrowhead:2,arrowcolor:"rgba(0,170,255,1)"},
    {x:ax_x,y:lab_y,xref:"x",yref:"y",text:"Q̇conv",showarrow:false,font:{size:11,color:"rgba(0,170,255,1)"}},
  ];

  const xpad=0.06*(a+r_range);

  // Build outline
  [{r: r_ins, lw: 3.2}, {r: r_wall, lw: 2.6}, {r: r_fluid, lw: 2.0}].forEach(({r,lw})=>{
    const pts=capsulePoints(a,r);
    traces.push({type:"scatter",x:pts.x,y:pts.y,mode:"lines",line:{color:"#000000",width:lw},hoverinfo:"skip",showlegend:false});
  });

  const layout={
    ...PLOTLY_LAYOUT_BASE,
    xaxis:{visible:false,scaleanchor:"y",scaleratio:1,range:[-(a+r_range)-xpad,(a+r_range)+xpad],fixedrange:true},
    yaxis:{visible:false,range:[-1.25*r_range,1.55*r_range],fixedrange:true},
    annotations,
    hoverlabel:{bgcolor:"#1c2333",font:{color:"#e6edf3"}},
  };

  Plotly.react(divId, traces, layout, {displayModeBar:false,responsive:true});
}

// ---- Mode split bar ----
function buildModeSplit(divId, Qconv, Qrad){
  const data=[{
    type:"bar",
    x:["convection","radiation"],
    y:[Qconv,Qrad],
    marker:{color:["rgba(0,170,255,0.85)","rgba(255,92,0,0.85)"]},
  }];
  const layout={
    ...PLOTLY_LAYOUT_BASE,
    title:{text:"heat transfer by mode",font:{size:14,color:"#000000"},x:0.5},
    margin:{l:40,r:0,t:48,b:60},
    yaxis:{title:{text:"W",font:{color:"#000000"}},rangemode:"tozero",tickfont:{size:12},gridcolor:"rgba(0,0,0,.1)"},
    xaxis:{tickangle:35,tickfont:{size:14}},
    showlegend:false,
    bargap:0.35,
  };
  Plotly.react(divId, data, layout, {displayModeBar:false,responsive:true});
}

// ---- Safety curve ----
function buildSafetyCurve(divId, Tin, k, h, t_user, out_user){
  const eps=0.85, target=330;
  const t_max=0.30;
  const n=301;
  const t_vals=[], T_surf_vals=[];
  let min_t=null, min_out=null;
  for(let i=0;i<n;i++){
    const ti=t_max*i/(n-1);
    t_vals.push(ti);
    const o=solveCaseB(Tin,DEFAULTS.Ta,eps,DEFAULTS.L,DEFAULTS.D,ti,k,h);
    T_surf_vals.push(o.Tz);
    if(min_t===null&&o.Tz<=target){min_t=ti;min_out=o;}
  }

  const traces=[
    {type:"scatter",x:t_vals,y:T_surf_vals,mode:"lines",name:"T<sub>surface</sub>",
     line:{width:2,color:"#1779cf"},
     hovertemplate:"t=%{x:.3f} m<br>T<sub>surface</sub>=%{y:.1f} K<extra></extra>"},
    {type:"scatter",x:[t_user],y:[out_user.Tz],mode:"markers",name:"Selected",
     marker:{size:11,symbol:"circle",color:"#f72d00",line:{width:1,color:"#e6edf3"}},
     hovertemplate:"Selected t=%{x:.3f} m<br>T=%{y:.1f} K<extra></extra>"},
  ];
  if(min_t!==null&&min_out){
    traces.push({type:"scatter",x:[min_t],y:[min_out.Tz],mode:"markers",name:"Min required",
      marker:{size:11,symbol:"diamond",color:"#00b415",line:{width:1,color:"#e6edf3"}},
      hovertemplate:"Min t=%{x:.3f} m<br>T=%{y:.1f} K<extra></extra>"});
  }

  const shapes=[
    {type:"rect",xref:"x",yref:"y",x0:0,x1:t_max,y0:0,y1:target,fillcolor:"rgba(86,211,100,0.05)",line:{width:0},layer:"below"},
    {type:"rect",xref:"x",yref:"y",x0:0,x1:t_max,y0:target,y1:800,fillcolor:"rgba(247,129,102,0.05)",line:{width:0},layer:"below"},
    {type:"line",xref:"x",yref:"y",x0:0,x1:t_max,y0:target,y1:target,line:{width:1.5,color:"rgb(0, 0, 0)",dash:"dash"}},
  ];

  const annotations=[{
    x:0.25, y:target+30,xref:"x",yref:"y",
    text:`Target T<sub>surface</sub> = ${target} K`,
    showarrow:false,font:{size:14,color:"#000000"},
    bgcolor:"rgba(54, 54, 54, 0)",bordercolor:"rgba(54, 54, 54, 0.8)",borderwidth:0,
  }];

  const layout={
    ...PLOTLY_LAYOUT_BASE,
    margin:{l:56,r:56,t:12,b:52},
    xaxis:{title:{text:"t (m)",font:{color:"#000000"}},range:[0,t_max],dtick:0.05,
           gridcolor:"rgba(255,255,255,0.05)",zeroline:true,tickfont:{size:12}},
    yaxis:{title:{text:"T<sub>surface</sub> (K)",font:{color:"#000000"}},range:[0,800],dtick:100,
           gridcolor:"rgba(255,255,255,0.05)",zeroline:true,tickfont:{size:12}},
    shapes,annotations,
    legend:{orientation:"h",yanchor:"bottom",y:1.01,xanchor:"right",x:1,font:{size:16}},
    hovermode:"closest",
  };

  Plotly.react(divId, traces, layout, {displayModeBar:false,responsive:false});
  return min_t;
}

// ---- UI helpers ----
function updateVal(id,v){document.getElementById(id).textContent=v;}
function fmt(v){return Math.round(v).toLocaleString();}
function fmtDec(v,d=1){return (+v).toFixed(d);}

// ---- Tab A ----
function renderA(){
  const Ts=+document.getElementById("Ts").value;
  const eps=+document.getElementById("eps_a").value;
  const A=areaCylinder(DEFAULTS.D,DEFAULTS.L);
  const Qrad=qRadiation(eps,A,Ts,DEFAULTS.Ta);

  document.getElementById("a-qtot").textContent=fmt(Qrad);
  document.getElementById("a-tsurf").textContent=fmtDec(Ts);
  document.getElementById("a-qrad").textContent=fmt(Qrad);

  buildCrossSection("cs-a",DEFAULTS.D,0,Ts,Ts,DEFAULTS.Ta,0,Qrad);
  buildVesselSideView("sv-a",DEFAULTS.D,0,Ts,Ts,DEFAULTS.Ta,0,Qrad);
}

// ---- Tab B ----
function renderB(){
  const Tin=+document.getElementById("Tin_b").value;
  const t=+document.getElementById("t_b").value;
  const k=+document.getElementById("k_b").value;
  const eps=+document.getElementById("eps_b").value;
  const h=+document.getElementById("h_b").value;
  const out=solveCaseB(Tin,DEFAULTS.Ta,eps,DEFAULTS.L,DEFAULTS.D,t,k,h);

  document.getElementById("b-qtot").textContent=fmt(out.Q_total);
  document.getElementById("b-tsurf").textContent=fmtDec(out.Tz);
  document.getElementById("b-qconv").textContent=fmt(out.Q_conv);
  document.getElementById("b-qrad").textContent=fmt(out.Q_rad);

  buildCrossSection("cs-b",DEFAULTS.D,t,Tin,out.Tz,DEFAULTS.Ta,out.Q_conv,out.Q_rad);
  buildVesselSideView("sv-b",DEFAULTS.D,t,Tin,out.Tz,DEFAULTS.Ta,out.Q_conv,out.Q_rad);
  buildModeSplit("mode-b",out.Q_conv,out.Q_rad);
}

// ---- Tab C ----
function renderC(){
  const Tin=+document.getElementById("Tin_c").value;
  const k=+document.getElementById("k_c").value;
  const t_user=+document.getElementById("t_c").value;
  const h=+document.getElementById("h_c").value;
  const eps=0.85;
  const target=330;
  const out=solveCaseB(Tin,DEFAULTS.Ta,eps,DEFAULTS.L,DEFAULTS.D,t_user,k,h);

  document.getElementById("c-t").textContent=t_user.toFixed(3);
  document.getElementById("c-tsurf").textContent=fmtDec(out.Tz);
  document.getElementById("c-qtot").textContent=fmt(out.Q_total);
  document.getElementById("c-qconv").textContent=fmt(out.Q_conv);
  document.getElementById("c-qrad").textContent=fmt(out.Q_rad);

  const passed=out.Tz<=target+1e-9;
  const min_t=buildSafetyCurve("line-c",Tin,k,h,t_user,out);
  const statusEl=document.getElementById("c-status");

  if(passed){
    statusEl.className="status-box status-pass";
    statusEl.innerHTML=`✓ PASSED  T<sub>surface</sub> = ${fmtDec(out.Tz)} K ≤ ${target} K` +
      (min_t!==null?`  |  Minimum required: ${min_t.toFixed(3)} m`:"");
  } else {
    statusEl.className="status-box status-fail";
    statusEl.innerHTML=`✗ FAILED  T<sub>surface</sub> = ${fmtDec(out.Tz)} K > ${target} K` +
      (min_t!==null?`  |  Minimum required: ${min_t.toFixed(3)} m`:"  |  Target unreachable in 0–0.30 m range");
  }

  buildCrossSection("cs-c",DEFAULTS.D,t_user,Tin,out.Tz,DEFAULTS.Ta,out.Q_conv,out.Q_rad);
  buildVesselSideView("sv-c",DEFAULTS.D,t_user,Tin,out.Tz,DEFAULTS.Ta,out.Q_conv,out.Q_rad);
}

// ---- Tab switching ----
let currentTab="a";
function switchTab(id, btn){
  document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(p=>p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("tab-"+id).classList.add("active");
  setTimeout(()=>window.dispatchEvent(new Event("resize")),50);
  currentTab = id;
  if(id==="a") renderA();
  else if(id==="b") renderB();
  else if(id==="c") renderC();
}

// ---- Init ----
renderA();
window.addEventListener("resize", ()=>{
  if(currentTab==="a") renderA();
  else if(currentTab==="b") renderB();
  else if(currentTab==="c") renderC();
});