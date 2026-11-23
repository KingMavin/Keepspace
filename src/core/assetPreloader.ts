type NetworkInfo = {
  saveData?: boolean;
  effectiveType?: string;
};

class AssetPreloader {
  private cached = new Set<string>();
  private queue: string[] = [];
  private isProcessing = false;

  private isConstrainedNetwork(): boolean {
    const nav = navigator as Navigator & { connection?: NetworkInfo };
    const conn = nav?.connection;
    if (!conn) return false;
    return Boolean(conn.saveData) || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g';
  }

  private decodeImage(url: string, timeoutMs = 1500): Promise<void> {
    if (!url || this.cached.has(url)) return Promise.resolve();
    return new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        this.cached.add(url);
        resolve();
      };

      const img = new Image();
      const timer = window.setTimeout(done, timeoutMs);
      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().catch(() => undefined).finally(() => {
            window.clearTimeout(timer);
            done();
          });
        } else {
          window.clearTimeout(timer);
          done();
        }
      };
      img.onerror = () => {
        window.clearTimeout(timer);
        done();
      };
      img.src = url;
    });
  }

  /**
   * Tier 1: Blocks Splash briefly while editorial fonts and Home screen critical photos load.
   */
  async preloadHomeCriticalAssets(
    homeImageUrls: Array<string | undefined>,
    onProgress: (pct: number, statusLabel: string) => void
  ): Promise<void> {
    const cleanUrls = Array.from(new Set(homeImageUrls.filter((u): u is string => Boolean(u))));
    const totalSteps = cleanUrls.length + 1;
    let completed = 0;

    const bump = (label: string) => {
      completed += 1;
      const pct = Math.min(100, Math.round((completed / totalSteps) * 100));
      onProgress(pct, label);
    };

    onProgress(12, 'Loading editorial fonts\u2026');

    const hardCap = new Promise<void>((resolve) => window.setTimeout(resolve, 2400));

    const loadTask = (async () => {
      try {
        if (document.fonts?.ready) {
          await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]);
        }
      } catch {
        // ignore font API issues
      }
      bump('Preparing Home keepsakes\u2026');

      for (const url of cleanUrls) {
        await this.decodeImage(url, 1200);
        bump('Warming Home screen\u2026');
      }
    })();

    await Promise.race([loadTask, hardCap]);
    onProgress(100, 'Ready');
  }

  /**
   * Tier 2: Moves the user's current screen assets to the very front of the queue.
   */
  prioritizeScreen(_screenId: string, urls: Array<string | undefined>): void {
    const clean = urls.filter((u): u is string => Boolean(u) && !this.cached.has(u!));
    if (!clean.length) return;

    for (let i = clean.length - 1; i >= 0; i--) {
      const url = clean[i];
      const idx = this.queue.indexOf(url);
      if (idx !== -1) this.queue.splice(idx, 1);
      this.queue.unshift(url);
    }

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Tier 3: Loads remaining screen assets quietly in idle slices once the network is clear.
   */
  startBackgroundPreload(allUrls: Array<string | undefined>): void {
    const clean = allUrls.filter((u): u is string => Boolean(u) && !this.cached.has(u!));
    for (const url of clean) {
      if (!this.queue.includes(url)) {
        this.queue.push(url);
      }
    }
    if (!this.isProcessing && this.queue.length > 0) {
      this.processQueue();
    }
  }

  private scheduleNext(fn: () => void): void {
    const delay = this.isConstrainedNetwork() ? 900 : 120;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof win.requestIdleCallback === 'function' && !this.isConstrainedNetwork()) {
      win.requestIdleCallback(fn, { timeout: 1200 });
    } else {
      window.setTimeout(fn, delay);
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const step = async () => {
      const nextUrl = this.queue.shift();
      if (!nextUrl) {
        this.isProcessing = false;
        return;
      }
      if (!this.cached.has(nextUrl)) {
        // Light delay on constrained networks keeps active interactions smooth
        await this.decodeImage(nextUrl, this.isConstrainedNetwork() ? 700 : 1500);
      }
      if (this.queue.length > 0) {
        this.scheduleNext(() => {
          void step();
        });
      } else {
        this.isProcessing = false;
      }
    };

    this.scheduleNext(() => {
      void step();
    });
  }
}

export const assetPreloader = new AssetPreloader();
