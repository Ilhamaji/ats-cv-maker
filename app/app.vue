<template>
  <div class="app-container">
    <header class="app-header glass">
      <div class="logo">
        <FileText :size="28" class="text-primary" />
        <h1>ATS CV Maker</h1>
      </div>
      <div class="mobile-tabs" v-if="isMobile">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'editor' }"
          @click="activeTab = 'editor'"
        >
          Editor
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'preview' }"
          @click="activeTab = 'preview'"
        >
          Preview
        </button>
      </div>
      <div class="actions">
        <div class="sliders-container" v-if="!isMobile">
          <div class="slider-group">
            <label>Font:</label>
            <input
              type="range"
              min="4"
              max="24"
              step="0.5"
              v-model.number="fontSizeMultiplier"
              class="slider"
            />
            <span class="slider-value"
              >{{ fontSizeMultiplier.toFixed(1) }}pt</span
            >
          </div>
          <div class="slider-group">
            <label>Gap:</label>
            <input
              type="range"
              min="8"
              max="32"
              step="1"
              v-model.number="gapMultiplier"
              class="slider"
            />
            <span class="slider-value">{{ gapMultiplier }}px</span>
          </div>
        </div>
        <button
          class="btn btn-primary"
          @click="downloadPdf"
          :disabled="isDownloading"
        >
          <component
            :is="isDownloading ? Loader2 : Download"
            :size="20"
            class="icon-spin-if-loading"
            :class="{ spinning: isDownloading }"
          />
          {{ isDownloading ? "Generating PDF..." : "Download PDF" }}
        </button>
      </div>
    </header>

    <main class="main-content">
      <aside
        class="editor-pane custom-scrollbar"
        :class="{ 'd-none': isMobile && activeTab !== 'editor' }"
      >
        <CvEditor v-model="cvData" />
      </aside>
      <section
        class="preview-pane custom-scrollbar"
        :class="{ 'd-none': isMobile && activeTab !== 'preview' }"
      >
        <div class="preview-zoom-ctrl" v-if="!isMobile">
          <button @click="zoom -= 0.1" title="Zoom Out">
            <ZoomOut :size="16" />
          </button>
          <span>{{ Math.round(zoom * 100) }}%</span>
          <button @click="zoom += 0.1" title="Zoom In">
            <ZoomIn :size="16" />
          </button>
        </div>
        <div
          class="preview-wrapper"
          :style="
            !isMobile
              ? `transform: scale(${zoom}); transform-origin: top center;`
              : ''
          "
        >
          <CvPreview
            :data="cvData"
            :fontSizeMultiplier="fontSizeMultiplier"
            :gapMultiplier="gapMultiplier"
            id="cv-preview-container"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Download, FileText, ZoomIn, ZoomOut, Loader2 } from "@lucide/vue";

const isDownloading = ref(false);
const isMobile = ref(false);
const activeTab = ref("editor");
const zoom = ref(0.9);
const fontSizeMultiplier = ref(11);
const gapMultiplier = ref(14);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 1024;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const cvData = ref({
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    location: "New York, USA",
    website: "linkedin.com/in/johndoe",
    summary:
      "Detail-oriented Software Engineer with 5+ years of experience developing highly scalable web applications. Adept at creating optimized, ATS-friendly resumes. Proven ability to leverage modern frameworks to deliver robust software solutions.",
  },
  experience: [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "New York, NY",
      startDate: "Jan 2020",
      endDate: "Present",
      description:
        "- Led a team of 5 developers to build modern web applications resulting in a 40% increase in user engagement.\n- Improved application performance by 30% through code optimization and efficient database queries.\n- Mentored junior engineers and conducted code reviews to maintain high quality standards.",
    },
  ],
  education: [
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      school: "University of Technology",
      location: "Boston, MA",
      startDate: "Sep 2015",
      endDate: "May 2019",
    },
  ],
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      technologies: "Vue.js, Node.js, PostgreSQL",
      date: "Jan 2021 - May 2021",
      description:
        "- Developed a full-stack e-commerce platform handling 10k+ monthly active users.\n- Integrated Stripe for secure payment processing and reduced transaction failures by 15%.",
      link: "https://ecommerce.example.com",
    },
  ],
  certifications: [
    {
      id: 1,
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "Aug 2022",
      link: "https://aws.amazon.com/verification",
    },
  ],
  skills:
    "JavaScript, TypeScript, Vue.js, Nuxt.js, Node.js, Python, PostgreSQL, AWS, Docker, Git, Agile Methodologies",
});

const downloadPdf = async () => {
  isDownloading.value = true;
  try {
    const previewElement = document.getElementById("cv-preview-container");
    const htmlContent = previewElement ? previewElement.innerHTML : "";

    const response = await $fetch("/api/generate-pdf", {
      method: "POST",
      body: {
        html: htmlContent,
        fileName: `CV_${cvData.value.personalInfo.fullName.replace(/\s+/g, "_")}`,
        fontSizeMultiplier: fontSizeMultiplier.value,
        gapMultiplier: gapMultiplier.value,
      },
    });

    if (response && response.url) {
      const link = document.createElement("a");
      link.href = response.url;
      link.download = response.fileName || "CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Failed to generate PDF.");
    }
  } catch (error) {
    console.error("Error downloading PDF:", error);
    alert("Error generating PDF. Please try again.");
  } finally {
    isDownloading.value = false;
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-color);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  z-index: 10;
  border-bottom: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.text-primary {
  color: var(--primary);
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
}

.editor-pane {
  width: clamp(320px, 30vw, 500px);
  min-width: 0;
  background: white;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  padding: 2.5rem 2rem;
  box-shadow: var(--shadow-sm);
  z-index: 5;
  transition: width 0.3s ease;
}

.preview-pane {
  flex: 1;
  min-width: 0;
  background: #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  padding: 3rem 2rem;
  position: relative;
}

.preview-wrapper {
  background: white;
  width: min(210mm, 100%);
  max-width: 100%;
  min-height: 297mm;
  aspect-ratio: 210 / 297;
  height: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin: 0 auto 2rem;
  transition: transform 0.2s ease-out;
}

.preview-zoom-ctrl {
  position: sticky;
  top: 0;
  z-index: 20;
  background: white;
  border-radius: 20px;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 1rem;
}

.preview-zoom-ctrl button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
}

.preview-zoom-ctrl button:hover {
  background: #f1f5f9;
  color: var(--primary);
}

.preview-zoom-ctrl span {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
  min-width: 3ch;
  text-align: center;
}

.preview-wrapper {
  background: white;
  width: 210mm; /* A4 width */
  min-height: 297mm; /* A4 height */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transition: transform 0.2s ease-out;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.sliders-container {
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 0 1rem;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  white-space: nowrap;
}

.slider-group label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-color);
  min-width: 50px;
}

.slider {
  width: 120px;
  height: 5px;
  border-radius: 5px;
  background: linear-gradient(90deg, #e2e8f0, #cbd5e1);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.slider-value {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--primary);
  min-width: 45px;
  text-align: center;
}

.spinning {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.mobile-tabs {
  display: flex;
  background: #f1f5f9;
  border-radius: var(--radius-md);
  padding: 0.25rem;
}
.tab-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: calc(var(--radius-md) - 2px);
  font-weight: 600;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s;
}
.tab-btn.active {
  background: white;
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.d-none {
  display: none !important;
}

@media (max-width: 1024px) {
  .app-header {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
  }
  .actions {
    width: 100%;
  }
  .actions .btn {
    width: 100%;
  }
  .mobile-tabs {
    flex: 1;
    justify-content: center;
  }
  .tab-btn {
    flex: 1;
  }
  .editor-pane {
    width: 100%;
    border-right: none;
    padding: 1.5rem;
  }
  .preview-pane {
    padding: 1.5rem;
  }
  .preview-wrapper {
    width: 100%;
    min-height: auto;
    aspect-ratio: 210/297;
    height: max-content;
  }
}
</style>
