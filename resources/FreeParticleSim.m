%%%%% CHEN 4520: Superimposed PIB States Visualizaton %%%%%
% To fix: colors cycle if measuring while animating or animating after measure
% Also, double clicking Stop/start reinitializes from UserData property and will
% re-introduce waves post-collapse

%clear all;
function FreeParticleSim(varargin)
%% Initialize Parameters %%
warning off;

framerate=(0.1);
tstep=2;        % Increment of animation, 1 is full cycle at ZPE frequency (may need to decrease at high n)

if nargin~=0;
n0=varargin{1};
Cn0=ones(1,length(n0));
else
n0=[-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9,10];  % Choose eigenstate(s) 'n';  Length of n will change table size in the figure, 0's will be ignored
Cn0=[0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0]; % Weights for each state (should be same length as n and add to 1).
end



function [n,Cn,m,L]=GetState(default)  % default=1 uses values below, 0 extracts from GUI inputs
    if default==1         % Values here will be the defaults on 'reset'
        n=n0;  % Choose eigenstate(s) 'n';  Length of n will change table size in the figure, 0's will be ignored
        Cn=Cn0; % Weights for each state (should be same length as n and add to 1).
        m=1;              % Mass of particle (arbitrary unit, energy based on 1 amu)
    else
        h=findobj('Tag','TABLE1'); % Locate Table/Slider Objects and Extract User-Adjusted Values
        n=h.UserData.n; 
        Cn=h.UserData.Cn;
        h=findobj('Tag','SliderM'); 
        m=h.UserData;
    end   
end

[n,Cn,m]=GetState(1);


x=-pi:1/(10*max(abs(n))):pi;     

t=0; go=0;         % Initialize time and 'go', which sets run/stop for animation

[psi,pstates]=Superimpose();  % Add up the psi_n functions, weighted by w's

%% Figure format preferences 
f1=figure('units','Normalized','position',[0,0,0.6,0.8],'color','w'); ysize=max(abs(n(find(Cn>0))))+1; ysize2=length(find(Cn~=0)); XL=[min(x)/2/pi,max(x)/2/pi];
axs(1)=subplot(4,3,[2 3 5 6]); title('Individual p-states {\psi}_i=e^i^k^x (Re[{\psi}_i] only, offset by k for visibility)'); set(gca,'fontsize',14);  xlim(XL); hold all; set(gca,'NextPlot','replacechildren'); 
axs(2)=subplot(4,3,[8 9]); title('{\Sigma}{\psi_i}, Real and Imag Components');  ylim([-ysize2,ysize2]);  xlim(XL); set(gca,'fontsize',14); hold all; set(gca,'NextPlot','replacechildren');        %'HandleVisibility','off');
%ax3=subplot(4,1,3); title('Im({\Sigma}{\psi_i})');  ylim([-ysize,ysize]); set(gca,'fontsize',14); hold all; set(gca,'NextPlot','replacechildren'); 
axs(3)=subplot(4,3,[11 12]); title('|{\Psi}|^2  (={\Psi}^*{\Psi} = {\Sigma}{\psi_i}^*·{\Sigma}{\psi_i})'); ylim([0,ysize2^2]);  xlim(XL); xlabel('x/{\lambda_1}');   set(gca,'fontsize',14); hold all; set(gca,'NextPlot','replacechildren'); 

%% Setup UI
% n-states and coefficient^2 Table
 NW=uitable('Parent', f1, 'Units', 'Normalized', 'Position',[0.075, 0.1, 0.22, 0.52], ...
     'ColumnWidth','auto', ...  % only allows value in pixels, auto still creates some issues on low-res screens ....
     'Data', [n',Cn'], 'ColumnName', {'k' , 'C_k' },'ColumnEditable',[true true],...
     'Tag','TABLE1',...
     'UserData',struct('n',n,'Cn',Cn),...
      'CellEditCallback',{@ReinitializeNW});
 
 
%Start/Stop propagating wave button
SS=uicontrol('Parent', f1, 'Style', 'pushbutton','String','Start/Stop','FontWeight','bold',...
    'Units', 'Normalized', 'Position',[0.1, 0.875, 0.1, 0.05], ...  
    'Tag','StartStop',...
    'UserData',struct('t',t,'go',go),...
    'Callback',{@StartStop}); 

%Reset button (not to defaults, just return plot t=0)
RS=uicontrol('Parent', f1, 'Style', 'pushbutton','String','Reset t=0',...
    'Units', 'Normalized', 'Position',[0.25, 0.875, 0.1, 0.05 ], ...
    'Callback',{@ResetPlot});

%Reset To Defaults
DF=uicontrol('Parent', f1, 'Style', 'pushbutton','String','Reset Defaults',...
    'Units', 'Normalized', 'Position',[0.25, 0.775, 0.1, 0.05 ], ...
    'Callback',{@ResetParams});

%Measure State Button
Measure=uicontrol('Parent', f1, 'Style', 'pushbutton','String','Measure p','FontWeight','bold',...
    'Units', 'Normalized', 'Position',[0.1, 0.775, 0.1, 0.05], ...
    'Callback',{@MeasureState});

%Mass of Particle Slider
uicontrol('Parent', f1, 'Style', 'text','String','Mass', 'Units', 'Normalized','Position',[0.075, 0.7, 0.25, 0.025],'BackgroundColor','w')
uicontrol('Parent', f1, 'Style', 'text','String','0.5x    <--->    4x', 'Units', 'Normalized','Position',[0.075, 0.62, 0.25, 0.05],'BackgroundColor','w')
MP=uicontrol('Parent', f1, 'Style', 'slider','min',0.5*m,'max',4*m,'value',m, ...
     'Units', 'Normalized', 'Position',[0.075, 0.67, 0.25, 0.03], ...
     'Tag','SliderM',...
     'UserData',m,...
     'Callback',{@ReinitializeM});

 
 
MakePlot(); % Plot Initial State (moved below Table 1 initialization b/c n used in scaling)
           
%% Function to Time Evolve and Plot Wavefunction
function StartStop(SS,event)
       
    [n,Cn,m]=GetState(0);  % Reassigning state from GUI input
    t=SS.UserData.t;    go=SS.UserData.go;    % Time and start/stop status from assigned button metadata
    
    go=1-go;  % Switch run state between true/false on each execution
    SS.UserData.go=go; 
    if go==1
    NW.Data=[n',Cn']; % Adjusts visible table value, "Userdata" is not affected. This permits restoring table if psi was collapsed
    end
    while(go==1)
        t = t+tstep;
        SS.UserData.t=t; 

        [psi,pstates]=EvolvePsi();
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
    
    [psi,pstates]=Superimpose();
    MakePlot();  
end

function ReinitializeM(MP,event)   
    m=MP.Value;
    MP.UserData=m;
    
    [psi,pstates]=Superimpose();
    MakePlot();
end


%% Function to reset to t=0 and pause

function ResetPlot(RS,event)
   
    t=0; go=0;    % Return these to 0     
    SS.UserData.t=t;    SS.UserData.go=go;
    
    [n,Cn,m]=GetState(0);
    NW.Data=[n',Cn'];  % Put table back to original even after collapse
                       % Only n and Cn may have changed, m and L will be fixed 
    [psi,pstates]=Superimpose();
    MakePlot();    
end

%% Function to Restore Defaults

function ResetParams(DF,event)
    t=0; go=0;    % Return these to 0    
    SS.UserData.t=t;    SS.UserData.go=go;
    
    [n,Cn,m]=GetState(1);
    
    NW.Data=[n',Cn']; % Reset Table/Sliders
    MP.Value=m;
    
    NW.UserData=struct('n',n,'Cn',Cn); % Reset Metadata (metadata allows retaining original input during a collapse
    MP.UserData=m;
    
    [psi,pstates]=Superimpose();  % Add up the psi_n functions, weighted by w's
    MakePlot(); 
end

%% Function to Collapse Wavefunction
function MeasureState(Measure,event)

    Cn=Cn.^2/sum(Cn.^2); % In case user-given weights^2 don't add to 1.
    probe=rand();
    test=cumsum(Cn);   
    index=max(find((probe>test)))+1;  % Just comparing random number (0 to 1) vs ranges assigned in proportion to each probability
    if(isempty(index)); index=1; end  % fixing above if first term located: 'find()' gives empty matrix instead of 0
    
    OriginalWaves=get(axs(1),'children');   % Extract the color of the line that will remain
    OriginalWaves=flipud(OriginalWaves);    % Children populates backward
    OriginalColors=get(OriginalWaves,'color'); 
    if length(n)>1; OriginalColors=cell2mat(OriginalColors);  end %Stupid Matlab makes 'color' a matrix if 1 element but cell array if >1
    ColorIndex=index-length(find(Cn(1:(index-1))==0));
        
    %nt=n(index);
    %n(:)=0;
    Cn(:)=0;
    %n(index)=nt;        % reassign n and Cn with only one state
    Cn(index)=1;
      
    NW.Data=[n',Cn']; % Only Changes Visible Entry on Table, "Userdata" property has original state and can be read when setting t=0
    
    [psi,pstates]=Superimpose();
    MakePlot();  
    
    RemainingState=get(axs(1),'children');     %Restore color of remaining line for better illustration
    set(RemainingState,'color',OriginalColors(ColorIndex,:));
end

%% Function to Create Superposition State
function [psi,WeightedStates]=Superimpose();

 InitialStates=exp(sqrt(-1)*n'*x);  
 WeightedStates=InitialStates.*repmat(Cn',1,length(x));   % adding up all the contributing waves to get psi % Scaling eigenfunctions by coefficients
 psi=sum(WeightedStates,1);    

end

%% Function to Create Superposition with Time Evolution
function [psi,TimeEvolved]=EvolvePsi();

    freq=n.^2/(2*pi*m)^2;   % Dividing out h, which would scale the frequencies to be very fast
    PhaseShifts=exp(sqrt(-1)*freq*t);    % This should be exp(-i*freq*t) but there is a sign flip somewhere -- swapping to make positive k go right
    
    InitialStates=exp(sqrt(-1)*n'*x);  
    WeightedStates=InitialStates.*repmat(Cn',1,length(x));    
    TimeEvolved=WeightedStates.*repmat(PhaseShifts',1,length(x));

    psi=sum(TimeEvolved,1);     % adding up all the contributing waves to get total psi                                      
end


%% Plotting Functions
function MakePlot();

    ntemp=n(Cn ~= 0);
    offset=repmat(ntemp',1,length(x));
    pstates = pstates(any(pstates~=0,2),:);  % Ditch empty rows (c=0)
    
    
    h=findobj('Tag','TABLE1'); % Locate Table/Slider Objects and Extract User-Adjusted Values
    nt=h.UserData.n; % Get original n, even after Collapse, to keep original axes scale so effect is more clear
    Cnt=h.UserData.Cn;
    ys1=max(abs(nt(find(Cnt>0))))+1;
    
    
    axes(axs(1));
    plot(x/(2*pi),(pstates+offset),'linewidth',2); 
    ylim([-ys1,ys1]);
    
    if length(find((Cn ~= 0)))>1                      % Leaves axes in place if Collapse is run, so effect is more visible
        legend('off')
    else
        %legend({[num2str(n(find(Cn>0))),' *h/2{\pi}']});
        legend({[num2str(n(find(Cn>0))),'$\hbar$']},'Interpreter','latex');
            %Latex Interpreter glitch has been noted by a few people
    end

    axes(axs(2));
    ys2=1.1*length(find(Cn~=0));
    ylim([-ys2,ys2]);
    plot(x/(2*pi),[real(psi);imag(psi)],'linewidth',2);  
    legend({'Re({\Psi})';'Im({\Psi})'});
    
    axes(axs(3));
    ylim([0,ys2.^2]);
    plot(x/(2*pi),psi.*conj(psi),'k','linewidth',2); 
end



% Energy calc note:
% h^2n^2/8mL^2 gives (6.62^2/8*(n^2/1.67mL^2)*1e-23 J for m=1 amu, 1 nm box
% ------
%amu=1.67e-27;      % proton mass, kg
%emass=amu/1836;    % electronmass, kg
%h=6.62e-34         % Planck Const, J-s = [kg-m^2/s]
% ------

end