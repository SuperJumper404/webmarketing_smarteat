# SmartEat Supabase Leads

## Objectif

Le site marketing stocke les demandes de demo dans Supabase sans backend Coolify dedie.

Flux:

```txt
LeadOnboarding.vue
-> Supabase REST API
-> table public.leads
-> Database Webhook Supabase
-> notification Discord, email, Slack ou Telegram
```

## Variables Coolify

Configurer dans Coolify:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_public_anon_key
APP_URL=https://app.smarteat.fr/login
```

Ne jamais mettre la `service_role key` dans Coolify pour le frontend public.

## Creation Table

Dans Supabase SQL Editor, executer:

```txt
supabase/leads.sql
```

Cette migration:

- cree `public.leads`;
- active RLS;
- autorise les inserts publics;
- autorise les updates publics seulement pour permettre l'upsert progressif par `lead_id`;
- bloque la lecture publique des leads;
- maintient `updated_at`.

## Notification Nouveau Lead

Option simple recommandee:

1. Creer un webhook Discord dans un salon prive.
2. Dans Supabase, aller dans Database Webhooks.
3. Creer un webhook sur:
   - Table: `public.leads`
   - Event: `INSERT`
   - Method: `POST`
   - URL: webhook Discord ou Edge Function intermediaire

Option plus propre:

1. Deployer la Supabase Edge Function:

```bash
supabase functions deploy notify-lead
```

2. Ajouter le secret Discord:

```bash
supabase secrets set DISCORD_LEAD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/yyy
```

3. Dans Supabase, creer un Database Webhook:

```txt
Table: public.leads
Event: INSERT
Method: POST
URL: https://<project-ref>.functions.supabase.co/notify-lead
Headers:
  Authorization: Bearer <SUPABASE_ANON_KEY>
```

La fonction est dans:

```txt
supabase/functions/notify-lead/index.ts
```

## Colonnes Importantes

- `lead_id`: identifiant genere par le navigateur.
- `intent`: `demo` ou `account`.
- `step`: etape atteinte dans l'onboarding.
- `restaurant_name`: nom du restaurant.
- `phone`: rend le lead rappelable.
- `city`, `restaurant_type`, `tables_count`: qualification.
- `current_menu_source`: source du menu actuel.
- `contact_name`, `email`: contact.
- `main_need`: priorite commerciale.

## Verification

Apres configuration:

1. Ouvrir le site.
2. Cliquer `Demander une demo`.
3. Remplir le nom du restaurant.
4. Verifier qu'une ligne apparait dans Supabase `public.leads`.
5. Remplir le telephone.
6. Verifier que la meme ligne est mise a jour avec `step = 2`.

Note: la V1 utilise un upsert par `lead_id`, donc chaque etape enrichit la meme ligne lead.

Le `lead_id` est genere cote navigateur avec `crypto.randomUUID()` quand disponible. Il sert de cle technique pour enrichir le meme lead au fil des etapes.
