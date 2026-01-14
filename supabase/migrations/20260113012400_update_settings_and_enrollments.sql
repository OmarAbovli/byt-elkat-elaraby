-- Add payment config fields to settings
ALTER TABLE settings ADD COLUMN IF NOT EXISTS stripe_public_key TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS stripe_secret_key TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS stripe_webhook_secret TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS paypal_client_id TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS paypal_secret TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS paypal_mode TEXT DEFAULT 'sandbox';

-- Add path_id to enrollments
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS path_id UUID REFERENCES paths(id) ON DELETE CASCADE;
