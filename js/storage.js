// Pengelola Progres Eksplorasi Kenangan (LocalStorage Persistence)

const STORAGE_KEY = "udy_birthday_progress_v2";

class StorageManager {
  constructor() {
    this.data = this.load();
  }

  getDefaults() {
    return {
      visitedLocations: [],       // Array id lokasi yang sudah dikunjungi [1..5]
      candlesBlown: false,        // Lilin kue ditiup
      introWatched: false,        // Sudah melewati cinematic intro
      secretUnlocked: false,      // Area rahasia terbuka
      firstPlayedAt: new Date().toISOString()
    };
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...this.getDefaults(), ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn("Gagal memuat dari localStorage", e);
    }
    return this.getDefaults();
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Gagal menyimpan ke localStorage", e);
    }
  }

  isLocationVisited(id) {
    return this.data.visitedLocations.includes(id);
  }

  markLocationVisited(id) {
    if (!this.data.visitedLocations.includes(id)) {
      this.data.visitedLocations.push(id);
      if (this.data.visitedLocations.length >= 5) {
        this.data.secretUnlocked = true;
      }
      this.save();
      return true; // Lokasi baru pertama kali dibuka!
    }
    return false;
  }

  getVisitedCount() {
    return this.data.visitedLocations.length;
  }

  isSecretUnlocked() {
    return this.data.visitedLocations.length >= 5 || this.data.secretUnlocked;
  }

  markCandlesBlown() {
    this.data.candlesBlown = true;
    this.save();
  }

  markIntroWatched() {
    this.data.introWatched = true;
    this.save();
  }

  resetProgress() {
    this.data = this.getDefaults();
    this.save();
  }
}

export const storage = new StorageManager();
