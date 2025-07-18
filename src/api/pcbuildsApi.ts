// pcbuildsApi.ts

import type { PCBuild } from "@/components/admin/PCBuilderPage";

const STORAGE_KEY = "pcbuilds";

const mockBuilds: PCBuild[] = [
  {
    id: 1,
    name: 'Сборка для игр 2024',
    description: 'Отличная сборка для современных игр',
    components: [
      { type: 'cpu', component: { id: 1, name: 'Intel Core i5-13600K', price: 25000 } },
      { type: 'gpu', component: { id: 4, name: 'RTX 4070', price: 55000 } },
      { type: 'ram', component: { id: 7, name: 'Corsair 16GB DDR4-3200', price: 6000 } },
      { type: 'motherboard', component: { id: 10, name: 'ASUS Z790-P', price: 18000 } },
      { type: 'storage', component: { id: 19, name: 'Samsung 980 Pro 1TB NVMe', price: 8000 } },
      { type: 'psu', component: { id: 13, name: 'Corsair RM750x', price: 12000 } },
      { type: 'cooler', component: { id: 22, name: 'Noctua NH-D15', price: 7000 } },
      { type: 'case', component: { id: 16, name: 'Fractal Design Define 7', price: 15000 } }
    ],
    totalPrice: 146000,
    markup: 15,
    markupType: 'percentage',
    finalPrice: 167900,
    profit: 21900,
    createdAt: '2024-01-10',
    status: 'published',
    isCompatible: true
  },
  {
    id: 2,
    name: 'Бюджетная сборка',
    description: 'Сборка для работы и учебы',
    components: [
      { type: 'cpu', component: { id: 2, name: 'AMD Ryzen 5 7600X', price: 23000 } },
      { type: 'gpu', component: { id: 5, name: 'RTX 4060', price: 35000 } },
      { type: 'ram', component: { id: 8, name: 'G.Skill 32GB DDR5-5600', price: 15000 } },
      { type: 'motherboard', component: { id: 11, name: 'MSI B650M Pro', price: 12000 } },
      { type: 'storage', component: { id: 20, name: 'Kingston NV2 500GB', price: 4000 } },
      { type: 'psu', component: { id: 14, name: 'EVGA 650W Gold', price: 8000 } },
      { type: 'cooler', component: { id: 23, name: 'be quiet! Pure Rock 2', price: 3500 } },
      { type: 'case', component: { id: 17, name: 'NZXT H7 Flow', price: 12000 } }
    ],
    totalPrice: 112500,
    markup: 10000,
    markupType: 'fixed',
    finalPrice: 122500,
    profit: 10000,
    createdAt: '2024-01-05',
    status: 'published',
    isCompatible: true
  }
];

function getPCBuilds(): PCBuild[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return mockBuilds;
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBuilds));
    return mockBuilds;
  }
}

function setPCBuilds(builds: PCBuild[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
}

function addPCBuild(build: Omit<PCBuild, "id">): PCBuild {
  const builds = getPCBuilds();
  const newBuild: PCBuild = {
    ...build,
    id: builds.length > 0 ? Math.max(...builds.map(b => b.id)) + 1 : 1,
  };
  const updated = [...builds, newBuild];
  setPCBuilds(updated);
  return newBuild;
}

function updatePCBuild(id: number, updates: Partial<PCBuild>): PCBuild | null {
  const builds = getPCBuilds();
  const idx = builds.findIndex(b => b.id === id);
  if (idx === -1) return null;
  const updatedBuild = { ...builds[idx], ...updates };
  builds[idx] = updatedBuild;
  setPCBuilds(builds);
  return updatedBuild;
}

function deletePCBuild(id: number) {
  const builds = getPCBuilds();
  const updated = builds.filter(b => b.id !== id);
  setPCBuilds(updated);
}

export { getPCBuilds, setPCBuilds, addPCBuild, updatePCBuild, deletePCBuild }; 