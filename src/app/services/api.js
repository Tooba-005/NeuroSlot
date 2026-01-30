// Mock Backend API Service using In-Memory Data Structures
// This simulates a Node.js + Express backend using DSA concepts

// Data Structures
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  getAll() {
    return [...this.items];
  }
}

class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  getAll() {
    return [...this.items];
  }
}

// Initialize data structures
const requestQueue = new Queue();
const allocationStack = new Stack();

// Zones (Array-based structure)
const zones = [
  { id: 'A', name: 'Zone A', slots: Array(10).fill(null).map((_, i) => ({ id: i + 1, status: 'available', vehicleId: null })) },
  { id: 'B', name: 'Zone B', slots: Array(10).fill(null).map((_, i) => ({ id: i + 1, status: 'available', vehicleId: null })) },
  { id: 'C', name: 'Zone C', slots: Array(10).fill(null).map((_, i) => ({ id: i + 1, status: 'available', vehicleId: null })) },
];

// API Functions
export const api = {
  // Initialize zones in localStorage
  initializeZones() {
    if (!localStorage.getItem('zones')) {
      localStorage.setItem('zones', JSON.stringify(zones));
    }
  },

  // Get all zones
  getZones() {
    return JSON.parse(localStorage.getItem('zones') || JSON.stringify(zones));
  },

  // Get zone by ID
  getZone(zoneId) {
    const zones = this.getZones();
    return zones.find(z => z.id === zoneId);
  },

  // Update zones
  updateZones(newZones) {
    localStorage.setItem('zones', JSON.stringify(newZones));
  },

  // Process parking requests (Queue-based FIFO)
  processRequests() {
    const requests = JSON.parse(localStorage.getItem('parkingRequests') || '[]');
    const zones = this.getZones();
    
    // Find all requested items
    const requestedItems = requests.filter(r => r.status === 'REQUESTED');
    
    // Process each request
    let updated = false;
    requestedItems.forEach(request => {
      // Try to allocate to preferred zone first
      let zone = zones.find(z => z.id === request.preferredZone);
      let availableSlot = zone?.slots.find(s => s.status === 'available');
      
      if (availableSlot) {
        // Allocate to preferred zone
        availableSlot.status = 'occupied';
        availableSlot.vehicleId = request.vehicleId;
        request.status = 'ALLOCATED';
        request.zoneId = zone.id;
        request.slotId = availableSlot.id;
        request.penalty = false;
        allocationStack.push({ ...request });
        updated = true;
      } else {
        // Try other zones (penalty)
        for (let z of zones) {
          if (z.id !== request.preferredZone) {
            availableSlot = z.slots.find(s => s.status === 'available');
            if (availableSlot) {
              availableSlot.status = 'occupied';
              availableSlot.vehicleId = request.vehicleId;
              request.status = 'ALLOCATED';
              request.zoneId = z.id;
              request.slotId = availableSlot.id;
              request.penalty = true;
              allocationStack.push({ ...request });
              updated = true;
              break;
            }
          }
        }
      }
    });

    if (updated) {
      this.updateZones(zones);
      localStorage.setItem('parkingRequests', JSON.stringify(requests));
    }

    return updated;
  },

  // Rollback last K allocations (Stack-based LIFO)
  rollbackAllocations(k) {
    const requests = JSON.parse(localStorage.getItem('parkingRequests') || '[]');
    const zones = this.getZones();
    let rolledBack = 0;

    // Get last k allocated requests
    const allocatedRequests = requests
      .filter(r => r.status === 'ALLOCATED' || r.status === 'OCCUPIED')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, k);

    allocatedRequests.forEach(request => {
      // Find and free the slot
      const zone = zones.find(z => z.id === request.zoneId);
      if (zone) {
        const slot = zone.slots.find(s => s.id === request.slotId);
        if (slot) {
          slot.status = 'available';
          slot.vehicleId = null;
          request.status = 'CANCELLED';
          request.zoneId = null;
          request.slotId = null;
          rolledBack++;
        }
      }
    });

    if (rolledBack > 0) {
      this.updateZones(zones);
      localStorage.setItem('parkingRequests', JSON.stringify(requests));
    }

    return rolledBack;
  },

  // Get analytics data
  getAnalytics() {
    const requests = JSON.parse(localStorage.getItem('parkingRequests') || '[]');
    const zones = this.getZones();

    const zoneUtilization = zones.map(zone => ({
      zoneId: zone.id,
      totalSlots: zone.slots.length,
      occupiedSlots: zone.slots.filter(s => s.status === 'occupied').length,
      utilization: ((zone.slots.filter(s => s.status === 'occupied').length / zone.slots.length) * 100).toFixed(1)
    }));

    const statusCounts = {
      requested: requests.filter(r => r.status === 'REQUESTED').length,
      allocated: requests.filter(r => r.status === 'ALLOCATED').length,
      occupied: requests.filter(r => r.status === 'OCCUPIED').length,
      cancelled: requests.filter(r => r.status === 'CANCELLED').length,
    };

    const peakZone = zoneUtilization.reduce((max, zone) => 
      parseFloat(zone.utilization) > parseFloat(max.utilization) ? zone : max
    , zoneUtilization[0]);

    return {
      zoneUtilization,
      statusCounts,
      peakZone,
      totalRequests: requests.length,
      totalSlots: zones.reduce((sum, z) => sum + z.slots.length, 0),
      occupiedSlots: zones.reduce((sum, z) => sum + z.slots.filter(s => s.status === 'occupied').length, 0),
    };
  },

  // Get dashboard stats
  getDashboardStats() {
    const zones = this.getZones();
    const requests = JSON.parse(localStorage.getItem('parkingRequests') || '[]');

    return {
      totalZones: zones.length,
      totalSlots: zones.reduce((sum, z) => sum + z.slots.length, 0),
      occupiedSlots: zones.reduce((sum, z) => sum + z.slots.filter(s => s.status === 'occupied').length, 0),
      pendingRequests: requests.filter(r => r.status === 'REQUESTED').length,
    };
  }
};

// Initialize zones on load
api.initializeZones();

export default api;
