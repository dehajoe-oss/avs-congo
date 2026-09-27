// scripts/fix-supabase-rls.js
// Active le Row Level Security (RLS) sur toutes les tables du schéma public
// pour sécuriser la base de données Supabase et corriger les alertes de sécurité :
// - rls_disabled_in_public
// - sensitive_columns_exposed

const fs = require('fs');
const path = require('path');

// Charger .env.local ou .env
function loadEnv() {
  const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w_]+)\s*=\s*["']?(.*?)["']?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2];
      }
    }
  }
}
loadEnv();

const { PrismaClient } = require('@prisma/client');
const connectionUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const prisma = new PrismaClient({
  datasources: {
    db: { url: connectionUrl }
  }
});

async function main() {
  console.log('--- Sécurisation des tables Supabase (Activation RLS) ---');
  console.log('Connexion directe établie.');

  // 1. Lister toutes les tables du schéma public
  const tables = await prisma.$queryRaw`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `;

  console.log(`Nombre de tables trouvées dans 'public' : ${tables.length}\n`);

  // 2. Activer RLS sur chaque table
  for (const table of tables) {
    const name = table.tablename;
    process.stdout.write(`Activation RLS sur "public"."${name}"... `);
    await prisma.$executeRawUnsafe(`ALTER TABLE "public"."${name}" ENABLE ROW LEVEL SECURITY;`);
    console.log('FAIT');
  }

  // 3. Vérification de l'état
  const updatedTables = await prisma.$queryRaw`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `;

  console.log('\n--- État final des tables après sécurisation ---');
  console.table(updatedTables);

  const allSecured = updatedTables.every(t => t.rowsecurity === true);
  if (allSecured) {
    console.log('\n[SUCCÈS] Toutes les tables ont maintenant Row-Level Security activé.');
  } else {
    console.warn('\n[ATTENTION] Certaines tables n\'ont pas pu être sécurisées.');
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('[ERREUR]', err);
  process.exit(1);
});
