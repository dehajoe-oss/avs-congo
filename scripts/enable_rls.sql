-- Activation de Row Level Security (RLS) sur toutes les tables publiques
-- Projet Supabase : avs-db (aioxhuxfkyracmhiumlx)
-- Date d'application : 22 septembre 2026
-- Résout les alertes Supabase Advisor :
--   1. rls_disabled_in_public (Table publicly accessible)
--   2. sensitive_columns_exposed (Sensitive data publicly accessible)

ALTER TABLE "public"."Appointment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Formation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."FormationRegistration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."InvoiceItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."PageView" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Testimonial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Visitor" ENABLE ROW LEVEL SECURITY;
