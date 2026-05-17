export interface UserProfile {
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  id_card_number: string;
  license_card_number: string | null;
  bank_account: string | null;
  created_at: string;
}

export interface CarModel {
  model_id: string;
  brand: string;
  model_name: string;
  transmission: 'manual' | 'automatic';
  capacity: number;
  base_daily_price: number;
}

export interface FleetCar {
  car_id: string;
  model_id: string;
  user_id: string;
  license_plate: string;
  color: string;
  status: 'available' | 'rented' | 'maintenance' | 'withdrawn';
  image_url: string | null;
  gps_device_id: string | null;
  car_models?: CarModel;
}

export interface RentalDetail {
  rental_detail_id: string;
  transaction_id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  actual_return_date: string | null;
  price_per_day_at_booking: number;
  fleet_cars?: FleetCar & { car_models: CarModel };
}

export interface RentalTransaction {
  transaction_id: string;
  user_id: string;
  booking_date: string;
  total_amount: number;
  transaction_status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  rental_details?: RentalDetail[];
}