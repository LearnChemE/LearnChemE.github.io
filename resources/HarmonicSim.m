%%%%% CHEN 4520: Superimposed PIB States Visualizaton %%%%%

function HarmonicSim()
%% Initialize Parameters %%
clear all; warning off;

framerate=(0.1);
tstep=0.05;           % Increment of animation, 1 is full cycle at ZPE frequency (may need to decrease at high n)

x=-2:0.002:2;        % 

function [n,Cn,m,kf]=GetState(default)  % default=1 uses values below, 0 extracts from GUI inputs
    if default==1         % Values here will be the defaults on 'reset'
        n=[0,1,2,3,4,5];  % Choose eigenstate(s) 'n';  Length of n will change table size in the figure, 0's will be ignored
        Cn=[1,0,0,0,0,0]; % Weights for each state (should be same length as n and add to 1).
        m=1;              % Mass of particle (arbitrary unit, energy based on 1 amu)
        kf=100;           % Spring constant, N/m
    else
        h=findobj('Tag','TABLE1'); % Locate Table/Slider Objects and Extract User-Adjusted Values
        n=h.UserData.n; 
        Cn=h.UserData.Cn;
        h=findobj('Tag','SliderM'); 
        m=h.UserData;
        h=findobj('Tag','SliderK'); 
        kf=h.UserData;
    end   
end

[n,Cn,m,kf]=GetState(1);

x1=-1;x2=1;         % Default integral limits
t=0; go=0;          % Initialize time and 'go', which sets run/stop for animation

y=x*(m*kf).^(0.25);  % Unitless, dropped hbar, proportionality to m, kf is all that matters
H=InitializeHermites();
psi=Superimpose();  % Add up the psi_n functions, weighted by w's

%% Figure format preferences 
f1=figure('units','Normalized','position',[0,0,0.6,0.8],'color','w'); ysize=1.5;
axs(1)=subplot(2,2,[2 4]); title('Energy and Probability Density: |{\Psi}|^2  (={\Psi}^*{\Psi})'); ylim([0,ysize^2]);  xlabel('x-x_0'); ylabel('Energy (kJ/mol)');  set(gca,'fontsize',14); hold all; set(gca,'NextPlot','replacechildren'); 
%axs(2)=subplot(2,2,3); title('Energy (J/mol)'); set(gca,'fontsize',14); hold all; set(gca,'NextPlot','replacechildren');        %'HandleVisibility','off');
axs(3)=subplot(2,2,3); title('Real & Imaginary Components');  ylim([-ysize,ysize]); xlabel('x-x_0'); set(gca,'fontsize',14); hold all; set(gca,'NextPlot','replacechildren'); 
MakePlot(); % Plot Initial State

%% Setup UI
% n-states and coefficient^2 Table
NW=uitable('Parent', f1, 'Units', 'Normalized', 'Position',[0.075, 0.775, 0.22, 0.175], ...
     'ColumnWidth','auto', ...  % only allows value in pixels, auto still creates some issues on low-res screens ....
     'Data', [n',Cn'], 'ColumnName', {'n' , 'C_n' },'ColumnEditable',[true true],...
     'Tag','TABLE1',...
     'UserData',struct('n',n,'Cn',Cn),...  %(Duplicate info in metadata to retain original input during a collapse and permit querying data regardless of fxn scope)
     'CellEditCallback',{@ReinitializeNW});

%Start/Stop propagating wave button
SS=uicontrol('Parent', f1, 'Style', 'pushbutton','String','Start/Stop','FontWeight','bold',...
    'Units', 'Normalized', 'Position',[0.4, 0.9, 0.1, 0.05], ...
    'Tag','StartStop',...
    'UserData',struct('t',t,'go',go),...
    'Callback',{@StartStop}); 

%Reset button (not to defaults, just return plot t=0)
RS=uicontrol('Parent', f1, 'Style', 'pushbutton','String','Reset t=0',...
    'Units', 'Normalized', 'Position',[0.4, 0.85, 0.1, 0.05 ], ...
    'Callback',{@ResetPlot});

%Reset To Defaults
DF=uicontrol('Parent', f1, 'Style', 'pushbutton','String','Reset Defaults',...
    'Units', 'Normalized', 'Position',[0.4, 0.8, 0.1, 0.05 ], ...
    'Callback',{@ResetParams});

%Measure State Button
Measure=uicontrol('Parent', f1, 'Style', 'pushbutton','String','Measure E','FontWeight','bold',...
    'Units', 'Normalized', 'Position',[0.4, 0.75, 0.1, 0.05], ...
    'Callback',{@MeasureState});

%Mass of Particle Slider
uicontrol('Parent', f1, 'Style', 'text','String','Mass (m0=1 amu)', 'Units', 'Normalized','Position',[0.075, 0.7, 0.25, 0.05],'BackgroundColor','w')
MP=uicontrol('Parent', f1, 'Style', 'slider','min',0.5*m,'max',4*m,'value',m, ...
     'Units', 'Normalized', 'Position',[0.075, 0.7, 0.24, 0.03], ...
     'Tag','SliderM',...
     'UserData',m,...
     'Callback',{@ReinitializeM});

%Force Constant Slider
uicontrol('Parent', f1, 'Style', 'text','String','Force Const. (kf0= 100 N/m)', 'Units', 'Normalized','Position',[0.075, 0.65, 0.25, 0.05],'BackgroundColor','w')
uicontrol('Parent', f1, 'Style', 'text','String','0.5x    <--->    4x', 'Units', 'Normalized','Position',[0.075, 0.61, 0.25, 0.05],'BackgroundColor','w')
KF=uicontrol('Parent', f1, 'Style', 'slider', 'min',0.5*kf,'max',4*kf,'value',kf, ...  %setting range from 1/2x to 4x default 
    'Units', 'Normalized', 'Position',[0.075, 0.65, 0.24, 0.03], ...
    'Tag','SliderK',...
    'UserData',kf,...
    'Callback',{@ReinitializeKF});

% Integration Limits Table
IT=uitable('Parent', f1, 'Units', 'Normalized', 'Position',[0.125, 0.55, 0.3, 0.07], ...
     'ColumnWidth','auto', ...  % only allows value in pixels, auto still creates some issues on low-res screens ....
     'Data', [-1,1,1], 'ColumnName', {'x1' , 'x2', 'Integral' },'ColumnEditable',[true true false],...
      'CellEditCallback',''); % No function needed, just pull values in Integrate button function
  
%Integrate Button
IG=uicontrol('Parent', f1, 'Style', 'pushbutton','String','Integrate','FontWeight','bold',...
    'Units', 'Normalized', 'Position',[0.4, 0.63, 0.1, 0.05], ...
    'Callback',{@IntegratePsi,IT});
          
           
%% Function to Time Evolve and Plot Wavefunction
function StartStop(SS,event)
       
    [n,Cn,m,kf]=GetState(0);  % Reassigning state from GUI input
    t=SS.UserData.t;    go=SS.UserData.go;    % Time and start/stop status from assigned button metadata
    
    go=1-go;  % Switch run state between true/false on each execution
    SS.UserData.go=go; 
    if go==1
    NW.Data=[n',Cn']; % Adjusts visible table value, "Userdata" is not affected. This permits restoring table if psi was collapsed
    end
    while(go==1)   
        t = t+tstep;
        SS.UserData.t=t; 

        psi=EvolvePsi();
        MakePlot();
        pause(framerate)    %%%%% Pause (seconds) before plotting next timestep.        
    end 
end

%% Functions to update plotting with new parameters   
    % seems these will only accept one UIcontrol item as source
    
function ReinitializeNW(NW,event)
    t=0;  
    SS.UserData.t=t;   
    
    n=NW.Data(:,1)';  % Transposing to keep compatible with n*x
    Cn=NW.Data(:,2)';
    NW.UserData=struct('n',n,'Cn',Cn); %Holder to recover the input values after collapsing psi
    
    H=InitializeHermites();  % Repopulate matrix with needed H_n (only really need if max n changes)
    psi=Superimpose();
    MakePlot();      
end

function ReinitializeM(MP,event)   
    m=MP.Value;
    MP.UserData=m;   
    
    H=InitializeHermites();   % Computed as H(y) where y=x*(m*kf).^(0.25)
    psi=Superimpose();
    MakePlot();
end

function ReinitializeKF(KF,event)
    kf=KF.Value;
    KF.UserData=kf;
    
    H=InitializeHermites(); 
    psi=Superimpose();
    MakePlot();   
end


%% Function to reset to t=0 and pause

function ResetPlot(RS,event)
    t=0; go=0;    % Return these to 0     
    SS.UserData.t=t;    SS.UserData.go=go;
    
    [n,Cn,m,kf]=GetState(0);
    NW.Data=[n',Cn'];  % Put table back to original even after collapse
                       % Only n and Cn may have changed, m and kf will be fixed 
    psi=Superimpose();
    MakePlot();    
end



%% Function to Restore Defaults

function ResetParams(DF,event)
    t=0; go=0;    % Return these to 0    
    SS.UserData.t=t;    SS.UserData.go=go;
    
    [n,Cn,m,kf]=GetState(1);
    
    NW.Data=[n',Cn']; % Reset Table/Sliders
    KF.Value=kf;
    MP.Value=m;
    
    NW.UserData=struct('n',n,'Cn',Cn); % Reset Metadata (metadata allows retaining original input during a collapse
    MP.UserData=m;
    KF.UserData=kf;
    
    H=InitializeHermites(); 
    psi=Superimpose();  % Add up the psi_n functions, weighted by w's
    MakePlot(); 
end

%% Function to Collapse Wavefunction
function MeasureState(Measure,event)

    Cn=Cn.^2/sum(Cn.^2); % In case user-given weights^2 don't add to 1.
    probe=rand();
    test=cumsum(Cn);   
    index=max(find((probe>test)))+1;  % Just comparing random number (0 to 1) vs ranges assigned in proportion to each probability
    if(isempty(index)); index=1; end  % fixing above if first term located: 'find()' gives empty matrix instead of 0
    
    %nt=n(index);
    %n(:)=0;
    Cn(:)=0;
    %n(index)=nt;        % reassign n and Cn with only one state
    Cn(index)=1;
      
    NW.Data=[n',Cn']; % Only Changes Visible Entry on Table, "Userdata" property has original state and can be read when setting t=0
    
    psi=Superimpose();
    MakePlot();  
end

%% Function to Compile Hermite Poynomial List (recomputing with 'hermiteH()' is slow)
function H=InitializeHermites();   % Store first few to run most sims faster
   
    y=x*(m*kf).^(0.25);  % Unitless, dropped hbar, proportionality to m, kf is all that matters
    
    H=zeros(length(n),length(y));
    H(1,:)=1;
    H(2,:)=2*y;
    H(3,:)=4*y.^2-2;
    H(4,:)=8*y.^3-12*y;
    H(5,:)=16*y.^4-48*y.^2-12;
    H(6,:)=32*y.^5-160*y.^3+120*y;
    H(7,:)=64*y.^6-480*y.^4+720*y.^2-120;
    for p=8:(max(n)+1)      
        H(p,:) = 2*y.*H(p-1,:) - 2*(p-2)*H(p-2,:);   
    end     
    H=H(n+1,:).*repmat(exp(-y.^2/2),length(n),1); 
    H=H./repmat(sqrt((trapz(y,conj(H).*H,2))),1,length(y)); %integrate to nomralize over each row, leave as matrix
    % Numerically normalizing --> don't need N=(m*kf*sqrt(pi)*2.^(n+1)'*factorial((n+1)')).^(-0.5);   
end

%% Function to Create Superposition State
function psi=Superimpose();
 WeightedStates=H.*repmat(Cn',1,length(y));   % Scaling eigenfunctions by coefficients
 psi=sum(WeightedStates,1);                   % adding up all the contributing waves to get psi
 psi = psi./sqrt((trapz(y,conj(psi).*psi)));  % Force Normalization in case weights don't add to 1 
end

%% Function to Create Superposition with Time Evolution
function psi=EvolvePsi();
    freq=(n+0.5).*sqrt(kf/m);   % AngularFreq = E/hbar; HO energy levels. Dividing out h, which would scale the frequencies to be very fast
    PhaseShifts=exp(-sqrt(-1)*freq*t);    

    WeightedStates=H.*repmat(Cn',1,length(y));  
    TimeEvolved=WeightedStates.*repmat(PhaseShifts',1,length(y));

    psi=sum(TimeEvolved,1);     % adding up all the contributing waves to get total psi
    psi = psi./sqrt((trapz(y,conj(psi).*psi))); %Force Normalization in case weights don't add to 1 
end

%% Function to take integral
function IntegratePsi(IG,event,IT)

    go=0;               %pause evolution
    SS.UserData.go=go;  
    
    x1=IT.Data(1); x2=IT.Data(2);
    %fxn=@(q) conj(EvolvePsi(n,Cn,m,kf,t,q)).*EvolvePsi(n,Cn,m,kf,t,q); %calling x -> 'q' to avoid possible scope issues
    %IT.Data(3)=integral(fxn,x1,x2);   % more accurate integration, maybe swap out later
    q=linspace(x1,x2,100);  % x is full range, q is chosen range. 
    psiX=EvolvePsi();       % Evolve function normalizes over full "x" (not feeding it subrange q)
    psiQ=interp1(x,psiX,q);       % grab section of plot for integration 
    psi2=conj(psiQ).*psiQ;        % psi^2 on domain q
    IT.Data(3)=trapz(q,psi2)*(m*kf).^(0.25);   % dy=(m*kf).^(0.25)*dx
    
    QN=0:max(5,max(n(find(Cn~=0))));
    levels=(QN+0.5)*sqrt(kf/m)*(6.62/(1.67*2*pi))*3.16*6.022*100/1000; % In J/mol ;
    energies=(n+0.5)*sqrt(kf/m)*(6.62/(1.67*2*pi))*3.16*6.022*100/1000; % In J/mol ;
    probs = conj(Cn).*Cn./(sum(conj(Cn).*Cn));
    Esys=sum(probs.*energies);

    axes(axs(1)); hold all
    area(q,psi2*(0.1*levels(end))+Esys,'Basevalue',Esys,'Facecolor','b'); %Shift up to E level and scale psi for visibility (won't affect integral already taken) 
    set(gca,'NextPlot','replacechildren'); % delete shading when any inputs are changed
end


%% Plotting Functions
function MakePlot();

    axes(axs(1));
   
    QN=0:max(5,max(n(find(Cn~=0))));
    levels=(QN+0.5)*sqrt(kf/m)*(6.62/(1.67*2*pi))*3.16*6.022*100/1000; % In kJ/mol 
    energies=(n+0.5)*sqrt(kf/m)*(6.62/(1.67*2*pi))*3.16*6.022*100/1000; % In kJ/mol 
    probs = conj(Cn).*Cn./(sum(conj(Cn).*Cn));
    Esys=sum(probs.*energies);

    xL=min(x); xH=max(x);
    %axes(axs(1));
    plot([xL,xH],[levels;levels],':k','linewidth',2); hold all
    plot([xL,xH],[Esys;Esys],'r','linewidth',3);
    plot(x,0.5*kf*x.^2,'k','linewidth',2);
    plot(x,psi.*conj(psi)*(0.1*levels(end))+Esys,'k','linewidth',2); %Shift up to E level and scale psi for visibility (loses) abs mag 
    set(axs(1),'NextPlot','replacechildren');
    ylim([0,1.1*levels(end)]);
    
    axes(axs(3)); 
    plot(x,real(psi),'b','linewidth',2); hold all
    plot(x,imag(psi),'r','linewidth',2); 
    %plot(x,psi.*conj(psi),'k:','linewidth',1);
    set(axs(3),'NextPlot','replacechildren'); legend({'Re({\Psi})';'Im({\Psi})'})    

end



end



% Energy calc note:
% hbar*^sqrt(k/m) gives (6.62/(1.67*2*pi)*3.16e-21 J for m=1 amu, k in N/m
% 
% ------
%amu=1.67e-27;      % proton mass, kg
%emass=amu/1836;    % electronmass, kg
%h=6.62e-34         % Planck Const, J-s = [kg-m^2/s]

%builtin Hermite route:
% InitialStates=zeros(length(n),length(x));
% for a=1:length(n)
%     InitialStates(a,:)=hermiteH(a,x).*exp(-x.^2/2);
% end

 
% ------
