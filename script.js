let projects = [];
let tags = [];

// 加载项目数据和标签
async function loadData() {
    try {
        // 加载项目数据
        const projectListResponse = await fetch('data/project_list.json');
        const projectList = await projectListResponse.json();
        
        for (const projectFile of projectList) {
            const projectResponse = await fetch(`projects/${projectFile}`);
            const projectData = await projectResponse.json();
            projectData.fileName = projectFile;
            projects.push(projectData);
        }
        
        // 加载标签数据
        const tagsResponse = await fetch('data/project_tags.json');
        tags = await tagsResponse.json();
        
        displayProjects(projects);
        displayTags();
        displayCategories();
    } catch (error) {
        console.error('加载数据失败:', error);
        document.getElementById('projects-grid').innerHTML = '<p>加载数据失败，请稍后再试。</p>';
    }
}

// 显示项目
function displayProjects(projectsToShow) {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';

    projectsToShow.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="image_wrapper hover_swipe_right">
                <img src="${project.thumbnail}" alt="${project.title}" class="main-img front-img">
                <img src="${project.hoverImage}" alt="${project.title}" class="hover-back">
            </div>
            <div class="text_info">
                <h3>${project.title}</h3>
                <p>${project.shortDescription}</p>
            </div>
        `;
        card.addEventListener('click', () => openProjectPage(project.fileName));
        grid.appendChild(card);
    });
}

// 打开项目详情页面
function openProjectPage(projectName) {
    console.log('打开项目页面，projectName:', projectName);
    window.location.href = `project.html?project=${projectName}&fileName=${encodeURIComponent(projectName)}`;
}

// 显示标签
function displayTags() {
    const tagsContainer = document.getElementById('tags-container');
    tagsContainer.innerHTML = '<span class="filter-label">标签:</span>';
    
    tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'filter-item';
        tagElement.innerHTML = `<span>${tag}</span>`;
        tagElement.addEventListener('click', () => filterByTag(tag, !tagElement.classList.contains('active')));
        tagsContainer.appendChild(tagElement);
    });
}

// 修改 displayCategories 函数
function displayCategories() {
    const categories = [...new Set(projects.map(project => project.category))];
    const categoriesContainer = document.getElementById('categories-container');
    categoriesContainer.innerHTML = '<span class="filter-label">分类:</span>';
    
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'filter-item';
        categoryElement.innerHTML = `<span>${category}</span>`;
        categoryElement.addEventListener('click', () => filterByCategory(category, !categoryElement.classList.contains('active')));
        categoriesContainer.appendChild(categoryElement);
    });
}

// 按标签筛选
function filterByTag(tag, isActive) {
    // 移除所有标签的active类
    document.querySelectorAll('#tags-container .filter-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (isActive) {
        activeFilters.tags.clear();
        activeFilters.tags.add(tag);
        // 为当前标签添加active类
        const tagElement = Array.from(document.querySelectorAll('#tags-container .filter-item span'))
            .find(span => span.textContent === tag)
            ?.parentElement;
        if (tagElement) {
            tagElement.classList.add('active');
        }
    } else {
        activeFilters.tags.delete(tag);
    }
    applyFilters();
}

// 按分类筛选
function filterByCategory(category, isActive) {
    // 移除所有分类的active类
    document.querySelectorAll('#categories-container .filter-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (isActive) {
        activeFilters.categories.clear();
        activeFilters.categories.add(category);
        // 为当前分类添加active类
        const categoryElement = Array.from(document.querySelectorAll('#categories-container .filter-item span'))
            .find(span => span.textContent === category)
            ?.parentElement;
        if (categoryElement) {
            categoryElement.classList.add('active');
        }
    } else {
        activeFilters.categories.delete(category);
    }
    applyFilters();
}

// 应用所有筛选
function applyFilters() {
    let filteredProjects = projects;

    if (activeFilters.tags.size > 0) {
        filteredProjects = filteredProjects.filter(project => 
            project.keywords.some(keyword => activeFilters.tags.has(keyword))
        );
    }

    if (activeFilters.categories.size > 0) {
        filteredProjects = filteredProjects.filter(project => 
            activeFilters.categories.has(project.category)
        );
    }

    // const searchTerm = document.getElementById('search').value.toLowerCase();
    // if (searchTerm) {
    //     filteredProjects = filteredProjects.filter(project => 
    //         project.title.toLowerCase().includes(searchTerm) ||
    //         project.shortDescription.toLowerCase().includes(searchTerm) ||
    //         project.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    //     );
    // }

    displayProjects(filteredProjects);
}

// 初始化筛选器
const activeFilters = {
    tags: new Set(),
    categories: new Set()
};

// 事件监听器
// document.getElementById('search').addEventListener('input', applyFilters);

// 初始化
loadData();

// 获取模态框元素
const modal = document.getElementById("instructionsModal");

// 获取打开模态框的按钮
const btn = document.getElementById("instructionsButton");

// 获取关闭模态框的 <span> 元素
const span = document.getElementsByClassName("close")[0];

// 当用户点击按钮时，打开模态框
btn.onclick = function() {
    modal.style.display = "block";
}

// 当用户点击 <span> (x), 关闭模态框
span.onclick = function() {
    modal.style.display = "none";
}

// 当用户点击模态框外部时，关闭它
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 获取联系我们按钮和模态框
const contactButton = document.getElementById('contactButton');
const contactModal = document.getElementById('contactModal');

// 点击联系我们按钮时显示模态框
contactButton.onclick = function() {
    contactModal.style.display = "block";
}

// 为联系我们模态框添加关闭功能
contactModal.querySelector('.close').onclick = function() {
    contactModal.style.display = "none";
}

// 点击模态框外部时关闭
window.onclick = function(event) {
    if (event.target == instructionsModal) {
        instructionsModal.style.display = "none";
    }
    if (event.target == contactModal) {
        contactModal.style.display = "none";
    }
}