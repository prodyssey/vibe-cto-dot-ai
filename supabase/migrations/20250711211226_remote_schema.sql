

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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."adventure_path" AS ENUM (
    'ignition',
    'launch_control',
    'interstellar'
);


ALTER TYPE "public"."adventure_path" OWNER TO "postgres";


CREATE TYPE "public"."game_outcome" AS ENUM (
    'email_signup',
    'book_meeting'
);


ALTER TYPE "public"."game_outcome" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."adventure_choices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid" NOT NULL,
    "question_number" integer NOT NULL,
    "question_text" "text" NOT NULL,
    "choice_text" "text" NOT NULL,
    "choice_value" "text" NOT NULL,
    "answered_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."adventure_choices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."adventure_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "player_name" "text" NOT NULL,
    "is_generated_name" boolean DEFAULT false NOT NULL,
    "email" "text",
    "final_path" "public"."adventure_path",
    "final_outcome" "public"."game_outcome",
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."adventure_sessions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."adventure_choices"
    ADD CONSTRAINT "adventure_choices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."adventure_sessions"
    ADD CONSTRAINT "adventure_sessions_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_adventure_choices_session_id" ON "public"."adventure_choices" USING "btree" ("session_id");



CREATE INDEX "idx_adventure_sessions_created_at" ON "public"."adventure_sessions" USING "btree" ("created_at");



CREATE INDEX "idx_adventure_sessions_path" ON "public"."adventure_sessions" USING "btree" ("final_path");



CREATE OR REPLACE TRIGGER "update_adventure_sessions_updated_at" BEFORE UPDATE ON "public"."adventure_sessions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."adventure_choices"
    ADD CONSTRAINT "adventure_choices_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."adventure_sessions"("id") ON DELETE CASCADE;



CREATE POLICY "Anyone can create adventure sessions" ON "public"."adventure_sessions" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can create choices" ON "public"."adventure_choices" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can update their own session" ON "public"."adventure_sessions" FOR UPDATE USING (true);



CREATE POLICY "Anyone can view adventure sessions" ON "public"."adventure_sessions" FOR SELECT USING (true);



CREATE POLICY "Anyone can view choices" ON "public"."adventure_choices" FOR SELECT USING (true);



ALTER TABLE "public"."adventure_choices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."adventure_sessions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."adventure_choices" TO "anon";
GRANT ALL ON TABLE "public"."adventure_choices" TO "authenticated";
GRANT ALL ON TABLE "public"."adventure_choices" TO "service_role";



GRANT ALL ON TABLE "public"."adventure_sessions" TO "anon";
GRANT ALL ON TABLE "public"."adventure_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."adventure_sessions" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
