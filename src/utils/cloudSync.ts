/**
 * Cloud Time Capsule Synchronization Service
 * 
 * Supports seamless saving and loading of baby growth profiles
 * to Vercel KV / Upstash Redis, enabling full cloud sharing of
 * photos, milestones, and letters across different devices.
 */

export interface BabyCapsuleData {
  name: string;
  dob: string;
  quote: string;
  avatarUrl: string;
  theme: string;
  photos?: any[];
  letters?: any[];
  updatedAt?: string;
}

export const cloudSync = {
  /**
   * Save complete capsule data to Vercel KV via /api/capsule
   */
  async saveToCloud(data: BabyCapsuleData, preferredId?: string): Promise<{ id: string; url: string }> {
    try {
      const response = await fetch('/api/capsule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: preferredId,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error(`Cloud save failed with status ${response.status}`);
      }

      const res = await response.json();
      if (!res.success || !res.id) {
        throw new Error(res.error || 'Failed to save to cloud storage');
      }

      const fullUrl = new URL(window.location.href);
      fullUrl.search = `?id=${encodeURIComponent(res.id)}`;

      // Save the active capsule ID to local storage for quick subsequent updates
      localStorage.setItem('timeflies_cloud_capsule_id', res.id);

      return {
        id: res.id,
        url: fullUrl.toString(),
      };
    } catch (err) {
      console.warn('Cloud sync error (fallback to local only):', err);
      throw err;
    }
  },

  /**
   * Load capsule data from Vercel KV by id
   */
  async loadFromCloud(capsuleId: string): Promise<BabyCapsuleData | null> {
    if (!capsuleId) return null;

    try {
      const response = await fetch(`/api/capsule?id=${encodeURIComponent(capsuleId)}`);
      if (!response.ok) return null;

      const res = await response.json();
      if (res.success && res.data) {
        return res.data as BabyCapsuleData;
      }
      return null;
    } catch (err) {
      console.warn('Failed to load from cloud storage:', err);
      return null;
    }
  },
};
