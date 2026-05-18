--
-- PostgreSQL database dump
--

\restrict hccp4oeTGcWmjO6fu7yixGjdfbVD9js1p1yaOiadhzfzFEI9y2CgHXYr8bwLxfW

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

-- Started on 2026-05-18 07:49:55

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 33 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3832 (class 0 OID 0)
-- Dependencies: 33
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 1134 (class 1247 OID 17552)
-- Name: car_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.car_status AS ENUM (
    'available',
    'rented',
    'maintenance',
    'withdrawn'
);


ALTER TYPE public.car_status OWNER TO postgres;

--
-- TOC entry 1146 (class 1247 OID 17592)
-- Name: maintenance_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.maintenance_status AS ENUM (
    'scheduled',
    'in progress',
    'completed'
);


ALTER TYPE public.maintenance_status OWNER TO postgres;

--
-- TOC entry 1140 (class 1247 OID 17574)
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'success',
    'failed',
    'refunded'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- TOC entry 1143 (class 1247 OID 17584)
-- Name: penalty_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.penalty_type AS ENUM (
    'late return',
    'damage',
    'others'
);


ALTER TYPE public.penalty_type OWNER TO postgres;

--
-- TOC entry 1137 (class 1247 OID 17562)
-- Name: transaction_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaction_status AS ENUM (
    'pending',
    'confirmed',
    'active',
    'completed',
    'cancelled'
);


ALTER TYPE public.transaction_status OWNER TO postgres;

--
-- TOC entry 1131 (class 1247 OID 17547)
-- Name: transmission_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transmission_type AS ENUM (
    'manual',
    'automatic'
);


ALTER TYPE public.transmission_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 289 (class 1259 OID 17616)
-- Name: car_models; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.car_models (
    model_id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand character varying(50) NOT NULL,
    model_name character varying(50) NOT NULL,
    transmission public.transmission_type NOT NULL,
    capacity integer NOT NULL,
    base_daily_price numeric(12,2) NOT NULL,
    type character varying(30) DEFAULT 'Standard'::character varying,
    is_keyless boolean DEFAULT false
);


ALTER TABLE public.car_models OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 17726)
-- Name: faqs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faqs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    number_id integer NOT NULL,
    title character varying(255) NOT NULL,
    "desc" character varying(1000) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying
);


ALTER TABLE public.faqs OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 17725)
-- Name: faqs_number_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faqs_number_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faqs_number_id_seq OWNER TO postgres;

--
-- TOC entry 3836 (class 0 OID 0)
-- Dependencies: 296
-- Name: faqs_number_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faqs_number_id_seq OWNED BY public.faqs.number_id;


--
-- TOC entry 290 (class 1259 OID 17624)
-- Name: fleet_cars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fleet_cars (
    car_id uuid DEFAULT gen_random_uuid() NOT NULL,
    model_id uuid NOT NULL,
    user_id uuid NOT NULL,
    license_plate character varying(15) NOT NULL,
    color character varying(30) NOT NULL,
    status public.car_status NOT NULL,
    image_url character varying(500),
    gps_device_id character varying(50),
    location character varying(100) DEFAULT 'Jakarta Raya'::character varying,
    has_insurance boolean DEFAULT true,
    rating numeric(2,1) DEFAULT 4.5,
    reviews integer DEFAULT 24
);


ALTER TABLE public.fleet_cars OWNER TO postgres;

--
-- TOC entry 295 (class 1259 OID 17698)
-- Name: maintenance_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_list (
    maintenance_id uuid DEFAULT gen_random_uuid() NOT NULL,
    car_id uuid NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone,
    cost numeric(12,2) NOT NULL,
    description character varying(1000) NOT NULL,
    status public.maintenance_status NOT NULL
);


ALTER TABLE public.maintenance_list OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 17673)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    transaction_id uuid NOT NULL,
    payment_method character varying(50) NOT NULL,
    amount numeric(12,2) NOT NULL,
    payment_date timestamp with time zone NOT NULL,
    payment_status public.payment_status NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 17684)
-- Name: penalties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.penalties (
    penalty_id uuid DEFAULT gen_random_uuid() NOT NULL,
    rental_detail_id uuid NOT NULL,
    penalty_type public.penalty_type NOT NULL,
    amount numeric(12,2) NOT NULL,
    description character varying(500) NOT NULL,
    is_paid boolean DEFAULT false NOT NULL
);


ALTER TABLE public.penalties OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 17657)
-- Name: rental_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rental_details (
    rental_detail_id uuid DEFAULT gen_random_uuid() NOT NULL,
    transaction_id uuid NOT NULL,
    car_id uuid NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    actual_return_date timestamp with time zone,
    price_per_day_at_booking numeric(12,2) NOT NULL
);


ALTER TABLE public.rental_details OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 17646)
-- Name: rental_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rental_transactions (
    transaction_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    booking_date timestamp with time zone NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    transaction_status public.transaction_status NOT NULL,
    add_ons jsonb
);


ALTER TABLE public.rental_transactions OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 17599)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying(254) NOT NULL,
    password_hash character varying(72) NOT NULL,
    phone_number character varying(20) NOT NULL,
    id_card_number character varying(16) NOT NULL,
    license_card_number character varying(20),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    bank_account character varying(30)
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 3626 (class 2604 OID 17730)
-- Name: faqs number_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs ALTER COLUMN number_id SET DEFAULT nextval('public.faqs_number_id_seq'::regclass);


--
-- TOC entry 3818 (class 0 OID 17616)
-- Dependencies: 289
-- Data for Name: car_models; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.car_models (model_id, brand, model_name, transmission, capacity, base_daily_price, type, is_keyless) FROM stdin;
e2406ed1-213e-43de-bbcb-3e83ef84b042	Toyota	Avanza	manual	7	350000.00	Standard	f
ae7ffbb9-956f-4526-9a4c-15bc1330c9c3	Toyota	Avanza G M/T	manual	7	350000.00	Standard	f
f3cd99bc-eb2c-459f-84f0-a6e67a00894e	Toyota	Veloz Luxury A/T	automatic	7	450000.00	Standard	t
5ed9df7b-59a4-4857-b98a-27fb089fc828	Honda	Brio Satya M/T	manual	5	250000.00	Standard	f
187596aa-a384-4555-a1c2-2434de441186	Suzuki	Ertiga Hybrid A/T	automatic	7	400000.00	Standard	t
44f0e324-5ef9-4eb1-a3c3-5d42c71f6d0d	Honda	HR-V Prestige A/T	automatic	5	650000.00	Standard	t
cc93a8ff-b27c-43cb-b465-d5a61a3a786b	Mitsubishi	Pajero Sport Dakar	automatic	7	950000.00	Standard	t
9de5b7e4-0acd-4920-b8f4-233bbd77b300	Tesla	Model 3 Performance	automatic	5	3200000.00	Electric	t
60eda392-271d-4127-b6be-c597ef8012e6	BYD	Atto 3 Superior	automatic	5	1200000.00	Electric	t
c857a0f1-6b27-458c-af40-4ed31dcaf105	Hyundai	Ioniq 5 Signature	automatic	5	1500000.00	Electric	t
\.


--
-- TOC entry 3826 (class 0 OID 17726)
-- Dependencies: 297
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faqs (id, number_id, title, "desc", status) FROM stdin;
eb6214c1-52bf-4679-ac01-e456adb17c35	1	License?	Borrower is required to get legit driving license to borrow a vehicle	approved
79704322-483b-46d0-aacd-45d1fd55a3fa	2	Security?	System-integrated financial management	approved
\.


--
-- TOC entry 3819 (class 0 OID 17624)
-- Dependencies: 290
-- Data for Name: fleet_cars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fleet_cars (car_id, model_id, user_id, license_plate, color, status, image_url, gps_device_id, location, has_insurance, rating, reviews) FROM stdin;
35aeac1f-3af3-4fe1-b951-5f79da87ec4d	e2406ed1-213e-43de-bbcb-3e83ef84b042	64ec5509-9b5f-4462-8018-044d92401799	RI 1	Silver	rented	https://adgegwhxhwqxskshzcry.supabase.co/storage/v1/object/public/cars/car-1779007909467.png	GPS-ZEN-003	Jakarta Raya	t	4.5	24
15973a50-c4f3-446c-87c5-7ae99f70a18c	f3cd99bc-eb2c-459f-84f0-a6e67a00894e	9b4f8fdc-ac17-48e4-914f-2a5a3c63750e	B 6233 H	White	available	https://adgegwhxhwqxskshzcry.supabase.co/storage/v1/object/public/cars/car-1779059492918.jpg	GPS-TV-001	Jakarta Raya	t	4.5	24
de8f0366-b6be-4a88-a259-46e03f284e7d	e2406ed1-213e-43de-bbcb-3e83ef84b042	64ec5509-9b5f-4462-8018-044d92401799	B 030507 AGY	available	rented	https://adgegwhxhwqxskshzcry.supabase.co/storage/v1/object/public/cars/ciel%20my%20beloved.png	GPS-ZEN-001	Jakarta Raya	t	4.5	24
611ce294-9012-4dfb-b5c1-f34229817d17	187596aa-a384-4555-a1c2-2434de441186	259ac81d-0520-4b4b-b0f9-629b4c9df0c0	B 1234 Z	BLUE	withdrawn	https://adgegwhxhwqxskshzcry.supabase.co/storage/v1/object/public/cars/car-1779036946607.jpg	GPS-ZEN-005	Jakarta Raya	t	4.5	24
0e262909-d978-4e70-bf78-fb81a500166a	e2406ed1-213e-43de-bbcb-3e83ef84b042	64ec5509-9b5f-4462-8018-044d92401799	B 1234 ZEN	available	rented	https://imgcdn.oto.com/large/gallery/color/38/1654/toyota-avanza-color-523617.jpg	GPS-ZEN-002	Jakarta Raya	t	4.5	24
86175370-fd4a-42ab-9514-9965b03b595c	9de5b7e4-0acd-4920-b8f4-233bbd77b300	9b4f8fdc-ac17-48e4-914f-2a5a3c63750e	RI 2 GR	Black	available	https://adgegwhxhwqxskshzcry.supabase.co/storage/v1/object/public/cars/car-1779038260684.jpg	GPS-ZEN-004	Jakarta Raya	t	4.5	24
d6a0dee9-9950-4050-87aa-31aa75aaea8c	c857a0f1-6b27-458c-af40-4ed31dcaf105	9b4f8fdc-ac17-48e4-914f-2a5a3c63750e	F 3433 PZ	Silver	available	https://adgegwhxhwqxskshzcry.supabase.co/storage/v1/object/public/cars/car-1779038437848.webp	GPS-ZEN-006	Jakarta Raya	t	4.5	24
\.


--
-- TOC entry 3824 (class 0 OID 17698)
-- Dependencies: 295
-- Data for Name: maintenance_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance_list (maintenance_id, car_id, start_date, end_date, cost, description, status) FROM stdin;
771327ee-1a29-4da9-8ace-e9bd3253343d	de8f0366-b6be-4a88-a259-46e03f284e7d	2026-05-16 08:48:09.012567+00	2026-05-16 08:51:30.735174+00	450000.00	Ganti oli rutin dan kampas rem	completed
0f745fb5-ec6e-4aa8-a3f3-eb70bea44581	15973a50-c4f3-446c-87c5-7ae99f70a18c	2026-05-17 23:12:42.39153+00	2026-05-17 23:13:12.027103+00	700000.00	AC freon refill	completed
\.


--
-- TOC entry 3822 (class 0 OID 17673)
-- Dependencies: 293
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, transaction_id, payment_method, amount, payment_date, payment_status) FROM stdin;
4e96d9e3-38a0-4d61-8932-989007d5b5af	61ac8d3c-7a01-4fe8-81cb-5a11da7bd87d	QRIS	1050000.00	2026-05-16 07:57:08.404356+00	success
f974823b-b9ac-4ffb-a3ed-dc0b2584e739	c5a6c650-e24f-4415-abdb-05174742e2c0	BCA Virtual Account	700000.00	2026-05-17 03:02:14.375049+00	success
e168b01c-fe26-4e97-9537-7267a9f1be0c	3e6e4840-e716-4444-8729-ca989951ee8e	E-Wallet Digital Gateway	700000.00	2026-05-17 03:56:36.157466+00	success
3ebf8f7c-48d0-49d4-a713-e2e93ec6f1f5	8704b35f-15ef-46ef-be32-bf6870481bd9	Bank Clearing Transfer	350000.00	2026-05-17 04:02:15.026845+00	success
271cbd06-a49c-4d9b-bfba-e9c52890b708	26fd07c9-3d9f-4ee8-8fca-3523839d0aea	E-Wallet Digital Gateway	350000.00	2026-05-17 08:34:19.17976+00	success
7bfa130e-62dd-4c22-8c67-fffa03d8aec6	9420de03-2e90-4d9e-ac09-b112225082cd	Bank Clearing Transfer	350000.00	2026-05-17 11:35:46.270691+00	success
3d86bc88-d13e-43db-9df2-19c80240c012	825f7c19-94aa-4a51-ac5a-e1153715e4cd	Bank Clearing Transfer	350000.00	2026-05-17 11:50:29.308236+00	success
ee0d9f2b-ce0a-4e10-a505-6eb33b87e055	bda661c3-030e-49e6-8e74-8ff7ec18fc72	E-Wallet Digital Gateway	8250000.00	2026-05-17 16:58:59.185508+00	success
a1905727-2e61-4c04-8622-e43d15389287	363552aa-d3bb-48a6-a417-dec27ba56051	E-Wallet Digital Gateway	350000.00	2026-05-17 17:21:29.486259+00	success
\.


--
-- TOC entry 3823 (class 0 OID 17684)
-- Dependencies: 294
-- Data for Name: penalties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.penalties (penalty_id, rental_detail_id, penalty_type, amount, description, is_paid) FROM stdin;
55c1f2ee-31a5-415c-95e1-f414d62332be	22461813-7dd7-4114-9876-c8e315c10eeb	late return	125650000.00	Automated late return penalty for 359 day(s).	f
\.


--
-- TOC entry 3821 (class 0 OID 17657)
-- Dependencies: 292
-- Data for Name: rental_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rental_details (rental_detail_id, transaction_id, car_id, start_date, end_date, actual_return_date, price_per_day_at_booking) FROM stdin;
22461813-7dd7-4114-9876-c8e315c10eeb	61ac8d3c-7a01-4fe8-81cb-5a11da7bd87d	de8f0366-b6be-4a88-a259-46e03f284e7d	2025-05-20 08:00:00+00	2025-05-23 08:00:00+00	2026-05-16 08:05:50.807055+00	350000.00
c77a8959-fbc4-45a9-ab68-7b026d65e599	3e6e4840-e716-4444-8729-ca989951ee8e	0e262909-d978-4e70-bf78-fb81a500166a	2026-05-17 00:00:00+00	2026-05-19 00:00:00+00	2026-05-17 04:01:22.587355+00	350000.00
0cb51622-2256-40a0-90d2-7d25271a6609	c5a6c650-e24f-4415-abdb-05174742e2c0	de8f0366-b6be-4a88-a259-46e03f284e7d	2026-05-17 09:00:00+00	2026-05-18 10:00:00+00	2026-05-17 04:01:28.087546+00	350000.00
5cd1ecfe-70ac-4591-a094-58eebf082b7d	8704b35f-15ef-46ef-be32-bf6870481bd9	de8f0366-b6be-4a88-a259-46e03f284e7d	2026-05-17 00:00:00+00	2026-05-18 00:00:00+00	\N	350000.00
0ce35777-6de4-4d2e-8812-abf374e510c3	26fd07c9-3d9f-4ee8-8fca-3523839d0aea	0e262909-d978-4e70-bf78-fb81a500166a	2026-05-17 00:00:00+00	2026-05-18 00:00:00+00	2026-05-17 08:34:38.988882+00	350000.00
d43adef5-0f7a-4312-80e2-40e81e867b43	9420de03-2e90-4d9e-ac09-b112225082cd	35aeac1f-3af3-4fe1-b951-5f79da87ec4d	2026-05-17 00:00:00+00	2026-05-18 00:00:00+00	2026-05-17 11:38:11.652321+00	350000.00
afc40884-3fc0-4e50-9c05-f4c828b88a32	825f7c19-94aa-4a51-ac5a-e1153715e4cd	35aeac1f-3af3-4fe1-b951-5f79da87ec4d	2026-05-17 00:00:00+00	2026-05-18 00:00:00+00	2026-05-17 12:09:52.657924+00	350000.00
d5b7741c-f0c0-4c62-b1cf-62637d045070	bda661c3-030e-49e6-8e74-8ff7ec18fc72	0e262909-d978-4e70-bf78-fb81a500166a	2026-05-17 00:00:00+00	2026-05-28 00:00:00+00	\N	350000.00
095640fc-56d3-4fcd-b0ab-441960172532	363552aa-d3bb-48a6-a417-dec27ba56051	35aeac1f-3af3-4fe1-b951-5f79da87ec4d	2026-05-18 00:00:00+00	2026-05-19 00:00:00+00	\N	350000.00
\.


--
-- TOC entry 3820 (class 0 OID 17646)
-- Dependencies: 291
-- Data for Name: rental_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rental_transactions (transaction_id, user_id, booking_date, total_amount, transaction_status, add_ons) FROM stdin;
61ac8d3c-7a01-4fe8-81cb-5a11da7bd87d	82e093e6-8204-444c-bcd9-b5fb28006fc1	2026-05-16 07:46:54.338825+00	1050000.00	completed	\N
3e6e4840-e716-4444-8729-ca989951ee8e	82e093e6-8204-444c-bcd9-b5fb28006fc1	2026-05-17 03:56:22.409657+00	700000.00	completed	{"use_chauffeur": false, "use_child_seat": false, "use_extra_insurance": false}
c5a6c650-e24f-4415-abdb-05174742e2c0	82e093e6-8204-444c-bcd9-b5fb28006fc1	2026-05-17 02:53:35.219381+00	700000.00	completed	{"use_chauffeur": true, "use_extra_insurance": false}
8704b35f-15ef-46ef-be32-bf6870481bd9	82e093e6-8204-444c-bcd9-b5fb28006fc1	2026-05-17 04:02:03.446927+00	350000.00	active	{"use_chauffeur": false, "use_child_seat": false, "use_extra_insurance": false}
26fd07c9-3d9f-4ee8-8fca-3523839d0aea	82e093e6-8204-444c-bcd9-b5fb28006fc1	2026-05-17 08:34:11.717838+00	350000.00	completed	{"use_chauffeur": false, "use_child_seat": false, "use_extra_insurance": false}
9420de03-2e90-4d9e-ac09-b112225082cd	8be3ca52-7150-4d00-a1a9-7a32c1bb9c0b	2026-05-17 11:35:38.230106+00	350000.00	completed	{"use_chauffeur": false, "use_child_seat": false, "use_extra_insurance": false}
825f7c19-94aa-4a51-ac5a-e1153715e4cd	8be3ca52-7150-4d00-a1a9-7a32c1bb9c0b	2026-05-17 11:50:27.044653+00	350000.00	completed	{"use_chauffeur": false, "use_child_seat": false, "use_extra_insurance": false}
bda661c3-030e-49e6-8e74-8ff7ec18fc72	259ac81d-0520-4b4b-b0f9-629b4c9df0c0	2026-05-17 16:58:46.947335+00	8250000.00	active	{"use_chauffeur": true, "use_child_seat": false, "use_extra_insurance": true}
363552aa-d3bb-48a6-a417-dec27ba56051	9b4f8fdc-ac17-48e4-914f-2a5a3c63750e	2026-05-17 17:21:18.013719+00	350000.00	active	{"use_chauffeur": false, "use_child_seat": false, "use_extra_insurance": false}
\.


--
-- TOC entry 3817 (class 0 OID 17599)
-- Dependencies: 288
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (user_id, full_name, email, password_hash, phone_number, id_card_number, license_card_number, created_at, bank_account) FROM stdin;
8be3ca52-7150-4d00-a1a9-7a32c1bb9c0b	Alam Backend	alam@zenauto.com	$2b$10$6gBc7God0uKHs9VmJZJBR.a/ZXktW54UFOeqH08.pTsseLM9erwJ.	081212121212	3171020000000001	\N	2026-05-17 10:22:39.741214+00	\N
de3c0f54-bac9-4183-9627-f683b28b230d	Tes Backend	tes@zenauto.com	$2b$10$mY61RkGIMbXFcGCdCpWGbuh2GiSmjKMVbleeJDHkXZDV.AKEstlEC	081212121211	3171020000000000	\N	2026-05-17 10:28:21.339835+00	\N
9b4f8fdc-ac17-48e4-914f-2a5a3c63750e	Elesia	elesia@zenauto.com	$2b$10$RXdr6PfISd7dgaxVkXgF7ehqfL/lqYQo.kJBV7VdaE8zmz5DRfBwW	080705030707	3171020000000070	081231346543	2026-05-17 12:57:23.334166+00	BCA - 12351231
259ac81d-0520-4b4b-b0f9-629b4c9df0c0	qois ismail	qoisismailbinmail@gmail.com	$2b$10$Ys1VgKlK.n5H/8PZEPyHZuEUOQ9KL5mFjyiRquTY3LiFXRns1V9LO	08123456789	3211234567890123	\N	2026-05-17 16:52:08.393852+00	\N
64ec5509-9b5f-4462-8018-044d92401799	Akun Dinonaktifkan	nonaktif_alam@rental.com	$2b$10$6gBc7God0uKHs9VmJZJBR.a/ZXktW54UFOeqH08.pTsseLM9erwJ.	0812345678	32012345678	\N	2026-05-16 06:59:12.725065+00	\N
82e093e6-8204-444c-bcd9-b5fb28006fc1	Akun Dinonaktifkan	nonaktif_ciel@user.com	$2b$10$6gBc7God0uKHs9VmJZJBR.a/ZXktW54UFOeqH08.pTsseLM9erwJ.	0812345677	32012345677	\N	2026-05-16 07:42:39.152073+00	\N
\.


--
-- TOC entry 3844 (class 0 OID 0)
-- Dependencies: 296
-- Name: faqs_number_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faqs_number_id_seq', 2, true);


--
-- TOC entry 3639 (class 2606 OID 17623)
-- Name: car_models car_models_model_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car_models
    ADD CONSTRAINT car_models_model_name_key UNIQUE (model_name);


--
-- TOC entry 3641 (class 2606 OID 17621)
-- Name: car_models car_models_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car_models
    ADD CONSTRAINT car_models_pkey PRIMARY KEY (model_id);


--
-- TOC entry 3659 (class 2606 OID 17735)
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- TOC entry 3643 (class 2606 OID 17635)
-- Name: fleet_cars fleet_cars_gps_device_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_cars
    ADD CONSTRAINT fleet_cars_gps_device_id_key UNIQUE (gps_device_id);


--
-- TOC entry 3645 (class 2606 OID 17633)
-- Name: fleet_cars fleet_cars_license_plate_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_cars
    ADD CONSTRAINT fleet_cars_license_plate_key UNIQUE (license_plate);


--
-- TOC entry 3647 (class 2606 OID 17631)
-- Name: fleet_cars fleet_cars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_cars
    ADD CONSTRAINT fleet_cars_pkey PRIMARY KEY (car_id);


--
-- TOC entry 3657 (class 2606 OID 17705)
-- Name: maintenance_list maintenance_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_list
    ADD CONSTRAINT maintenance_list_pkey PRIMARY KEY (maintenance_id);


--
-- TOC entry 3653 (class 2606 OID 17678)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 3655 (class 2606 OID 17692)
-- Name: penalties penalties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penalties
    ADD CONSTRAINT penalties_pkey PRIMARY KEY (penalty_id);


--
-- TOC entry 3651 (class 2606 OID 17662)
-- Name: rental_details rental_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_details
    ADD CONSTRAINT rental_details_pkey PRIMARY KEY (rental_detail_id);


--
-- TOC entry 3649 (class 2606 OID 17651)
-- Name: rental_transactions rental_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_transactions
    ADD CONSTRAINT rental_transactions_pkey PRIMARY KEY (transaction_id);


--
-- TOC entry 3629 (class 2606 OID 17609)
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- TOC entry 3631 (class 2606 OID 17613)
-- Name: user user_id_card_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_id_card_number_key UNIQUE (id_card_number);


--
-- TOC entry 3633 (class 2606 OID 17615)
-- Name: user user_license_card_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_license_card_number_key UNIQUE (license_card_number);


--
-- TOC entry 3635 (class 2606 OID 17611)
-- Name: user user_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_phone_number_key UNIQUE (phone_number);


--
-- TOC entry 3637 (class 2606 OID 17607)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3660 (class 2606 OID 17636)
-- Name: fleet_cars fleet_cars_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_cars
    ADD CONSTRAINT fleet_cars_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.car_models(model_id);


--
-- TOC entry 3661 (class 2606 OID 17641)
-- Name: fleet_cars fleet_cars_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_cars
    ADD CONSTRAINT fleet_cars_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


--
-- TOC entry 3667 (class 2606 OID 17706)
-- Name: maintenance_list maintenance_list_car_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_list
    ADD CONSTRAINT maintenance_list_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.fleet_cars(car_id);


--
-- TOC entry 3665 (class 2606 OID 17679)
-- Name: payments payments_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.rental_transactions(transaction_id);


--
-- TOC entry 3666 (class 2606 OID 17693)
-- Name: penalties penalties_rental_detail_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penalties
    ADD CONSTRAINT penalties_rental_detail_id_fkey FOREIGN KEY (rental_detail_id) REFERENCES public.rental_details(rental_detail_id);


--
-- TOC entry 3663 (class 2606 OID 17668)
-- Name: rental_details rental_details_car_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_details
    ADD CONSTRAINT rental_details_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.fleet_cars(car_id);


--
-- TOC entry 3664 (class 2606 OID 17663)
-- Name: rental_details rental_details_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_details
    ADD CONSTRAINT rental_details_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.rental_transactions(transaction_id);


--
-- TOC entry 3662 (class 2606 OID 17652)
-- Name: rental_transactions rental_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_transactions
    ADD CONSTRAINT rental_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


--
-- TOC entry 3833 (class 0 OID 0)
-- Dependencies: 33
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 3834 (class 0 OID 0)
-- Dependencies: 289
-- Name: TABLE car_models; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.car_models TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.car_models TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.car_models TO service_role;


--
-- TOC entry 3835 (class 0 OID 0)
-- Dependencies: 297
-- Name: TABLE faqs; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.faqs TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.faqs TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.faqs TO service_role;


--
-- TOC entry 3837 (class 0 OID 0)
-- Dependencies: 290
-- Name: TABLE fleet_cars; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.fleet_cars TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.fleet_cars TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.fleet_cars TO service_role;


--
-- TOC entry 3838 (class 0 OID 0)
-- Dependencies: 295
-- Name: TABLE maintenance_list; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.maintenance_list TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.maintenance_list TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.maintenance_list TO service_role;


--
-- TOC entry 3839 (class 0 OID 0)
-- Dependencies: 293
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.payments TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.payments TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.payments TO service_role;


--
-- TOC entry 3840 (class 0 OID 0)
-- Dependencies: 294
-- Name: TABLE penalties; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.penalties TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.penalties TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.penalties TO service_role;


--
-- TOC entry 3841 (class 0 OID 0)
-- Dependencies: 292
-- Name: TABLE rental_details; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.rental_details TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.rental_details TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.rental_details TO service_role;


--
-- TOC entry 3842 (class 0 OID 0)
-- Dependencies: 291
-- Name: TABLE rental_transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.rental_transactions TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.rental_transactions TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.rental_transactions TO service_role;


--
-- TOC entry 3843 (class 0 OID 0)
-- Dependencies: 288
-- Name: TABLE "user"; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public."user" TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public."user" TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public."user" TO service_role;


--
-- TOC entry 2389 (class 826 OID 16494)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;


--
-- TOC entry 2367 (class 826 OID 16495)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2390 (class 826 OID 16493)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;


--
-- TOC entry 2369 (class 826 OID 16497)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2388 (class 826 OID 16492)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO service_role;


--
-- TOC entry 2368 (class 826 OID 16496)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


-- Completed on 2026-05-18 07:50:04

--
-- PostgreSQL database dump complete
--

\unrestrict hccp4oeTGcWmjO6fu7yixGjdfbVD9js1p1yaOiadhzfzFEI9y2CgHXYr8bwLxfW

