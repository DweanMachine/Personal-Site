const username = "DweanMachine";

// Static, trusted markup: a 1-bit folder icon
const FOLDER_ICON = `
<svg viewBox="0 0 32 26" shape-rendering="crispEdges" aria-hidden="true">
  <path d="M1 3h11l3 3h16v19H1z" fill="#fff" stroke="#000" stroke-width="2"/>
  <path d="M1 9h30" stroke="#000" stroke-width="2"/>
</svg>`;

async function getUserRepos(user) {
    const response = await fetch(
        `https://api.github.com/users/${user}/repos?per_page=100&sort=updated`
    );

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
}

const projects = document.getElementById("projects");
const count = document.getElementById("projectCount");

function renderRepos(repos) {
    projects.textContent = ""; // clear the container
    count.textContent = `${repos.length} item${repos.length === 1 ? "" : "s"}`;

    repos.forEach(repo => {
        const item = document.createElement("a");
        item.className = "repo";
        item.href = repo.html_url;
        item.target = "_blank";
        item.rel = "noopener noreferrer";

        const icon = document.createElement("span");
        icon.innerHTML = FOLDER_ICON;

        const name = document.createElement("span");
        name.className = "name";
        name.textContent = repo.name;

        const meta = document.createElement("span");
        meta.className = "meta";
        meta.textContent = `- ${repo.language ?? "n/a"} -`;
        meta.style.fontSize = "0.75em";

        const desc = document.createElement("span");
        desc.className = "desc";
        desc.textContent = repo.description || "No description";

        item.append(icon, name, meta, desc);
        projects.append(item);
    });
}

async function main() {
    try {
        const repos = await getUserRepos(username);
        renderRepos(repos);
    } catch (error) {
        console.error("Error fetching repositories:", error);
        count.textContent = "Error";
        projects.textContent = "Could not load repositories. Reload the page to try again.";
    }
}

await main();
