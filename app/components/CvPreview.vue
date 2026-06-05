<template>
  <div ref="cvContainer" class="ats-cv-preview">
    <!-- Header: Name and Contact Info -->
    <div class="cv-header">
      <h1 class="name">{{ data.personalInfo.fullName || "YOUR NAME" }}</h1>
      <div class="contact-info">
        <span v-if="data.personalInfo.location">{{
          data.personalInfo.location
        }}</span>
        <span v-if="data.personalInfo.location && data.personalInfo.phone">
          |
        </span>
        <span v-if="data.personalInfo.phone">{{
          data.personalInfo.phone
        }}</span>
        <span
          v-if="
            (data.personalInfo.location || data.personalInfo.phone) &&
            data.personalInfo.email
          "
        >
          |
        </span>
        <span v-if="data.personalInfo.email">
          <a :href="`mailto:${data.personalInfo.email}`" class="cv-link">{{
            data.personalInfo.email
          }}</a>
        </span>
        <span
          v-if="
            (data.personalInfo.location ||
              data.personalInfo.phone ||
              data.personalInfo.email) &&
            data.personalInfo.website
          "
        >
          |
        </span>
        <span v-if="data.personalInfo.website">
          <a
            :href="
              /^https?:\/\//i.test(data.personalInfo.website)
                ? data.personalInfo.website
                : `https://${data.personalInfo.website}`
            "
            target="_blank"
            class="cv-link"
            >{{ data.personalInfo.website }}</a
          >
        </span>
      </div>
    </div>

    <!-- Summary -->
    <div class="cv-section" v-if="data.personalInfo.summary">
      <h2 class="section-title">PROFESSIONAL SUMMARY</h2>
      <div class="section-content">
        <p>{{ data.personalInfo.summary }}</p>
      </div>
    </div>

    <!-- Experience -->
    <div
      class="cv-section"
      v-if="data.experience && data.experience.length > 0"
    >
      <h2 class="section-title">EXPERIENCE</h2>
      <div class="section-content">
        <div class="item" v-for="exp in data.experience" :key="exp.id">
          <div class="item-header">
            <span class="item-title">{{ exp.title || "Job Title" }}</span>
            <span class="item-date"
              >{{ exp.startDate }}
              <span v-if="exp.startDate || exp.endDate">-</span>
              {{ exp.endDate }}</span
            >
          </div>
          <div class="item-sub">
            <span class="item-company">{{ exp.company }}</span>
            <span class="item-location" v-if="exp.location"
              >, {{ exp.location }}</span
            >
          </div>
          <div class="item-desc" v-if="exp.description">
            <ul class="desc-list">
              <li
                v-for="(line, idx) in formatDescription(exp.description)"
                :key="idx"
              >
                {{ line }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects -->
    <div class="cv-section" v-if="data.projects && data.projects.length > 0">
      <h2 class="section-title">PROJECTS</h2>
      <div class="section-content">
        <div class="item" v-for="proj in data.projects" :key="proj.id">
          <div class="item-header">
            <span class="item-title">
              <a
                v-if="proj.link"
                :href="
                  /^https?:\/\//i.test(proj.link)
                    ? proj.link
                    : `https://${proj.link}`
                "
                target="_blank"
                class="cv-link project-link"
                >{{ proj.title || "Project Title" }}
                <span class="external-link-icon">↗</span></a
              >
              <span v-else>{{ proj.title || "Project Title" }}</span>
              <span v-if="proj.technologies" class="item-tech">
                | {{ proj.technologies }}</span
              >
            </span>
            <span class="item-date">{{ proj.date }}</span>
          </div>
          <div class="item-desc" v-if="proj.description">
            <ul class="desc-list">
              <li
                v-for="(line, idx) in formatDescription(proj.description)"
                :key="idx"
              >
                {{ line }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Education -->
    <div class="cv-section" v-if="data.education && data.education.length > 0">
      <h2 class="section-title">EDUCATION</h2>
      <div class="section-content">
        <div class="item" v-for="edu in data.education" :key="edu.id">
          <div class="item-header">
            <span class="item-title">{{ edu.school || "School Name" }}</span>
            <span class="item-date"
              >{{ edu.startDate }}
              <span v-if="edu.startDate || edu.endDate">-</span>
              {{ edu.endDate }}</span
            >
          </div>
          <div class="item-sub">
            <span class="item-degree">{{ edu.degree }}</span>
            <span class="item-location" v-if="edu.location"
              >, {{ edu.location }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Certifications -->
    <div
      class="cv-section"
      v-if="data.certifications && data.certifications.length > 0"
    >
      <h2 class="section-title">CERTIFICATIONS</h2>
      <div class="section-content">
        <div class="item" v-for="cert in data.certifications" :key="cert.id">
          <div class="item-header">
            <span class="item-title">
              <a
                v-if="cert.link"
                :href="
                  /^https?:\/\//i.test(cert.link)
                    ? cert.link
                    : `https://${cert.link}`
                "
                target="_blank"
                class="cv-link project-link"
                >{{ cert.title || "Certification Title" }}
                <span class="external-link-icon">↗</span></a
              >
              <span v-else>{{ cert.title || "Certification Title" }}</span>
            </span>
            <span class="item-date">{{ cert.date }}</span>
          </div>
          <div class="item-sub" v-if="cert.issuer">
            <span class="item-company">{{ cert.issuer }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills -->
    <div class="cv-section" v-if="data.skills">
      <h2 class="section-title">SKILLS</h2>
      <div class="section-content">
        <p class="skills-text">{{ data.skills }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, watch } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  fontSizeMultiplier: {
    type: Number,
    default: 11,
  },
  gapMultiplier: {
    type: Number,
    default: 14,
  },
});

const cvContainer = ref(null);

const applyMultipliers = () => {
  if (!cvContainer.value) return;

  // Calculate CSS variable values based on multipliers
  const fontSizeBase = props.fontSizeMultiplier;
  const gapBase = props.gapMultiplier;

  // Apply multipliers to CSS variables (based on ratio to defaults: 11pt font, 14px gap)
  const fontRatio = fontSizeBase / 11;
  const gapRatio = gapBase / 14;

  cvContainer.value.style.setProperty("--base-font-size", `${fontSizeBase}pt`);
  cvContainer.value.style.setProperty(
    "--name-font-size",
    `${(20 * fontRatio).toFixed(2)}pt`,
  );
  cvContainer.value.style.setProperty(
    "--section-title-font-size",
    `${(12 * fontRatio).toFixed(2)}pt`,
  );
  cvContainer.value.style.setProperty(
    "--item-title-font-size",
    `${(11.5 * fontRatio).toFixed(2)}pt`,
  );
  cvContainer.value.style.setProperty(
    "--contact-info-font-size",
    `${(10 * fontRatio).toFixed(2)}pt`,
  );
  cvContainer.value.style.setProperty(
    "--item-sub-font-size",
    `${(10.5 * fontRatio).toFixed(2)}pt`,
  );
  cvContainer.value.style.setProperty(
    "--item-tech-font-size",
    `${(10.5 * fontRatio).toFixed(2)}pt`,
  );

  cvContainer.value.style.setProperty(
    "--section-margin",
    `${(18 * gapRatio).toFixed(0)}px`,
  );
  cvContainer.value.style.setProperty("--item-margin", `${gapBase}px`);
  cvContainer.value.style.setProperty(
    "--header-margin",
    `${(20 * gapRatio).toFixed(0)}px`,
  );
};

const formatDescription = (desc) => {
  if (!desc) return [];
  return desc
    .split("\n")
    .map((line) => line.replace(/^-/, "").trim())
    .filter((line) => line.length > 0);
};

const adjustFontSizes = () => {
  if (!cvContainer.value) return;

  // First apply the multipliers
  applyMultipliers();

  const MAX_HEIGHT = 842; // A4 height in pixels (8.27in * 96dpi)
  const MIN_SCALE = 0.7;

  // Check if content exceeds page height
  if (cvContainer.value.scrollHeight <= MAX_HEIGHT) {
    return; // Content fits, no need to shrink
  }

  // Only scale down if content overflows
  let scale = 1.0;
  while (cvContainer.value.scrollHeight > MAX_HEIGHT && scale > MIN_SCALE) {
    scale -= 0.01;

    const fontRatio = (props.fontSizeMultiplier / 11) * scale;
    const gapRatio = (props.gapMultiplier / 14) * scale;

    // Apply CSS variables with scaled values
    cvContainer.value.style.setProperty(
      "--base-font-size",
      (props.fontSizeMultiplier * scale).toFixed(2) + "pt",
    );
    cvContainer.value.style.setProperty(
      "--line-height",
      (1.5 * scale).toFixed(2),
    );
    cvContainer.value.style.setProperty(
      "--section-margin",
      Math.max(8, 18 * gapRatio).toFixed(0) + "px",
    );
    cvContainer.value.style.setProperty(
      "--item-margin",
      Math.max(6, props.gapMultiplier * scale).toFixed(0) + "px",
    );
    cvContainer.value.style.setProperty(
      "--header-margin",
      Math.max(10, 20 * gapRatio).toFixed(0) + "px",
    );
    cvContainer.value.style.setProperty(
      "--name-font-size",
      (20 * fontRatio).toFixed(2) + "pt",
    );
    cvContainer.value.style.setProperty(
      "--section-title-font-size",
      (12 * fontRatio).toFixed(2) + "pt",
    );
    cvContainer.value.style.setProperty(
      "--item-title-font-size",
      (11.5 * fontRatio).toFixed(2) + "pt",
    );
    cvContainer.value.style.setProperty(
      "--contact-info-font-size",
      (10 * fontRatio).toFixed(2) + "pt",
    );
    cvContainer.value.style.setProperty(
      "--item-sub-font-size",
      (10.5 * fontRatio).toFixed(2) + "pt",
    );
    cvContainer.value.style.setProperty(
      "--item-tech-font-size",
      (10.5 * fontRatio).toFixed(2) + "pt",
    );
  }
};

onMounted(() => {
  // Initial adjustment after mount
  setTimeout(adjustFontSizes, 100);
});

onUpdated(() => {
  // Adjust when data changes
  adjustFontSizes();
});

watch(
  () => props.data,
  () => {
    setTimeout(adjustFontSizes, 100);
  },
  { deep: true },
);

watch(
  () => props.fontSizeMultiplier,
  () => {
    setTimeout(adjustFontSizes, 50);
  },
);

watch(
  () => props.gapMultiplier,
  () => {
    setTimeout(adjustFontSizes, 50);
  },
);
</script>

<style scoped>
/* ATS Strict CSS Rules with responsive variables */
:root {
  --base-font-size: 11pt;
  --line-height: 1.5;
  --section-margin: 18px;
  --item-margin: 14px;
  --header-margin: 20px;
  --name-font-size: 20pt;
  --section-title-font-size: 12pt;
  --item-title-font-size: 11.5pt;
  --contact-info-font-size: 10pt;
  --item-sub-font-size: 10.5pt;
  --item-tech-font-size: 10.5pt;
}

.ats-cv-preview {
  font-family: "Arial", sans-serif;
  color: #000000;
  line-height: var(--line-height);
  padding: 0.75in;
  font-size: var(--base-font-size);
  word-break: break-word;
}

.name {
  font-size: var(--name-font-size);
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 4px;
  letter-spacing: 1px;
}

.contact-info {
  text-align: center;
  font-size: var(--contact-info-font-size);
  margin-bottom: var(--header-margin);
}

.cv-section {
  margin-bottom: var(--section-margin);
}

.section-title {
  font-size: var(--section-title-font-size);
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1px solid #000;
  margin-bottom: 10px;
  padding-bottom: 4px;
}

.section-content {
  margin-left: 0;
}

.item {
  margin-bottom: var(--item-margin);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-weight: bold;
}

.item-title {
  font-size: var(--item-title-font-size);
}

.item-tech {
  font-weight: normal;
  font-style: italic;
  font-size: var(--item-tech-font-size);
}

.item-sub {
  font-style: italic;
  margin-bottom: 4px;
  font-size: var(--item-sub-font-size);
}

.desc-list {
  margin: 0;
  padding-left: 1.5em;
  list-style-type: disc;
}

.desc-list li {
  margin-bottom: 3px;
  text-align: justify;
}

.skills-text {
  margin: 0;
  line-height: 1.6;
}

p {
  margin: 0;
  text-align: justify;
}
.cv-link {
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.project-link:hover {
  text-decoration: underline;
}

.external-link-icon {
  font-size: 0.8em;
  opacity: 0.7;
  vertical-align: super;
}
</style>
