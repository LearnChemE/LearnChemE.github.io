% mv is the last mv
% Kc is the PI controller gain
% tauI is the PI controller integral time
% errors is the accumulated integral error
function [mv errors] = PI(Kc,tauI,errors,mv,cv,stpt,auto)
    if auto
       err   = stpt - cv;
       errors = errors + err;
       dmv    = Kc*(err + errors/tauI);
       mv = mv + dmv;                   % mv is held fixed by simulation
    else
        mv     = stpt;      % fully manual mode
        errors = 0 ;        % reset the integral error
    end
    mv = max(mv,sqrt(eps('double'))); % for numerics disallow mv = 0
end