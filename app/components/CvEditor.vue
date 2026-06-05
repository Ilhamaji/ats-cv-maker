<template>
  <div class="cv-editor">
    <div class="section animate-fade-in">
      <h2>Personal Information</h2>
      <div class="input-group">
        <label>Full Name</label>
        <input
          v-model="modelValue.personalInfo.fullName"
          type="text"
          placeholder="e.g. John Doe"
        />
      </div>
      <div class="grid-2">
        <div class="input-group">
          <label>Email</label>
          <input
            v-model="modelValue.personalInfo.email"
            type="email"
            placeholder="john@example.com"
          />
        </div>
        <div class="input-group">
          <label>Phone</label>
          <input
            v-model="modelValue.personalInfo.phone"
            type="text"
            placeholder="+1 234 567 890"
          />
        </div>
      </div>
      <div class="grid-2">
        <div class="input-group">
          <label>Location</label>
          <input
            v-model="modelValue.personalInfo.location"
            type="text"
            placeholder="New York, NY"
          />
        </div>
        <div class="input-group">
          <label>LinkedIn / Website</label>
          <input
            v-model="modelValue.personalInfo.website"
            type="text"
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
      </div>
      <div class="input-group">
        <label>Professional Summary</label>
        <textarea
          v-model="modelValue.personalInfo.summary"
          rows="4"
          placeholder="Brief overview of your career..."
        ></textarea>
      </div>
    </div>

    <!-- Experience -->
    <div class="section animate-fade-in" style="animation-delay: 0.1s">
      <div class="section-header">
        <h2>Experience</h2>
        <button class="btn-icon" @click="addExperience" title="Add Experience">
          <PlusCircle :size="20" />
        </button>
      </div>
      <TransitionGroup name="list" tag="div" class="item-list">
        <div
          v-for="(exp, index) in modelValue.experience"
          :key="exp.id"
          class="card"
        >
          <div class="card-header">
            <h3>Experience #{{ index + 1 }}</h3>
            <button
              class="btn-icon text-danger"
              @click="removeExperience(index)"
            >
              <Trash2 :size="18" />
            </button>
          </div>
          <div class="input-group">
            <label>Job Title</label>
            <input
              v-model="exp.title"
              type="text"
              placeholder="Software Engineer"
            />
          </div>
          <div class="grid-2">
            <div class="input-group">
              <label>Company</label>
              <input
                v-model="exp.company"
                type="text"
                placeholder="Tech Corp"
              />
            </div>
            <div class="input-group">
              <label>Location</label>
              <input v-model="exp.location" type="text" placeholder="Remote" />
            </div>
          </div>
          <div class="grid-2">
            <div class="input-group">
              <label>Start Date</label>
              <input
                v-model="exp.startDate"
                type="text"
                placeholder="Jan 2020"
              />
            </div>
            <div class="input-group">
              <label>End Date</label>
              <input v-model="exp.endDate" type="text" placeholder="Present" />
            </div>
          </div>
          <div class="input-group">
            <label>Description (Use bullet points '-')</label>
            <textarea
              v-model="exp.description"
              rows="4"
              placeholder="- Did something awesome..."
            ></textarea>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Education -->
    <div class="section animate-fade-in" style="animation-delay: 0.2s">
      <div class="section-header">
        <h2>Education</h2>
        <button class="btn-icon" @click="addEducation" title="Add Education">
          <PlusCircle :size="20" />
        </button>
      </div>
      <TransitionGroup name="list" tag="div" class="item-list">
        <div
          v-for="(edu, index) in modelValue.education"
          :key="edu.id"
          class="card"
        >
          <div class="card-header">
            <h3>Education #{{ index + 1 }}</h3>
            <button
              class="btn-icon text-danger"
              @click="removeEducation(index)"
            >
              <Trash2 :size="18" />
            </button>
          </div>
          <div class="input-group">
            <label>Degree</label>
            <input
              v-model="edu.degree"
              type="text"
              placeholder="BSc Computer Science"
            />
          </div>
          <div class="grid-2">
            <div class="input-group">
              <label>School/University</label>
              <input
                v-model="edu.school"
                type="text"
                placeholder="University of Technology"
              />
            </div>
            <div class="input-group">
              <label>Location</label>
              <input
                v-model="edu.location"
                type="text"
                placeholder="Boston, MA"
              />
            </div>
          </div>
          <div class="grid-2">
            <div class="input-group">
              <label>Start Date</label>
              <input
                v-model="edu.startDate"
                type="text"
                placeholder="Sep 2015"
              />
            </div>
            <div class="input-group">
              <label>End Date</label>
              <input v-model="edu.endDate" type="text" placeholder="May 2019" />
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Projects -->
    <div class="section animate-fade-in" style="animation-delay: 0.3s">
      <div class="section-header">
        <h2>Projects</h2>
        <button class="btn-icon" @click="addProject" title="Add Project">
          <PlusCircle :size="20" />
        </button>
      </div>
      <TransitionGroup name="list" tag="div" class="item-list">
        <div
          v-for="(proj, index) in modelValue.projects"
          :key="proj.id"
          class="card"
        >
          <div class="card-header">
            <h3>Project #{{ index + 1 }}</h3>
            <button class="btn-icon text-danger" @click="removeProject(index)">
              <Trash2 :size="18" />
            </button>
          </div>
          <div class="grid-2">
            <div class="input-group">
              <label>Project Name</label>
              <input
                v-model="proj.title"
                type="text"
                placeholder="E-Commerce Website"
              />
            </div>
            <div class="input-group">
              <label>Date / Duration</label>
              <input
                v-model="proj.date"
                type="text"
                placeholder="Jan 2021 - May 2021"
              />
            </div>
          </div>
          <div class="input-group">
            <label>Technologies Used</label>
            <input
              v-model="proj.technologies"
              type="text"
              placeholder="Vue.js, Node.js, MongoDB"
            />
          </div>
          <div class="input-group">
            <label>Project Link (Optional)</label>
            <input
              v-model="proj.link"
              type="url"
              placeholder="https://project.example.com"
            />
          </div>
          <div class="input-group">
            <label>Description (Use bullet points '-')</label>
            <textarea
              v-model="proj.description"
              rows="3"
              placeholder="- Developed full-stack..."
            ></textarea>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Certifications -->
    <div class="section animate-fade-in" style="animation-delay: 0.4s">
      <div class="section-header">
        <h2>Certifications</h2>
        <button
          class="btn-icon"
          @click="addCertification"
          title="Add Certification"
        >
          <PlusCircle :size="20" />
        </button>
      </div>
      <TransitionGroup name="list" tag="div" class="item-list">
        <div
          v-for="(cert, index) in modelValue.certifications"
          :key="cert.id"
          class="card"
        >
          <div class="card-header">
            <h3>Certification #{{ index + 1 }}</h3>
            <button
              class="btn-icon text-danger"
              @click="removeCertification(index)"
            >
              <Trash2 :size="18" />
            </button>
          </div>
          <div class="input-group">
            <label>Certification Name</label>
            <input
              v-model="cert.title"
              type="text"
              placeholder="AWS Certified Solutions Architect"
            />
          </div>
          <div class="grid-2">
            <div class="input-group">
              <label>Issuer</label>
              <input
                v-model="cert.issuer"
                type="text"
                placeholder="Amazon Web Services"
              />
            </div>
            <div class="input-group">
              <label>Date</label>
              <input v-model="cert.date" type="text" placeholder="Aug 2022" />
            </div>
          </div>
          <div class="input-group">
            <label>Certification Link (Optional)</label>
            <input
              v-model="cert.link"
              type="url"
              placeholder="https://credential.example.com"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Skills -->
    <div class="section animate-fade-in" style="animation-delay: 0.5s">
      <h2>Skills</h2>
      <div class="input-group">
        <label>List your skills (comma separated)</label>
        <textarea
          v-model="modelValue.skills"
          rows="3"
          placeholder="JavaScript, React, Node.js..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusCircle, Trash2 } from "@lucide/vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const addExperience = () => {
  if (!props.modelValue.experience) props.modelValue.experience = [];
  props.modelValue.experience.push({
    id: Date.now(),
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });
};

const removeExperience = (index) => {
  props.modelValue.experience.splice(index, 1);
};

const addEducation = () => {
  if (!props.modelValue.education) props.modelValue.education = [];
  props.modelValue.education.push({
    id: Date.now(),
    degree: "",
    school: "",
    location: "",
    startDate: "",
    endDate: "",
  });
};

const removeEducation = (index) => {
  props.modelValue.education.splice(index, 1);
};

const addProject = () => {
  if (!props.modelValue.projects) props.modelValue.projects = [];
  props.modelValue.projects.push({
    id: Date.now(),
    title: "",
    technologies: "",
    date: "",
    description: "",
  });
};

const removeProject = (index) => {
  props.modelValue.projects.splice(index, 1);
};

const addCertification = () => {
  if (!props.modelValue.certifications) props.modelValue.certifications = [];
  props.modelValue.certifications.push({
    id: Date.now(),
    title: "",
    issuer: "",
    date: "",
  });
};

const removeCertification = (index) => {
  props.modelValue.certifications.splice(index, 1);
};
</script>

<style scoped>
.cv-editor {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: var(--text-main);
  border-bottom: 2px solid #e0e7ff;
  padding-bottom: 0.5rem;
  display: inline-block;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.section-header h2 {
  margin-bottom: 0;
  border-bottom: none;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.card:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed var(--border-color);
}

.card-header h3 {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
  background-color: #f8fafc;
}

.btn-icon:hover {
  background-color: #e0e7ff;
  transform: scale(1.05);
}

.text-danger {
  color: #ef4444;
  background-color: #fef2f2;
}

.text-danger:hover {
  background-color: #fee2e2;
}

/* Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-active {
  position: absolute;
}

@media (max-width: 640px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
