<template>
  <Transition name="lead-fade">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        class="absolute inset-0 bg-gray-900/60"
        aria-hidden="true"
        tabindex="-1"
        @click="emitClose"
      />

      <section
        class="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-onboarding-title"
      >
        <button
          type="button"
          class="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
          @click="emitClose"
        >
          <span class="sr-only">{{ content.actions.close }}</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <div v-if="isComplete" class="pr-8">
          <p class="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-700">
            {{ content.intro.eyebrow }}
          </p>
          <h2 id="lead-onboarding-title" class="text-2xl font-bold text-gray-900">
            {{ content.messages.successTitle }}
          </h2>
          <p class="mt-4 text-base leading-7 text-gray-700">
            {{ content.messages.success }}
          </p>
          <button
            type="button"
            class="mt-6 rounded-lg bg-primary-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-200"
            @click="emitClose"
          >
            {{ content.actions.close }}
          </button>
        </div>

        <form v-else class="space-y-6" @submit.prevent="submitStep">
          <div class="pr-8">
            <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
              {{ content.messages.progressPrefix }} {{ currentStep }} {{ content.messages.progressSeparator }} {{ totalSteps }}
            </p>
            <h2 id="lead-onboarding-title" class="mt-2 text-2xl font-bold text-gray-900">
              {{ stepTitle }}
            </h2>
            <p class="mt-3 text-sm leading-6 text-gray-600">
              {{ stepDescription }}
            </p>
          </div>

          <div class="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              class="h-full rounded-full bg-primary-700 transition-all"
              :style="{ width: `${progressPercent}%` }"
            />
          </div>

          <p
            v-if="errorMessage"
            class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ errorMessage }}
          </p>

          <div v-if="currentStep === 1">
            <label for="restaurantName" class="block text-sm font-semibold text-gray-800">
              {{ content.fields.restaurantName }}
            </label>
            <input
              id="restaurantName"
              v-model.trim="lead.restaurantName"
              type="text"
              required
              autocomplete="organization"
              class="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
              :placeholder="content.fields.restaurantNamePlaceholder"
            />
          </div>

          <div v-else-if="currentStep === 2">
            <label for="phone" class="block text-sm font-semibold text-gray-800">
              {{ content.fields.phone }}
            </label>
            <input
              id="phone"
              v-model.trim="lead.phone"
              type="tel"
              required
              autocomplete="tel"
              class="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
              :placeholder="content.fields.phonePlaceholder"
            />
          </div>

          <div v-else-if="currentStep === 3" class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="city" class="block text-sm font-semibold text-gray-800">
                {{ content.fields.city }}
              </label>
              <input
                id="city"
                v-model.trim="lead.city"
                type="text"
                required
                autocomplete="address-level2"
                class="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
                :placeholder="content.fields.cityPlaceholder"
              />
            </div>

            <div>
              <label for="restaurantType" class="block text-sm font-semibold text-gray-800">
                {{ content.fields.restaurantType }}
              </label>
              <select
                id="restaurantType"
                v-model="lead.restaurantType"
                required
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
              >
                <option value="" disabled>{{ content.fields.restaurantTypePlaceholder }}</option>
                <option v-for="type in restaurantTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>

          <div v-else-if="currentStep === 4" class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="tablesCount" class="block text-sm font-semibold text-gray-800">
                {{ content.fields.tablesCount }}
              </label>
              <input
                id="tablesCount"
                v-model.trim="lead.tablesCount"
                type="number"
                min="1"
                required
                inputmode="numeric"
                class="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
                :placeholder="content.fields.tablesCountPlaceholder"
              />
            </div>

            <div>
              <label for="currentMenuSource" class="block text-sm font-semibold text-gray-800">
                {{ content.fields.currentMenuSource }}
              </label>
              <select
                id="currentMenuSource"
                v-model="lead.currentMenuSource"
                required
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
              >
                <option value="" disabled>{{ content.fields.currentMenuSourcePlaceholder }}</option>
                <option v-for="source in menuSources" :key="source" :value="source">
                  {{ source }}
                </option>
              </select>
            </div>
          </div>

          <div v-else-if="currentStep === 5" class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="contactName" class="block text-sm font-semibold text-gray-800">
                {{ content.fields.contactName }}
              </label>
              <input
                id="contactName"
                v-model.trim="lead.contactName"
                type="text"
                autocomplete="name"
                class="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
                :placeholder="content.fields.contactNamePlaceholder"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-semibold text-gray-800">
                {{ content.fields.email }}
              </label>
              <input
                id="email"
                v-model.trim="lead.email"
                type="email"
                autocomplete="email"
                class="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
                :placeholder="content.fields.emailPlaceholder"
              />
            </div>
          </div>

          <div v-else>
            <p class="mb-3 block text-sm font-semibold text-gray-800">
              {{ content.fields.mainNeed }}
            </p>
            <div class="grid gap-3 sm:grid-cols-2">
              <button
                v-for="need in mainNeeds"
                :key="need"
                type="button"
                class="rounded-lg border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-primary-100"
                :class="
                  lead.mainNeed === need
                    ? 'border-primary-700 bg-primary-50 text-primary-800'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                "
                @click="lead.mainNeed = need"
              >
                {{ need }}
              </button>
            </div>
          </div>

          <div class="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="currentStep === 1 || isSending"
              @click="goBack"
            >
              {{ content.actions.back }}
            </button>
            <button
              type="submit"
              class="rounded-lg bg-primary-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:cursor-wait disabled:opacity-70"
              :disabled="isSending"
            >
              {{ isSending ? content.actions.sending : submitLabel }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </Transition>
</template>

<script setup>
import { buildSupabaseLeadRequests, isSupabaseConflictError } from "~/utils/supabase-leads.mjs";

const storageKey = "smarteat-lead-onboarding";
const totalSteps = 6;
const runtimeConfig = useRuntimeConfig();

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  intent: {
    type: String,
    default: "demo",
  },
  content: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const fallbackContent = {
  intro: {
    eyebrow: "Demo SmartEat",
  },
  steps: [
    {
      title: "Quel est le nom de votre restaurant ?",
      description: "Une premiere info suffit pour demarrer votre demande.",
    },
    {
      title: "A quel numero peut-on vous rappeler ?",
      description: "Apres cette etape, notre equipe peut vous recontacter sous 24h.",
    },
    {
      title: "Ou se trouve votre etablissement ?",
      description: "Cela nous aide a preparer une demo adaptee.",
    },
    {
      title: "Preparons votre espace SmartEat",
      description: "Ces infos servent a anticiper vos QR codes et votre menu.",
    },
    {
      title: "Qui devons-nous contacter ?",
      description: "Ajoutez un contact pour faciliter le suivi.",
    },
    {
      title: "Quelle est votre priorite aujourd'hui ?",
      description: "Choisissez ce que vous voulez voir en premier pendant la demo.",
    },
  ],
  fields: {
    restaurantName: "Nom du restaurant",
    restaurantNamePlaceholder: "Ex: Le Bistrot Central",
    phone: "Telephone",
    phonePlaceholder: "Ex: 06 12 34 56 78",
    city: "Ville",
    cityPlaceholder: "Ex: Lyon",
    restaurantType: "Type d'etablissement",
    restaurantTypePlaceholder: "Choisir un type",
    tablesCount: "Nombre de tables",
    tablesCountPlaceholder: "Ex: 24",
    currentMenuSource: "Menu actuel",
    currentMenuSourcePlaceholder: "Choisir une source",
    contactName: "Responsable",
    contactNamePlaceholder: "Ex: Sarah Martin",
    email: "Email",
    emailPlaceholder: "Ex: contact@restaurant.fr",
    mainNeed: "Priorite",
  },
  options: {
    restaurantTypes: ["Restaurant", "Snack", "Cafe", "Bar", "Food truck", "Autre"],
    menuSources: ["PDF", "Site web", "Photos", "Pas encore de menu digital"],
    mainNeeds: [
      "Menu QR",
      "Prise de commande",
      "Click & Collect",
      "Caisse",
      "Suivi des ventes",
      "Gestion complete",
    ],
  },
  actions: {
    continue: "Continuer",
    back: "Retour",
    finish: "Terminer",
    close: "Fermer",
    sending: "Envoi...",
  },
  messages: {
    successTitle: "Merci",
    progressPrefix: "Etape",
    progressSeparator: "sur",
    required: "Completez les champs requis pour continuer.",
    error: "Votre progression est conservee. Reessayez dans un instant.",
    success:
      "Merci, nous preparons votre espace SmartEat. Nous vous rappelons sous 24h pour une demo adaptee a votre restaurant.",
  },
};

const content = computed(() => props.content || fallbackContent);
const restaurantTypes = computed(() => content.value.options?.restaurantTypes || []);
const menuSources = computed(() => content.value.options?.menuSources || []);
const mainNeeds = computed(() => content.value.options?.mainNeeds || []);

const blankLead = () => ({
  leadId: "",
  intent: "demo",
  restaurantName: "",
  phone: "",
  city: "",
  restaurantType: "",
  tablesCount: "",
  currentMenuSource: "",
  contactName: "",
  email: "",
  mainNeed: "",
});

const currentStep = ref(1);
const isComplete = ref(false);
const isSending = ref(false);
const errorMessage = ref("");
const lead = reactive(blankLead());

const normalizedIntent = computed(() => (props.intent === "account" ? "account" : "demo"));

const activeStep = computed(() => content.value.steps?.[currentStep.value - 1] || {});
const stepTitle = computed(() => activeStep.value.title || "");
const stepDescription = computed(() => activeStep.value.description || "");

const progressPercent = computed(() => Math.round((currentStep.value / totalSteps) * 100));
const submitLabel = computed(() =>
  currentStep.value === totalSteps ? content.value.actions.finish : content.value.actions.continue
);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      restoreProgress();
    }
  },
  { immediate: true }
);

watch(normalizedIntent, (intent) => {
  lead.intent = intent;
  saveProgress();
});

watch(
  lead,
  () => {
    if (props.open) {
      saveProgress();
    }
  },
  { deep: true }
);

function generateLeadId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function resetLead() {
  Object.assign(lead, blankLead(), {
    leadId: generateLeadId(),
    intent: normalizedIntent.value,
  });
  currentStep.value = 1;
  isComplete.value = false;
  errorMessage.value = "";
}

function restoreProgress() {
  if (!process.client) return;

  resetLead();

  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    saveProgress();
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    Object.assign(lead, blankLead(), parsed.lead || {});
    lead.leadId = lead.leadId || generateLeadId();
    lead.intent = normalizedIntent.value;
    currentStep.value = clampStep(parsed.step);
    isComplete.value = Boolean(parsed.complete);
  } catch {
    resetLead();
  }

  saveProgress();
}

function saveProgress() {
  if (!process.client || isComplete.value) return;

  localStorage.setItem(
    storageKey,
    JSON.stringify({
      step: currentStep.value,
      complete: false,
      lead: { ...lead, intent: normalizedIntent.value },
    })
  );
}

function clampStep(step) {
  const parsed = Number(step);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(Math.max(Math.trunc(parsed), 1), totalSteps);
}

function emitClose() {
  emit("close");
}

function goBack() {
  if (currentStep.value === 1 || isSending.value) return;
  currentStep.value -= 1;
  errorMessage.value = "";
  saveProgress();
}

function isStepValid() {
  const requiredByStep = {
    1: ["restaurantName"],
    2: ["phone"],
    3: ["city", "restaurantType"],
    4: ["tablesCount", "currentMenuSource"],
    6: ["mainNeed"],
  };

  const requiredFields = requiredByStep[currentStep.value] || [];
  return requiredFields.every((field) => String(lead[field] || "").trim().length > 0);
}

async function submitStep() {
  errorMessage.value = "";

  if (!isStepValid()) {
    errorMessage.value = content.value.messages.required;
    return;
  }

  if (!lead.leadId) {
    lead.leadId = generateLeadId();
  }

  lead.intent = normalizedIntent.value;
  isSending.value = true;

  try {
    const requests = buildSupabaseLeadRequests({
      supabaseUrl: runtimeConfig.public.supabaseUrl,
      supabaseAnonKey: runtimeConfig.public.supabaseAnonKey,
      lead: {
        ...lead,
        intent: normalizedIntent.value,
        step: currentStep.value,
      },
    });

    try {
      await $fetch(requests.insert.url, requests.insert.options);
    } catch (error) {
      if (!isSupabaseConflictError(error)) {
        throw error;
      }

      await $fetch(requests.update.url, requests.update.options);
    }

    if (currentStep.value === totalSteps) {
      isComplete.value = true;
      if (process.client) {
        localStorage.removeItem(storageKey);
      }
    } else {
      currentStep.value += 1;
      saveProgress();
    }
  } catch {
    saveProgress();
    errorMessage.value = content.value.messages.error;
  } finally {
    isSending.value = false;
  }
}
</script>

<style scoped>
.lead-fade-enter-active,
.lead-fade-leave-active {
  transition: opacity 180ms ease;
}

.lead-fade-enter-from,
.lead-fade-leave-to {
  opacity: 0;
}
</style>
