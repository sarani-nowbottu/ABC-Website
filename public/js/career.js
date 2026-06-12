(function () {
  const board = document.querySelector("[data-job-board]");
  const filters = document.querySelectorAll("[data-filter]");
  const roleSelect = document.querySelector("#role");
  let jobs = [];
  let activeFilter = "All";
  const fallbackJobs = [
    {
      role: "Core Banking Integration Engineer",
      department: "Engineering",
      type: "Full-time",
      location: "Dharmapuri (On-site)",
      isRemote: false,
      description: "You'll work directly on CBS platforms - integrations, customizations, data mapping, and deployment support. You know banking middleware and you're not afraid of legacy codebases.",
      requirements: ["2+ years in banking IT", "Java/Spring Boot", "CBS experience (Finacle or BaNCS preferred)"]
    },
    {
      role: "React Frontend Developer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote",
      isRemote: true,
      description: "You'll build and maintain client-facing dashboards and internal portals. Clean code, component reuse, and performance matter to us.",
      requirements: ["1+ years with React", "REST API integration", "Solid CSS skills"]
    },
    {
      role: "Business Analyst - Banking Domain",
      department: "Banking",
      type: "Full-time",
      location: "Dharmapuri (On-site)",
      isRemote: false,
      description: "You'll bridge the gap between our clients' banking operations and our technical teams. You should be able to read a BRD and translate it into a spec that developers actually use.",
      requirements: ["Banking domain experience", "Strong documentation skills", "Client-facing communication"]
    },
    {
      role: "HR Executive",
      department: "HR",
      type: "Full-time",
      location: "Dharmapuri (On-site)",
      isRemote: false,
      description: "Manage recruitment pipelines, onboarding, payroll coordination, and employee engagement. You should be organized and people-first.",
      requirements: ["1+ years in HR", "Familiarity with HRMS tools"]
    }
  ];

  function skeleton() {
    if (!board) return;
    board.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
  }

  function render() {
    if (!board) return;
    const visible = activeFilter === "All"
      ? jobs
      : jobs.filter((job) => [job.department, job.type, job.location, job.isRemote ? "Remote" : "On-site"].some((value) => String(value).includes(activeFilter)));

    if (!visible.length) {
      board.innerHTML = '<p class="lead">No open roles match this filter right now.</p>';
      return;
    }

    board.innerHTML = visible.map((job) => `
      <article class="card job-card">
        <h3>${job.role}</h3>
        <div class="job-meta"><span>${job.department}</span><span>${job.type}</span><span>${job.location}</span></div>
        <p>${job.description}</p>
        <ul class="simple-list">${(job.requirements || []).map((item) => `<li>${item}</li>`).join("")}</ul>
        <button class="btn btn-primary" type="button" data-apply="${job.role}">Apply Now</button>
      </article>
    `).join("");

    board.querySelectorAll("[data-apply]").forEach((button) => {
      button.addEventListener("click", () => {
        if (roleSelect) roleSelect.value = button.dataset.apply;
        document.querySelector("#application-form").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function populateRoles() {
    if (!roleSelect) return;
    roleSelect.innerHTML = '<option value="">Select a role</option>' + jobs.map((job) => `<option value="${job.role}">${job.role}</option>`).join("");
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filters.forEach((item) => item.classList.toggle("active", item === button));
      render();
    });
  });

  async function fetchJobs() {
    skeleton();
    try {
      const response = await fetch("/api/careers");
      const payload = await response.json();
      jobs = payload.data && payload.data.length ? payload.data : fallbackJobs;
    } catch (error) {
      jobs = fallbackJobs;
    }
    populateRoles();
    render();
  }

  fetchJobs();
})();
