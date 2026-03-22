-- ═════════════════════════════════════════════════════════════════════════════
-- Thaminas — Supabase Schema (minimal / low-egress)
-- ═════════════════════════════════════════════════════════════════════════════


-- ═══ 1. PRODUCTS ═══
CREATE TABLE IF NOT EXISTS products (
  id          TEXT    PRIMARY KEY,         -- e.g. 'thaminas-tote-001'
  slug        TEXT    UNIQUE NOT NULL,
  sku         TEXT,
  name        TEXT    NOT NULL,
  subtitle    TEXT,
  price       INT     NOT NULL,            -- stored in paisa (1250 BDT = 125000)
  sizes       TEXT[]  DEFAULT '{}',
  description TEXT,
  category    TEXT,
  tags        TEXT[]  DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now()
  -- images live in Supabase Storage / CDN — never pulled through this table
);


-- ═══ 2. REGISTERED_CUSTOMERS ═══
CREATE TABLE IF NOT EXISTS registered_customers (
  client_id    BIGSERIAL   PRIMARY KEY,
  auth_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  mail_address TEXT        NOT NULL UNIQUE,
  address      TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);


-- ═══ 3. ORDER_CALLS  (one row per order) ═══
CREATE TABLE IF NOT EXISTS order_calls (
  order_no        TEXT    PRIMARY KEY,     -- auto-set by trigger: 'order-1', 'order-2' …
  client_id       BIGINT  REFERENCES registered_customers(client_id) ON DELETE SET NULL,
  email           TEXT    NOT NULL,
  phone           TEXT,
  address         TEXT    NOT NULL,
  notes           TEXT,
  payment_method  TEXT    NOT NULL DEFAULT 'COD',
  status          TEXT    NOT NULL DEFAULT 'Confirmed',
  total_price     INT     NOT NULL,        -- in paisa
  created_at      TIMESTAMPTZ DEFAULT now()
);


-- ═══ 4. ORDER_LINE_ITEMS  (one row per product line) ═══
CREATE TABLE IF NOT EXISTS order_line_items (
  id          BIGSERIAL PRIMARY KEY,
  order_no    TEXT      NOT NULL REFERENCES order_calls(order_no) ON DELETE CASCADE,
  product_id  TEXT      NOT NULL REFERENCES products(id),
  quantity    SMALLINT  NOT NULL CHECK (quantity > 0),
  size        TEXT,
  unit_price  INT       NOT NULL  -- paisa, snapshot at time of order
  -- no created_at — saves a column on the most-written table
);


-- ═══ VIEWS (match your screenshot exactly, zero extra storage) ═══

CREATE OR REPLACE VIEW order_calls_flat AS
SELECT
  rc.client_id,
  oc.order_no,
  oc.address
FROM order_calls oc
LEFT JOIN registered_customers rc ON rc.client_id = oc.client_id;

CREATE OR REPLACE VIEW orders_flat AS
SELECT
  oli.order_no,
  oli.product_id,
  oli.quantity    AS qnty,
  oli.size,
  oli.unit_price  AS price,
  oc.payment_method
FROM order_line_items oli
JOIN order_calls oc ON oc.order_no = oli.order_no;


-- ═══ AUTO order_no TRIGGER ═══
CREATE SEQUENCE IF NOT EXISTS order_no_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_no()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.order_no IS NULL OR NEW.order_no = '' THEN
    NEW.order_no := 'order-' || nextval('order_no_seq');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_generate_order_no ON order_calls;
CREATE TRIGGER trg_generate_order_no
  BEFORE INSERT ON order_calls
  FOR EACH ROW EXECUTE FUNCTION generate_order_no();


-- ═══ AUTO-SYNC auth users → registered_customers ═══
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO registered_customers (auth_id, mail_address)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (mail_address) DO UPDATE SET auth_id = EXCLUDED.auth_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_new_auth_user ON auth.users;
CREATE TRIGGER trg_new_auth_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();


-- ═══ ROW LEVEL SECURITY ═══
ALTER TABLE products             ENABLE ROW LEVEL SECURITY;
ALTER TABLE registered_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_calls          ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_line_items     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products"
  ON products FOR SELECT USING (true);

CREATE POLICY "Customer reads own profile"
  ON registered_customers FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "Customer updates own profile"
  ON registered_customers FOR UPDATE USING (auth_id = auth.uid());

CREATE POLICY "User reads own order_calls"
  ON order_calls FOR SELECT
  USING (client_id IN (
    SELECT client_id FROM registered_customers WHERE auth_id = auth.uid()
  ));

CREATE POLICY "User inserts order_calls"
  ON order_calls FOR INSERT
  WITH CHECK (
    client_id IN (SELECT client_id FROM registered_customers WHERE auth_id = auth.uid())
    OR client_id IS NULL
  );

CREATE POLICY "Insert order_line_items"
  ON order_line_items FOR INSERT WITH CHECK (true);

CREATE POLICY "User reads own order_line_items"
  ON order_line_items FOR SELECT
  USING (order_no IN (
    SELECT oc.order_no FROM order_calls oc
    JOIN registered_customers rc ON rc.client_id = oc.client_id
    WHERE rc.auth_id = auth.uid()
  ));


-- ═══ SEED PRODUCTS ═══
INSERT INTO products (id, slug, sku, name, subtitle, price, sizes, description, category, tags)
VALUES
  (
    'thaminas-tote-001', 'thaminas-tote', 'TH-001',
    'The Thaminas Tote', 'Available Now',
    125000,
    ARRAY['XS','S','M','L','XL'],
    'A timeless everyday tote crafted from full-grain leather.',
    'handbags', ARRAY['new','women','handbags']
  ),
  (
    'monogram-jacket-001', 'monogram-jacket', 'TH-002',
    'Monogram Track Jacket', 'Preorder Now',
    98000,
    ARRAY['XS','S','M','L','XL','XXL'],
    'A light and sporty layer crafted from technical ripstop fabric.',
    'men', ARRAY['new','men','clothing']
  )
ON CONFLICT (id) DO NOTHING;