class WakeLock {
  private wakeLock: WakeLockSentinel | null;

  constructor(wakeLock: WakeLockSentinel | null) {
    this.wakeLock = wakeLock;
  }

  public disableScreenLock = async () => {
    this.wakeLock = await navigator.wakeLock.request("screen");
    console.log("wakelock request was sent.");
  }

  public enableScreenLock = () => {
    this.wakeLock?.release();
    console.log("wakelock was released.");
  }
}

export default WakeLock;
