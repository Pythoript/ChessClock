class Timer {
 constructor() {
    this.isRunning = false;
    this.overallTime = this.startTime = 0;
 }

 _getTimeElapsedSinceLastStart() {
    return this.startTime ? performance.now() - this.startTime : 0;
 }

 start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startTime = performance.now();
    }
 }

 stop() {
    if (this.isRunning) {
      this.isRunning = false;
      this.overallTime += this._getTimeElapsedSinceLastStart();
    }
 }

 reset() {
    this.overallTime = 0;
    this.startTime = this.isRunning ? performance.now() : 0;
 }

 getTime() {
    return this.startTime ? (this.isRunning ? this.overallTime + this._getTimeElapsedSinceLastStart() : this.overallTime) : 0;
 }
  
 addTime(timeToAdd) {
    if (typeof timeToAdd === 'number') {
      this.overallTime += timeToAdd;
    }
 }

 subtractTime(timeToSubtract) {
    if (typeof timeToSubtract === 'number') {
      this.overallTime -= timeToSubtract;
    }
 }
}
