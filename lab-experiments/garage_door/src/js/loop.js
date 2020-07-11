function MainLoop(args) {
  this.runAfterInitialization = typeof(args.runAfterInitialization) === "boolean" ? args.runAfterInitialization : false;
  this.isRunning = false;
  this.frameCount = 0;
  this.fps = typeof(args.fps) === "number" ? args.fps : 10;
  this.interval = 1000 / this.fps;
  this.timeOfLastFrame = Date.now();
  this.timeNow = Date.now();
  this.timeElapsed = 0;

  this.loop = () => {
    console.log(this.frameCount);




















    





  }

  this.fpsControl = () => {
    this.interval = 1000 / this.fps;
    if(this.isRunning) {
      window.requestAnimationFrame(this.fpsControl) 
    } else {
      window.cancelAnimationFrame(this.fpsControl)
    }
    this.timeNow = Date.now();
    this.timeElapsed = this.timeNow - this.timeOfLastFrame;
    if(this.timeElapsed > this.interval) {
      this.timeOfLastFrame = this.timeNow - ( this.timeElapsed % this.interval );
      this.loop();
      this.frameCount++;
    }
  }

  this.startLoop = () => {
    if(this.isRunning) { return }
    this.isRunning = true;
    this.fpsControl();
  }

  this.stopLoop = () => {
    if(!this.isRunning) { return }
    this.isRunning = false;
    this.frameCount = 0;
  }

  if(this.runAfterInitialization) {this.startLoop()}
}

module.exports = MainLoop;