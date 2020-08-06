const Separator = require("./shared_separator");

class ManualSeparator extends Separator {
  constructor() {
    super();
  }

  advance() {
    this.advance_proto();
    this.truncateArrays();
    this.updateDOM();
    if(this.emergency) {this.drain(this.level)}
  }

  PI(args) {
    const Kc = args.Kc;
    const TauI = args.TauI;
    const bias = args.Bias;
    const pv = args.ProcessVal;
    const stpt = args.SetPoint;
    let errs = args.AccumErr;
    const auto = args.Auto;
    let mv = args.MV;
    let dmv = 0;

    const err = stpt - pv;
    errs = errs + err;

    if (!auto) {
      mv = stpt;
      errs = 0;
    }

    mv = Math.max(Number.MIN_VALUE, mv);
    return [mv, errs];
  }

}

function separator() {
  return new ManualSeparator();
}

module.exports = separator;