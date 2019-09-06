%%%%% CHEN 4520: Superimposed PIB States Visualizaton %%%%%

function PIBsim1()
%% Initialize Parameters %%
clear all; warning off;

framerate=(0.1);
tstep=0.005;        % Increment of animation, 1 is full cycle at ZPE frequency (may need to decrease at high n)

x=0:0.005:1;        % "x" = (x/L) below, leave range 0-to-1

function [n,Cn,m,L]=GetState(default)  % default=1 uses values below, 0 extracts from GUI inputs
    if default==1         % Values here will be the defaults on 'reset'
        n=[1,2,3,4,5,6];  % Choose eigenstate(s) 'n';  Length of n will change table size in the figure, 0's will be ignored
        Cn=[1,0,0,0,0,0]; % Weights for each state (should be same length as n and add to 1).
        m=1;              % Mass of particle (arbitrary unit, energy based on 1 amu)
        L=1;              % Length of box (arbitrary unit, energy based on 1 nm)
    else
        h=findobj('Tag','TABLE1'); % Locate Table/Slider Objects and Extract User-Adjusted Values
        n=h.UserData.n; 
        Cn=h.UserData.Cn;
        h=findobj('Tag','SliderM'); 
        m=h.UserData;
        h=findobj('Tag','SliderL'); 
        L=h.UserData;
    end   
end

[n,Cn,m,L]=GetState(1);

x1=0;x2=1;         % Default integral limits
t=0; go=0;         % Initialize time and 'go', which sets run/stop for animation

psi=Superimpose();  % Add up the psi_n functions, weighted by w's

%% Figure format preferences 
f1=figure('units','Normalized','position',[0,0,0.6,0.8],'color','w'); ysize=1.6*sqrt(2/L);
axs(1)=subplot(2,2,2); title('Probability Density: |{\Psi}|^2  (={\Psi}^*{\Psi})'); ylim([0,ysize^2]);  xlabel('x/L');   set(gca,'fontsize',14); hold all; set(gca,'NextPlot','replacechildren'); 
axs(2)=subplot(2,2,3); title('Energy (J/mol)'); set(gca,'fontsize',14); hold all; set(gca,'NextPlot','replacechildren');        %'HandleVisibility','off');
axs(3)=subplot(2,2,4); title('Real & Imaginary Components');  ylim([-ysize,ysize]); xlabel('x/L'); set(gca,'fontsize',14); hold all; set(gca,'NextPlot','replacechildren'); 
MakePlot(); % Plot Initial State
Eplot(); % Plot Initial Energy State

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

%Length of Box Slider
uicontrol('Parent', f1, 'Style', 'text','String','Length (L0= 1nm)', 'Units', 'Normalized','Position',[0.075, 0.65, 0.25, 0.05],'BackgroundColor','w')
uicontrol('Parent', f1, 'Style', 'text','String','0.5x    <--->    4x', 'Units', 'Normalized','Position',[0.075, 0.61, 0.25, 0.05],'BackgroundColor','w')
LB=uicontrol('Parent', f1, 'Style', 'slider', 'min',0.5*L,'max',4*L,'value',L, ...   %setting range from 1/2x to 4x default 
    'Units', 'Normalized', 'Position',[0.075, 0.65, 0.24, 0.03], ...
    'Tag','SliderL',...
    'UserData',L,...
    'Callback',{@ReinitializeL});

% Integration Limits Table
IT=uitable('Parent', f1, 'Units', 'Normalized', 'Position',[0.075, 0.55, 0.3, 0.07], ...
     'ColumnWidth','auto', ...   % only allows value in pixels, auto still creates some issues on low-res screens ....
     'Data', [0,1,1], 'ColumnName', {'x1' , 'x2', 'Integral' },'ColumnEditable',[true true false],...
      'CellEditCallback',''); % No function needed, just pull values in Integrate button function
  
%Integrate Button
IG=uicontrol('Parent', f1, 'Style', 'pushbutton','String','Integrate','FontWeight','bold',...
    'Units', 'Normalized', 'Position',[0.4, 0.55, 0.1, 0.05], ...
    'Callback',{@IntegratePsi,IT});        
           
%% Function to Time Evolve and Plot Wavefunction
function StartStop(SS,event)
       
    [n,Cn,m,L]=GetState(0);  % Reassigning state from GUI input
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
    % seems these will only accept one UIcontrol item as source, making individual fxns
    
function ReinitializeNW(NW,event)  
    t=0;  
    SS.UserData.t=t;   
    
    n=NW.Data(:,1)';  % Transposing to keep compatible with n*x
    Cn=NW.Data(:,2)';
    NW.UserData=struct('n',n,'Cn',Cn); %Holder to recover the input values after collapsing psi
    
    psi=Superimpose();
    MakePlot();  
    Eplot()
end

function ReinitializeM(MP,event)   
    m=MP.Value;
    MP.UserData=m;
    
    psi=Superimpose();
    MakePlot();
    Eplot();
end

function ReinitializeL(LB,event) 
    L=LB.Value;
    LB.UserData=L;
    
    psi=Superimpose();
    MakePlot();  
    Eplot();
end

%% Function to reset to t=0 and pause

function ResetPlot(RS,event)
   
    t=0; go=0;    % Return these to 0     
    SS.UserData.t=t;    SS.UserData.go=go;
    
    [n,Cn,m,L]=GetState(0);
    NW.Data=[n',Cn'];  % Put table back to original even after collapse
                       % Only n and Cn may have changed, m and L will be fixed 
    psi=Superimpose();
    MakePlot();    
end

%% Function to Restore Defaults

function ResetParams(DF,event)
    t=0; go=0;    % Return these to 0    
    SS.UserData.t=t;    SS.UserData.go=go;
    
    [n,Cn,m,L]=GetState(1);
    
    NW.Data=[n',Cn']; % Reset Table/Sliders
    LB.Value=L;
    MP.Value=m;
    
    NW.UserData=struct('n',n,'Cn',Cn); % Reset Metadata (metadata allows retaining original input during a collapse
    MP.UserData=m;
    LB.UserData=L;
    
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
    Eplot();
end

%% Function to Create Superposition State
function psi=Superimpose();

 EigenStates=sqrt(2/L)*sin(n'*pi*x);                   %PIB eigenstates "x" = (x/L) to simplify plotting; n'*x gives length(n)*length(x) matrix w/individual states as rows
 WeightedStates=EigenStates.*repmat(Cn',1,length(x));  % Scaling eigenfunctions by coefficients

 psi=sum(WeightedStates,1);                  % adding up all the contributing waves to get psi
 psi = psi./sqrt((trapz(x,conj(psi).*psi))); % Force Normalization in case weights don't add to 1 
                                             % Note d"x" = dX/L cancels in Num/Denom for finding probabilities later   
end

%% Function to Create Superposition with Time Evolution
function psi=EvolvePsi();

    freq=2*pi*n.^2/(m*L)^2;   % AngularFreq = E/hbar; E is proportional to (n/mL)^2 for PIB. Dividing out h, which would scale the frequencies to be very fast
    PhaseShifts=exp(-sqrt(-1)*freq*t);    
    
    EigenStates=sqrt(2/L)*sin(n'*pi*x);  % "x" = (x/L) to simplify plotting;  n'*x gives length(n)*length(x) matrix w/individual states as rows
    WeightedStates=EigenStates.*repmat(Cn',1,length(x));  
    TimeEvolved=WeightedStates.*repmat(PhaseShifts',1,length(x));

    psi=sum(TimeEvolved,1);     % adding up all the contributing waves to get total psi
    psi = psi./sqrt((trapz(x,conj(psi).*psi))); % Force Normalization in case weights don't add to 1 
                                                % Note d"x" = dX/L cancels Num/Denom                                            
end

%% Function to take integral
function IntegratePsi(IG,event,IT)

    go=0;               %pause evolution
    SS.UserData.go=go;  

    x1=IT.Data(1); x2=IT.Data(2);
    %fxn=@(q) conj(EvolvePsi(n,Cn,m,L,t,q)).*EvolvePsi(n,Cn,m,L,t,q); %calling x -> 'q' to avoid possible scope issues
    %IT.Data(3)=integral(fxn,x1,x2);   % more accurate integration, maybe swap out later
    q=linspace(x1,x2,1000);  % x is full range, q is chosen range. 
    psiX=EvolvePsi();        % Evolve function normalizes over full "x" (not feeding it subrange q)
    psiQ=interp1(x,psiX,q);       % grab section of plot for integration 
    psi2=conj(psiQ).*psiQ;        % psi^2 on domain q
    IT.Data(3)=trapz(q,psi2);
    axes(axs(1)); hold all
    area(q,psi2/L,'Facecolor','b');         %  "/L" to match plot scaling in Makeplot function
    set(gca,'NextPlot','replacechildren');  % delete shading when any inputs are changed
end

%% Plotting Functions
function MakePlot();
%tic
    axes(axs(1));
    plot(x,psi.*conj(psi)/L,'k','linewidth',2);  % Scaling by L because axis is "x/L"
    axes(axs(3)); 
    plot(x,real(psi),'b',x,imag(psi),'r','linewidth',2); %hold all
    set(axs(3),'NextPlot','replacechildren'); legend({'Re({\Psi})';'Im({\Psi})'})  % replace curve of prior timestep   
%toc
end


function Eplot()
    QN=1:max(6,max(n(find(Cn~=0))));   % Find largest quantum number; Ymax will still be for n=6 if only low n are input.
    levels=(QN).^2/(8*1.67*m*L)^2*6.62^2*6.02; % In J/mol   % List of all energies spanned by plot range (for reference marks)

    energies=n.^2/(8*1.67*m*L)^2*6.62^2*6.02; % In J/mol    %List of actual contributing wave energies
    probs = conj(Cn).*Cn./(sum(conj(Cn).*Cn));
    Esys=sum(probs.*energies);                              

    axes(axs(2));
    plot([0,1],[levels;levels],':k','linewidth',2); hold all   % Reference lines
    plot([0,1],[Esys;Esys],'r','linewidth',3);                 % System energy line
    set(axs(2),'NextPlot','replacechildren');
    ylim([0,1.2*levels(end)]);                                 % Create some space above highest level for visibility
end

% Energy calc note:
% h^2n^2/8mL^2 gives (6.62^2/8*(n^2/1.67mL^2)*1e-23 J for m=1 amu, 1 nm box
% ------
%amu=1.67e-27;      % proton mass, kg
%emass=amu/1836;    % electronmass, kg
%h=6.62e-34         % Planck Const, J-s = [kg-m^2/s]
% ------

end