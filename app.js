// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCbFzc3fFqQgQBvIxbG9TT8jPWeXtWEtNg",
  authDomain: "resourcing-ee800.firebaseapp.com",
  projectId: "resourcing-ee800",
  storageBucket: "resourcing-ee800.firebasestorage.app",
  messagingSenderId: "574006926294",
  appId: "1:574006926294:web:91a781b6d5c26846226277",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Reference to Forms
const addProjectForm = document.getElementById("addProjectForm");
const addResourceForm = document.getElementById("addResourceForm");
const projectSelect = document.getElementById("projectSelect");
const projectList = document.getElementById("projectList");

// Add Project
addProjectForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const projectName = document.getElementById("projectName").value;

    if (projectName.trim() !== "") {
        await db.collection("projects").add({ name: projectName });
        addProjectForm.reset();
        await loadProjects(); // Ensure projects load after adding
    }
});

// Add Resource
addResourceForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const resourceName = document.getElementById("resourceName").value;
    const projectId = projectSelect.value;

    if (resourceName.trim() !== "" && projectId !== "") {
        await db.collection("resources").add({ name: resourceName, projectId });
        addResourceForm.reset();
        await loadProjects();
    }
});

// Load Projects & Resources
async function loadProjects() {
    projectSelect.innerHTML = `<option value="">Select Project</option>`;
    projectList.innerHTML = "";

    const projectsSnapshot = await db.collection("projects").get();
    
    if (projectsSnapshot.empty) {
        console.log("No projects found.");
    }

    projectsSnapshot.forEach(async (doc) => {
        const project = doc.data();
        const projectId = doc.id;

        // Add to Dropdown
        const option = document.createElement("option");
        option.value = projectId;
        option.textContent = project.name;
        projectSelect.appendChild(option);

        // Fetch Resources for this Project
        const resourceSnapshot = await db.collection("resources").where("projectId", "==", projectId).get();
        let resourcesHTML = `<ul class="resource-list">`;

        resourceSnapshot.forEach((resDoc) => {
            const resource = resDoc.data();
            resourcesHTML += `<li>${resource.name} <span class="delete-btn" onclick="deleteResource('${resDoc.id}')">❌</span></li>`;
        });

        resourcesHTML += `</ul>`;

        // Display Project & Resources
        projectList.innerHTML += `
            <div class="project-card">
                <h5>${project.name} <span class="delete-btn" onclick="deleteProject('${projectId}')">🗑️</span></h5>
                ${resourcesHTML}
            </div>`;
    });
}

// Delete Project
async function deleteProject(projectId) {
    if (!confirm("Are you sure you want to delete this project and its resources?")) return;
    
    await db.collection("projects").doc(projectId).delete();
    
    // Delete all associated resources
    const resourceSnapshot = await db.collection("resources").where("projectId", "==", projectId).get();
    resourceSnapshot.forEach((doc) => db.collection("resources").doc(doc.id).delete());

    await loadProjects();
}

// Delete Resource
async function deleteResource(resourceId) {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    
    await db.collection("resources").doc(resourceId).delete();
    await loadProjects();
}

// Initial Load
document.addEventListener("DOMContentLoaded", loadProjects);
