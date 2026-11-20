// LocalStorage Manager untuk Progres & State Game
const STORAGE_KEY = "ultah_udy_progress_v1";

const defaultState = {
  birthdayIntroWatched: false,
  candlesBlown: false,
  locationsUnlocked: [], // id array [1, 2, 3, 4, 5]
  journalEntries: [],
  secretUnlocked: false,
  musicUnlocked: false,
  soundMuted: false
};

class StorageManager {
  constructor() {
    this.state = this.load();
  }

  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return { ...defaultState, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn("Could not read localStorage:", e);
    }
    return { ...defaultState };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Could not write localStorage:", e);
    }
  }

  isIntroWatched() {
    return this.state.birthdayIntroWatched;
  }

  setIntroWatched(val = true) {
    this.state.birthdayIntroWatched = val;
    this.save();
  }

  isCandlesBlown() {
    return this.state.candlesBlown;
  }

  setCandlesBlown(val = true) {
    this.state.candlesBlown = val;
    this.save();
  }

  isLocationUnlocked(id) {
    return this.state.locationsUnlocked.includes(id);
  }

  unlockLocation(id) {
    if (!this.state.locationsUnlocked.includes(id)) {
      this.state.locationsUnlocked.push(id);
      if (this.state.locationsUnlocked.length >= 5) {
        this.state.secretUnlocked = true;
      }
      this.save();
      return true; // newly unlocked
    }
    return false;
  }

  getUnlockedLocations() {
    return this.state.locationsUnlocked;
  }

  isSecretUnlocked() {
    return this.state.secretUnlocked || this.state.locationsUnlocked.length >= 5;
  }

  setSecretUnlocked(val = true) {
    this.state.secretUnlocked = val;
    this.save();
  }

  isMuted() {
    return this.state.soundMuted;
  }

  setMuted(val) {
    this.state.soundMuted = val;
    this.save();
  }

  resetAll() {
    this.state = { ...defaultState };
    this.save();
  }
}

export const storage = new StorageManager();
