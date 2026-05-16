export const mockFleets = [
  { id: '1', model: 'Toyota Avanza', plate: 'B 1234 XYZ', color: 'Black', status: 'rented' as const, gps_device_id: 'GPS-001' },
  { id: '2', model: 'Honda Brio', plate: 'B 5678 ABC', color: 'Yellow', status: 'available' as const, gps_device_id: 'GPS-002' },
  { id: '3', model: 'Mitsubishi Xpander', plate: 'D 9101 DEF', color: 'White', status: 'maintenance' as const, gps_device_id: 'GPS-003' },
  { id: '4', model: 'Suzuki Ertiga', plate: 'F 1122 GHI', color: 'Silver', status: 'withdrawn' as const, gps_device_id: 'GPS-004' },
];

export const mockMaintenance = [
  { id: 'm1', car: 'Mitsubishi Xpander (D 9101 DEF)', startDate: '2025-05-14', issue: 'Brake pad replacement', cost: 450000, status: 'in_progress' as const },
  { id: 'm2', car: 'Toyota Avanza (B 1234 XYZ)', startDate: '2025-04-10', issue: 'Regular Oil Change', cost: 350000, status: 'completed' as const },
];

export const mockFinances = [
  { id: 'f1', date: '2025-05-15', type: 'Rental Revenue', car: 'Toyota Avanza', amount: 900000, status: 'success' as const },
  { id: 'f2', date: '2025-05-14', type: 'Late Penalty', car: 'Honda Brio', amount: 50000, status: 'success' as const },
  { id: 'f3', date: '2025-05-10', type: 'Rental Revenue', car: 'Mitsubishi Xpander', amount: 1200000, status: 'success' as const },
];
