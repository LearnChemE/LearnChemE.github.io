% written as COVID19 replacement lab in CHEN 4570
% by Scott Rowe
% EXAMPLE CALL IN THE MATLAB COMMAND LINE >> obj = Separator(8)
classdef Separator < handle
    properties
        disturbances = [];
        time = {};
        saveSnap = {};
        liq = {};
        gas = {};
        disturbanceController = {};
        pspan = 1:1:120;
        k = [];
        unitFigure = [];
        unitImage  = [];
        height = [];
        width  = [];
        states = [];
        inputs = [];
        n      = [];
        dt     = [];
        times  = [];
        PandID = {};
        pauto  = [];
        pstpt  = [];
        punits = [];
        pErrors = [];
        pPV = {};
        pressureAxes = {};
        pressurePlot = {};                         % pressure graph
        pressureLeft = [];
        pressureRight = [];
        pressureLeftTimes = [];        
        pressureRightTimes = [];
        pressureLeftLine = [];        
        pressureRightLine = [];
        pressureController = {};
        pressureAuto = {};
        lunits = [];
        lauto  = [];
        lstpt  = [];
        lErrors = [];
        lPV = {};
        levelAxes = {};
        levelPlot = {};                            % level graph
        levelLeft = [];
        levelRight = [];
        levelLeftTimes = [];
        levelRightTimes = [];
        levelLeftLine = [];
        levelRightLine = [];
        levelController = {};
        levelAuto = {};
        tunits = [];
        tauto  = [];
        tstpt  = [];
        tErrors = [];
        tPV = {};
        temperatureAxes = {};
        temperaturePlot = {};                      % temperature graph
        temperatureLeft = [];
        temperatureRight = [];
        temperatureLeftTimes = [];
        temperatureRightTimes = [];   
        temperatureLeftLine = [];
        temperatureRightLine = []; 
        temperatureController = {};
        temperatureAuto = {};
    end
    methods
        % obj = Separator(8)
        function obj = Separator(speed)
            close all;
        	obj.PandID = imread([pwd,'\flash.png']);
            obj.n = 900;
            obj.dt = 1;
            obj.times = (0:obj.dt:obj.n*obj.dt)';
            obj.times = flipud(obj.times);
            obj.pErrors = 0;
            obj.tErrors = 0;
            obj.lErrors = 0;
            
            obj.disturbances = NaN*ones(length(obj.times),3);
            
            obj.temperatureLeftTimes = [obj.times obj.times];
            obj.temperatureRightTimes = obj.times;
            obj.temperatureLeft = NaN*ones(size(obj.temperatureLeftTimes));
            obj.temperatureRight = NaN*ones(size(obj.temperatureRightTimes));            

            obj.pressureLeftTimes = [obj.times obj.times];
            obj.pressureRightTimes = obj.times;
            obj.pressureLeft = NaN*ones(size(obj.pressureLeftTimes));
            obj.pressureRight = NaN*ones(size(obj.pressureRightTimes)); 
            
            obj.levelLeftTimes = [obj.times obj.times];
            obj.levelRightTimes = obj.times;
            obj.levelLeft = NaN*ones(size(obj.levelLeftTimes));
            obj.levelRight = NaN*ones(size(obj.levelRightTimes)); 
            
            obj.height = 720;
            obj.width  = 1280;
            obj.unitFigure = figure('name','Flash',...
                                    'numbertitle','off',...
                                    'MenuBar','None',...
                                    'Units','pixels',...
                                    'Position',[0 0 obj.width obj.height],...
                                    'resize',0);
            obj.states = [16.1886412292951          % Mv
                          0.696613452862335         % y
                          2003.89883140267          % Ml
                          0.303386547137665         % x
                          455.361990495356];        % T
            obj.inputs = [400                       % Tin : Temperature at the inlet (K)
                          15                        % F : Molar flowrate at inlet (mol/s)
                          500000                    % Q : Heat added to column
                          0.5                       % l, lift
                          0.6597                    % q, Volumetric flowrate of bottoms L/sec
                          0.5];                     % xin
            obj.pauto = 0;
            obj.lauto = 0;
            obj.tauto = 0;
            obj.pstpt = obj.inputs(4);                           % lift l
            obj.lstpt = obj.inputs(5);
            obj.tstpt = obj.inputs(3);
            
            buildFields(obj);
                  
            buildPlots(obj);
            
            obj.time = timer('TimerFcn',@(src,evt)runFlash(obj,src,evt),...
                             'Period',1/speed,...
                             'ExecutionMode','fixedSpacing',...
                             'TasksToExecute',Inf);
            set(obj.unitFigure,'CloseRequestFcn',@(event,handles)closeMe(obj,event,handles));
            start(obj.time);
        end
        function closeMe(obj,event,handles)
            stop(obj.time);
            delete(obj.time);
            delete(obj.unitFigure);
            clear;
        end
        
        % obj.states(1) = Mv
        % obj.states(2) = y
        % obj.states(3) = Ml
        % obj.states(4) = x
        % obj.states(5) = T
        
        % obj.inputs(1) = Tin
        % obj.inputs(2) = F
        % obj.inputs(3) = Q
        % obj.inputs(4) = l, lift
        % obj.inputs(5) = q, L/sec
        % obj.inputs(6) = xin
        function runFlash(obj,src,evt)
            P = pressure(obj,obj.states(5),obj.states(1),obj.states(3),obj.states(4));
            obj.pPV.String = num2str(P);
            [inputs4 obj.pErrors] = PI(      obj.pressureController.Data(2),... % Kc
                                             obj.pressureController.Data(3),... % tauI
                                             obj.pErrors,...                    % pErrors for accumulation
                                             obj.inputs(4),...                  % current lift, mv
                                             P,...                              % pressure (Pa), cv
                                             obj.pressureController.Data(1),... % stpt   (lift or Pa )
                                             obj.pauto);                        % manual (zero or one)
            % enforce saturation                          
            inputs4 = max(inputs4,sqrt(eps('double')));
            inputs4 = min(inputs4,1);
             
            obj.pressureRight = [ obj.pressureRight(2:size(obj.pressureRight,1),:)
                                  inputs4 ];         % lift l;
            T = obj.states(5);          
            obj.tPV.String = num2str(T);
            [inputs3 obj.tErrors] = PI(       obj.temperatureController.Data(2),... % Kc
                                              obj.temperatureController.Data(3),... % tauI
                                              obj.tErrors,...                       % tErrors for accumulation
                                              obj.inputs(3),...                     % Watts, mv
                                              T,...                     % Kelvin, cv
                                              obj.temperatureController.Data(1),... % stpt (Watts or Kelvin)
                                              obj.tauto);                           % manual (zero or one)
             % enforce saturation                          
             inputs3 = max(inputs3,sqrt(eps('double')));
             inputs3 = min(inputs3,1000000);
             
             obj.temperatureRight = [obj.temperatureRight(2:size(obj.temperatureRight,1),:)
                                     inputs3];
             
             rho = density(obj,obj.states(4));                   % mol/m3 liq    
             l = 100*obj.states(3)/rho;
             obj.lPV.String = num2str(l);
             [inputs5 obj.lErrors] = PI(      obj.levelController.Data(2),... % Kc
                                              obj.levelController.Data(3),... % tauI
                                              obj.lErrors,...                 % lErrors for accumulation
                                              obj.inputs(5),...               % q L/sec, mv
                                              l,...       % percent full, cv
                                              obj.levelController.Data(1),... % stpt (q or percent)
                                              obj.lauto);                     % manual (zero or one)
             % enforce saturation                          
             inputs5 = max(inputs5,sqrt(eps('double')));
             inputs5 = min(inputs5,10);

             obj.levelRight = [ obj.levelRight(2:size(obj.levelRight,1),:)
                                inputs5 ];        % L/sec liq  
            
            
            for i = 1:4
                dx = flash(obj,0,obj.states,[ obj.inputs(1)
                                              obj.inputs(2)
                                              inputs3
                                              inputs4
                                              inputs5 
                                              obj.inputs(6) ]);
                obj.states = obj.states + 0.25.*dx;
            end
            obj.gas = rectangle(obj.unitImage,...
                                'Position',[158 129 101 164],...
                                'FaceColor',[1 max(min(0.5+25*(P-7.440386915044158e+04)/7.440386915044158e+04,1),0) 1-max(min(0.5+25*(P-7.440386915044158e+04)/7.440386915044158e+04,1),0)],...
                                'EdgeColor',[1 max(min(0.5+25*(P-7.440386915044158e+04)/7.440386915044158e+04,1),0) 1-max(min(0.5+25*(P-7.440386915044158e+04)/7.440386915044158e+04,1),0)]);
            
            
            obj.liq = rectangle(obj.unitImage,...
                                'Position',[158 266+ceil((0.17-l/100)*164) 101 ceil(l*164/100)],...
                                'FaceColor',[max(min(0.5+20*(T-455.361990495356)/455.361990495356,1),0)  1 0],...
                                'EdgeColor',[max(min(0.5+20*(T-455.361990495356)/455.361990495356,1),0)  1 0]);
            updateData(obj);
            updateLines(obj);
            updateAxes(obj);
            
            
            
            drawnow();
        end
        function updateAxes(obj)
            yyaxis(obj.pressureAxes,'left');
            ylim(obj.pressureAxes,    [min(min(obj.pressureLeft))*0.9...
                                       max(max(obj.pressureLeft))*1.15]);
            yyaxis(obj.pressureAxes,'right');
            ylim(obj.pressureAxes,    [min(obj.pressureRight)*0.85...
                                       max(obj.pressureRight)*1.1]);    
                                       
            yyaxis(obj.temperatureAxes,'left');
            ylim(obj.temperatureAxes,    [min(min(obj.temperatureLeft))*0.9...
                                          max(max(obj.temperatureLeft))*1.15]);
            yyaxis(obj.temperatureAxes,'right');
            ylim(obj.temperatureAxes,    [min(obj.temperatureRight)*0.85...
                                          max(obj.temperatureRight)*1.1]);    
                                      
            yyaxis(obj.levelAxes,'left');
            ylim(obj.levelAxes,    [min(min(obj.levelLeft))*0.9...
                                    max(max(obj.levelLeft))*1.15]);
            yyaxis(obj.levelAxes,'right');
            ylim(obj.levelAxes,    [min(obj.levelRight)*0.85...
                                    max(obj.levelRight)*1.1]);  
        end
        function updateLines(obj)
            obj.pressureRightLine.YData = obj.pressureRight(length(obj.pressureLeftTimes) - fliplr(obj.pspan));
            obj.temperatureRightLine.YData = obj.temperatureRight;
            obj.levelRightLine.YData = obj.levelRight;
            obj.pressureLeftLine(1).YData = obj.pressureLeft(length(obj.pressureLeftTimes) - fliplr(obj.pspan),1);
            obj.pressureLeftLine(2).YData = obj.pressureLeft(length(obj.pressureLeftTimes) - fliplr(obj.pspan),2);                          
            obj.temperatureLeftLine(1).YData = obj.temperatureLeft(:,1);
            obj.temperatureLeftLine(2).YData = obj.temperatureLeft(:,2);
            obj.levelLeftLine(1).YData = obj.levelLeft(:,1);
            obj.levelLeftLine(2).YData = obj.levelLeft(:,2);
        end
        function updateData(obj)
            P = pressure(obj,obj.states(5),obj.states(1),obj.states(3),obj.states(4));
            obj.pressureLeft = [ obj.pressureLeft(2:size(obj.pressureLeft,1),:) 
                                 P  ~obj.pauto*P+obj.pauto*obj.pressureController.Data(1) ];
                             
            obj.temperatureLeft = [ obj.temperatureLeft(2:size(obj.temperatureLeft,1),:) 
                                    obj.states(5)  ~obj.tauto*obj.states(5)+obj.tauto*obj.temperatureController.Data(1) ];
                    
            rho = density(obj,obj.states(4));                   % mol/m3 liq                             
            l = 100.*obj.states(3)./rho;                        % percent full     
            obj.levelLeft = [ obj.levelLeft(2:size(obj.levelLeft,1),:)
                              l  ~obj.lauto*l+obj.lauto*obj.levelController.Data(1)     ];
            obj.disturbances = [ obj.disturbances(2:size(obj.pressureLeft,1),:) 
                                 obj.disturbanceController.Data'                              ];
        end
        function pressureToggle(obj,src,evt)
            P = pressure(obj,obj.states(5),obj.states(1),obj.states(3),obj.states(4));
            [inputs4 obj.pErrors] = PI(obj.pressureController.Data(2),... % Kc
                                       obj.pressureController.Data(3),... % tauI
                                       obj.pErrors,...                    % pErrors for accumulation
                                       obj.inputs(4),...                  % current lift, mv
                                       P,...                              % pressure (Pa), cv
                                       obj.pressureController.Data(1),... % stpt   (lift or Pa )
                                       obj.pauto);                        % manual (zero or one)
            auto = obj.pressureAuto.Value;
            obj.pstpt = auto*P + ~auto*inputs4; 
            obj.inputs(4) = auto*obj.inputs(4)+~auto*inputs4;
            obj.pauto = auto;
            obj.pressureController.Data(1) = obj.pstpt;
            if auto
                obj.punits.String = 'Pa';
            else
                obj.punits.String = 'lift';
            end
        end
        function temperatureToggle(obj,src,evt)
             [inputs3 obj.tErrors] = PI(obj.temperatureController.Data(2),... % Kc
                                        obj.temperatureController.Data(3),... % tauI
                                        obj.tErrors,...                       % tErrors for accumulation
                                        obj.inputs(3),...                     % Watts, mv
                                        obj.states(5),...                     % Kelvin, cv
                                        obj.temperatureController.Data(1),... % stpt (Watts or Kelvin)
                                        obj.tauto);                          % manual (zero or one)
            auto = obj.temperatureAuto.Value;
            obj.tstpt = auto*obj.states(5) + ~auto*inputs3; 
            obj.inputs(3) = auto*obj.inputs(3)+~auto*inputs3;
            obj.tauto = auto;
            obj.temperatureController.Data(1) = obj.tstpt;
            if auto
                obj.tunits.String = 'Kelvin';
            else
                obj.tunits.String = 'watts';
            end
        end
        function levelToggle(obj,src,evt)
             rho = density(obj,obj.states(4));                   % mol/m3 liq      
             [inputs5 obj.lErrors] = PI(obj.levelController.Data(2),... % Kc
                                        obj.levelController.Data(3),... % tauI
                                        obj.lErrors,...                 % lErrors for accumulation
                                        obj.inputs(5),...               % q L/sec, mv
                                        100*obj.states(3)/rho,...       % percent full, cv
                                        obj.levelController.Data(1),... % stpt (q or percent)
                                        obj.lauto);                    % manual (zero or one)
            auto = obj.levelAuto.Value;
            rho = density(obj,obj.states(4));                   % mol/m3 liq                             
            l = 100.*obj.states(3)./rho;                        % percent full    
            obj.lstpt = auto*l + ~auto*inputs5;
            obj.inputs(5) = auto*obj.inputs(5)+~auto*inputs5;
            obj.lauto = auto;
            obj.levelController.Data(1) = obj.lstpt;
            if auto
                obj.lunits.String = '%';
            else
                obj.lunits.String = 'L/sec';
            end
        end
        function disturbanceControl(obj,src,evt)
            obj.inputs(2) = max(obj.disturbanceController.Data(1),0);
            obj.inputs(6) = max(obj.disturbanceController.Data(2),0);
            obj.inputs(1) = max(obj.disturbanceController.Data(3),0);
        end
        function levelControl(obj,src,evt)
            % enforce saturation in manual mode
            if ~obj.lauto
                obj.levelController.Data(1) = max(obj.levelController.Data(1),sqrt(eps('double')));
                obj.levelController.Data(1) = min(obj.levelController.Data(1),10);
            end
        end
        function pressureControl(obj,src,evt)
            % enforce saturation in manual mode
            if ~obj.pauto
                obj.pressureController.Data(1) = max(obj.pressureController.Data(1),sqrt(eps('double')));
                obj.pressureController.Data(1) = min(obj.pressureController.Data(1),1);
            end
        end
        function temperatureControl(obj,src,evt)
            % enforce saturation in manual mode
            if ~obj.tauto
                obj.temperatureController.Data(1) = max(obj.temperatureController.Data(1),sqrt(eps('double')));
                obj.temperatureController.Data(1) = min(obj.temperatureController.Data(1),1000000);
            end
        end

        function buildPlots(obj)
           % reload the P&ID
            obj.unitImage = axes('Parent',obj.unitFigure,...
                                 'Units','normalized',...
                                 'Position',[0.34 0.3 0.378125 0.616666666666667]);

            image(obj.PandID,'Parent',obj.unitImage);
            set(obj.unitImage,'XColor', get(obj.unitFigure, 'Color'));
            set(obj.unitImage,'YColor', get(obj.unitFigure, 'Color'));   
            set(obj.unitImage,'XTick', []);
            set(obj.unitImage,'YTick', []);   
                            
            % build plot of pressure
            obj.pressureAxes = axes('Parent',obj.unitFigure,...
                                         'Units','normalized',...
                                         'Position',[0.65...
                                                     0.66...
                                                     0.3...
                                                     0.3]);   
            xlabel('seconds','Parent',obj.pressureAxes);
            yyaxis(obj.pressureAxes,'left');
            obj.pressureLeftLine = line(obj.pressureAxes,obj.pressureLeftTimes(  length(obj.pressureLeftTimes) - fliplr(obj.pspan)),obj.pressureLeft(obj.pspan,:));
            ylabel('Pascals','Parent',obj.pressureAxes);
            yyaxis(obj.pressureAxes,'right');
            obj.pressureRightLine = line(obj.pressureAxes,obj.pressureRightTimes( length(obj.pressureLeftTimes) - fliplr(obj.pspan)),obj.pressureRight(obj.pspan));
            ylabel('lift','Parent',obj.pressureAxes);
            set(obj.pressureAxes,'XDir','reverse');
            set(obj.pressureAxes,'lineWidth',2,'FontSize',12);
            set(get(obj.pressureAxes,'Children'),'lineWidth');

            % build plot of temperature
            obj.temperatureAxes = axes('Parent',obj.unitFigure,...
                                         'Units','normalized',...
                                         'Position',[0.05...
                                                     0.08...
                                                     0.3...
                                                     0.3]);    
            xlabel('seconds','Parent',obj.temperatureAxes);
            yyaxis(obj.temperatureAxes,'left');
            obj.temperatureLeftLine = line(obj.temperatureAxes,fliplr(obj.temperatureLeftTimes),obj.temperatureLeft);
            ylabel('Kelvin','Parent',obj.temperatureAxes);
            yyaxis(obj.temperatureAxes,'right');
            obj.temperatureRightLine = line(obj.temperatureAxes,fliplr(obj.temperatureRightTimes),obj.temperatureRight);
            ylabel('Watts','Parent',obj.temperatureAxes);
            set(obj.temperatureAxes,'XDir','reverse');
            set(obj.temperatureAxes,'lineWidth',2,'FontSize',12);
            set(get(obj.temperatureAxes,'Children'),'lineWidth');
            
            % build plot of level
            obj.levelAxes = axes('Parent',obj.unitFigure,...
                                         'Units','normalized',...
                                         'Position',[0.65...
                                                     0.08...
                                                     0.3...
                                                     0.3]);    
            xlabel('seconds','Parent',obj.levelAxes);
            yyaxis(obj.levelAxes,'left');
            obj.levelLeftLine = line(obj.levelAxes,fliplr(obj.levelLeftTimes),obj.levelLeft);
            ylabel('%','Parent',obj.levelAxes);
            yyaxis(obj.levelAxes,'right');
            obj.levelRightLine = line(obj.levelAxes,fliplr(obj.levelRightTimes),obj.levelRight);
            ylabel('L/sec','Parent',obj.levelAxes);
            set(obj.levelAxes,'XDir','reverse');
            set(obj.levelAxes,'lineWidth',2,'FontSize',12);
            set(get(obj.levelAxes,'Children'),'lineWidth');
        end
        function buildFields(obj)
            obj.disturbanceController = uitable('Parent',obj.unitFigure,...
                                                'Units','normalized',...
                                                'Data',[obj.inputs(2)          % F mol/sec
                                                        obj.inputs(6)          % xin mol/mol
                                                        obj.inputs(1)],...     % Tin Kelvin
                                                'ColumnEditable',[true true true],...
                                                'Fontsize',12,...
                                                'Position',[0.2 0.65 0.09375 0.141666666666667],...
                                                'ColumnName',{'disturbance'},...
                                                'RowName',{'q','x','T'},...
                                                'CellEditCallback',@(src,evt)disturbanceControl(obj,src,evt));    
                                            
            uicontrol('Parent',obj.unitFigure,'Style','text',...
                      'Units','normalized',...
                      'Position',[0.2+0.0945 0.65+0.09 50/obj.width 16/obj.height],...
                      'FontSize',12,...
                      'string','mol/s'); 
            uicontrol('Parent',obj.unitFigure,'Style','text',...
                      'Units','normalized',...
                      'Position',[0.2+0.0965 0.65+0.0575 60/obj.width 16/obj.height],...
                      'FontSize',12,...
                      'string','mol/mol'); 
            uicontrol('Parent',obj.unitFigure,'Style','text',...
                      'Units','normalized',...
                      'Position',[0.2+0.095 0.65+0.025 50/obj.width 16/obj.height],...
                      'FontSize',12,...
                      'string','Kelvin');  
                  
            P = pressure(obj,obj.states(5),obj.states(1),obj.states(3),obj.states(4));
            obj.pressureController = uitable('Parent',obj.unitFigure,...
                                             'Units','normalized',...
                                             'Data',[obj.pstpt     % setpoint in manual or auto
                                                     0             % Kc
                                                     36000],...    % tauI
                                             'ColumnEditable',[true true true],...
                                             'Fontsize',12,...
                                             'Position',[0.8 0.44+0.01 0.13 0.141666666666667-0.01],...
                                             'ColumnName',{'          pressure          '},...
                                             'RowName',{'sp','Kc','tauI'},...
                                             'CellEditCallback',@(src,evt)pressureControl(obj,src,evt));
            obj.punits = annotation(obj.unitFigure,'textbox',...
                                                   'Units','normalized',...
                                                   'Position',[0.8+0.13 0.48+0.055 0.0390625 0.025],...
                                                   'FontSize',12,...
                                                   'String','lift',...
                                                   'Interpreter','Tex',...
                                                   'EdgeColor',[240 240 240]./255);    
             obj.pPV = annotation(obj.unitFigure,'textbox',...
                                                 'Units','normalized',...
                                                 'Position',[0.8+0.05 0.43 0.0390625 0.025],...
                                                 'FontSize',12,...
                                                 'String',num2str(P),...
                                                 'Interpreter','Tex',...
                                                 'EdgeColor',[240 240 240]./255); 
            obj.pressureAuto = uicontrol('Parent',obj.unitFigure,...
                                         'Style','checkbox',...
                                         'Units','normalized',...
                                         'Position',[0.8-0.015 0.44+0.122 0.01171875 0.020833333333333],...
                                         'Callback',@(src,evt)pressureToggle(obj,src,evt),...
                                         'Value',obj.pauto);   % start in manual mode
            uicontrol('Parent',obj.unitFigure,'Style','text',...
                      'Units','normalized',...
                      'Position',[0.8+0.01 0.44+0.115 0.02734375 0.020833333333333],...
                      'FontSize',10,...
                      'string','auto?'); 
            uicontrol('Parent',obj.unitFigure,'Style','text',...
                      'Units','normalized',...
                      'Position',[0.8+0.125 0.4225 0.025 0.025],...
                      'FontSize',12,...
                      'string','Pa'); 

            obj.temperatureController = uitable('Parent',obj.unitFigure,...
                                                'Units','normalized',...
                                                'Data',[obj.tstpt          % setpoint in manual or auto
                                                        0                  % Kc
                                                        36000],...         % PV
                                                'ColumnEditable',[true true true],...
                                                'Fontsize',12,...
                                                'Position',[0.05 0.425+0.01 0.13 0.141666666666667-0.01],...
                                                'ColumnName',{'      temperature      '},...
                                                'RowName',{'sp','Kc','tauI'},...
                                                'CellEditCallback',@(src,evt)temperatureControl(obj,src,evt));
            obj.tunits = annotation(obj.unitFigure,'textbox',...
                                                   'Units','normalized',...
                                                   'Position',[0.05+0.125 0.425+0.095 0.0390625 0.025],...
                                                   'FontSize',12,...
                                                   'String','watts',...
                                                   'Interpreter','Tex',...
                                                   'EdgeColor',[240 240 240]./255); 
             obj.tPV = annotation(obj.unitFigure,'textbox',...
                                                 'Units','normalized',...
                                                 'Position',[0.05+0.07 0.42 0.0390625 0.025],...
                                                 'FontSize',12,...
                                                 'String',num2str(obj.states(5)),...
                                                 'Interpreter','Tex',...
                                                 'EdgeColor',[240 240 240]./255); 
            obj.temperatureAuto = uicontrol('Parent',obj.unitFigure,...
                                            'Style','checkbox',...
                                            'Units','normalized',...
                                            'Position',[0.05-0.015 0.425+.122 0.01171875 0.020833333333333],...
                                            'Callback',@(src,evt)temperatureToggle(obj,src,evt),...
                                            'Value',obj.tauto);   % start in manual mode
            uicontrol('Parent',obj.unitFigure,'Style','text',...
                      'Units','normalized',...
                      'Position',[0.05+0.01 0.425+0.115 0.02734375 0.020833333333333],...
                      'FontSize',10,...
                      'string','auto?');
            uicontrol('Parent',obj.unitFigure,'Style','text',...
                      'Units','normalized',...
                      'Position',[0.05+0.13 0.41 0.0390625 0.025],...
                      'FontSize',12,...
                      'string','Kelvin'); 
                                             
            rho = density(obj,obj.states(4));                   % mol/m3 liq   
            l = 100.*obj.states(3)./rho;                        % percent full                    
            obj.levelController = uitable('Parent',obj.unitFigure,...
                                          'Units','normalized',...
                                          'Data',[obj.lstpt     % setpoint in manual or auto
                                                  0             % Kc
                                                  36000],...     % tauI
                                          'ColumnEditable',[true true true],...
                                          'Fontsize',12,...
                                          'Position',[0.45 0.08+0.01 0.135 0.141666666666667-0.01],...
                                          'ColumnName',{'             level             '},...
                                          'RowName',{'sp','Kc','tauI'},...
                                          'CellEditCallback',@(src,evt)levelControl(obj,src,evt));
            obj.lunits = annotation(obj.unitFigure,'textbox',...
                                                   'Units','normalized',...
                                                   'Position',[0.45+0.135 0.08+0.095 0.0390625 0.025],...
                                                   'FontSize',12,...
                                                   'String','L/sec',...
                                                   'Interpreter','Tex',...
                                                   'EdgeColor',[240 240 240]./255);       
             obj.lPV = annotation(obj.unitFigure,'textbox',...
                                                 'Units','normalized',...
                                                 'Position',[0.45+0.07 0.07 0.0390625 0.025],...
                                                 'FontSize',12,...
                                                 'String',num2str(l),...
                                                 'Interpreter','Tex',...
                                                 'EdgeColor',[240 240 240]./255); 
            obj.levelAuto = uicontrol('Parent',obj.unitFigure,...
                                      'Style','checkbox',...
                                      'Units','normalized',...
                                      'Position',[0.45-0.015 0.08+.122 0.01171875 0.020833333333333],...
                                      'Callback',@(src,evt)levelToggle(obj,src,evt),...
                                      'Value',obj.lauto);   % start in manual mode                  
            uicontrol('Parent',obj.unitFigure,'Style','text',...
                      'Units','normalized',...
                      'Position',[0.45+0.01 0.08+0.115 0.02734375 0.020833333333333],...
                      'FontSize',10,...
                      'string','auto?'); 
            uicontrol('Parent',obj.unitFigure,'Style','text',...
                      'Units','normalized',...
                      'Position',[0.45+0.13 0.06 0.0390625 0.025],...
                      'FontSize',12,...
                      'string','% full'); 
            obj.saveSnap = uicontrol('Parent',obj.unitFigure,...
                                      'Style','pushbutton',...
                                      'Units','normalized',...
                                      'Position',[0.05 0.9 0.1 0.05],...
                                      'Callback',@(src,evt)snappy(obj,src,evt),...
                                      'String','Save Snapshot',...
                                      'FontSize',12);   % start in manual mode   
        end
        function snappy(obj,src,evt)
            PaCV = flipud(obj.pressureLeft(:,1));
            PaSP = flipud(obj.pressureLeft(:,2));
            PaMV = flipud(obj.pressureRight);
            KeCV = flipud(obj.temperatureLeft(:,1));
            KeSP = flipud(obj.temperatureLeft(:,2));
            KeMV = flipud(obj.temperatureRight);            
            LeCV = flipud(obj.levelLeft(:,1));
            LeSP = flipud(obj.levelLeft(:,2));
            LeMV = flipud(obj.levelRight);   
            Feed = flipud(obj.disturbances(:,1));
            Comp = flipud(obj.disturbances(:,2));
            Temp = flipud(obj.disturbances(:,3));
            sec  = flipud(obj.times);
            T = table(sec,PaCV,PaSP,PaMV,...
                          KeCV,KeSP,KeMV,...
                          LeCV,LeSP,LeMV,...
                          Feed,Comp,Temp);
            writetable(T,'snapshot.xls');
        end
        % obj.states(1) = Mv = x(1)
        % obj.states(2) = y = x(2)
        % obj.states(3) = Ml = x(3)
        % obj.states(4) = x = x(4)
        % obj.states(5) = T = x(5)
        % inputs(1) = Tin
        % inputs(2) = F
        % inputs(3) = Q
        % inputs(4) = l, lift
        % inputs(5) = q, L/sec
        % inputs(6) = xin
        % (obj,0,obj.states, [inputs]) :::: t is not used
        function dx = flash(obj,t,x,inputs)
            x(1) = max(x(1),0);
            x(2) = min(max(x(2),0),1);
            x(3) = max(x(3),0);
            x(4) = min(max(x(4),0),1);
            x(5) = max(x(5),0);
            inputs(4) = valve(obj,inputs(4));
            L = inputs(5)*density(obj,x(4))/1000;
            Cp = 190;
            heat1 = 43290;
            heat2 = 51000;
            N1 = flux1(obj,x(2),x(4),x(3),pSat1(obj,x(5)),pressure(obj,x(5),x(1),x(3),x(4)));
            N2 = flux2(obj,x(2),x(4),x(3),pSat2(obj,x(5)),pressure(obj,x(5),x(1),x(3),x(4)));
            dx = [1 0 0 0 0 
                  0 1/x(1) 0 0 0 
                  0 0 1 0 0 
                  0 0 0 1/x(3) 0 
                  0 0 0 0 1/(Cp*(x(1)+x(3))) 
                  ]*...
                    [ (N1+N2)-inputs(4)
                       N1-x(2)*(N1+N2)
                       inputs(2)-(N1+N2)-L
                       inputs(2)*(inputs(6)-x(4))-N1+x(4)*(N1+N2)
                       Cp*inputs(2)*( inputs(1) - x(5) )+inputs(3)-heat1*N1-heat2*N2
                    ];
            dx = ((x+dx) >= 0).*dx - ((x+dx) < 0).*x;
            dx(2) = ((x(2)+dx(2)) <= 1).*dx(2) + ((x(2)+dx(2)) >= 1).*(1-x(2));
            dx(4) = ((x(4)+dx(4)) <= 1).*dx(4) + ((x(4)+dx(4)) >= 1).*(1-x(2));
        end
        function P = pressure(obj,T,Mv,Ml,x)
            vol = 1;
            R = 8.314;
            P = Mv*R*T/(vol-Ml/density(obj,x));
        end
        function Psat1 = pSat1(obj,T)
            A1 = 4.39031; % unitless
            B1 = 1254.502; % K
            C1 = -105.246;
            Psat1 = 101325*10.^( A1 - B1./(T+C1) );
        end
        function Psat2 = pSat2(obj,T)
            A2 = 4.34541; % unitless
            B2 = 1661.858; % K
            C2 = -74.048;
            Psat2 = 101325*10.^( A2 - B2./(T+C2) );
        end
        function N1 = flux1(obj,y,x,Ml,Psat,P)
            K1 = 10; % mol/(sec*m^2)
            A  = 5; % m^2/m^3
            N1 = x*K1*A*( Psat*x/P - y )*Ml/density(obj,x);
        end
        function N2 = flux2(obj,y,x,Ml,Psat,P)
            K2 = 6; % mol/(sec*m^2)
            A  = 5; % m^2/m^3
            N2 = (1-x)*K2*A*( Psat*(1-x)/P - (1-y) )*Ml/density(obj,x);
        end
        function rho = density(obj,x)
            rhol = 10927; % mol/m^3
            rho2 = 11560;
            rho = x*rhol + rho2*(1-x);
        end
        % call with obj, obj.inputs(4), obj.states
        function V = valve(obj,l)
            V = 0.058834841*l*sqrt(pressure(obj,obj.states(5),obj.states(1),obj.states(3),obj.states(4))-10000);
        end
    end
end