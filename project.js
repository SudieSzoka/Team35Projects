async function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectFileName = urlParams.get('project');
    const fileName = urlParams.get('fileName');

    if (!projectFileName) {
        displayErrorMessage('未提供项目文件名');
        return;
    }

    const filePath = `projects/${fileName || projectFileName}`;
    console.log('尝试加载的文件路径:', filePath);

    try {
        const projectResponse = await fetch(filePath);
        if (!projectResponse.ok) {
            if (projectResponse.status === 404) {
                displayErrorMessage('找不到指定的项目文件,' + (fileName || projectFileName));
            } else {
                displayErrorMessage(`加载项目失败: HTTP错误 ${projectResponse.status}`);
            }
            return;
        }
        const project = await projectResponse.json();
        
        displayProjectDetails(project);
    } catch (error) {
        console.error('加载项目详情失败:', error);
        displayErrorMessage('加载项目详情时发生错误');
    }
}
function displayErrorMessage(message) {
    document.getElementById('project-details').innerHTML = `
        <div class="error-message">
            <h2>错误</h2>
            <p>${message}</p>
            <p>请检查URL是否正确，或返回<a href="index.html">首页</a>。</p>
        </div>
    `;
}

function displayProjectDetails(project) {
    const detailsContainer = document.getElementById('project-details');
    detailsContainer.innerHTML = `
        <div class="project-container">
            <div class="project-header">
                <div class="project-title-container">
                    <h2 class="project-title">${project.title}</h2>
                </div>
                <div class="project-divider"></div>
            </div>
            
            <div class="project-content">
                <div class="project-image-container">
                    <img src="${project.mainImage}" alt="${project.title}" class="project-main-image">
                </div>
                
                <div class="project-info">
                    <div class="project-description">
                        <h3>项目描述</h3>
                        <p>${project.fullDescription}</p>
                    </div>
                    
                    <div class="project-features">
                        <h3>主要功能</h3>
                        <ul>
                            ${project.features.map(feature => `
                                <li><span class="feature-bullet">▹</span>${feature}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-links">
                        <h3>相关链接</h3>
                        <div class="links-container">
                            ${Object.entries(project.links).map(([key, value]) => 
                                `<a href="${value}" target="_blank" class="project-link">
                                    <span class="link-text">${key}</span>
                                </a>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 深色模式切换
function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// 初始化深色模式
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 事件监听器
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // 添加首页按钮功能
    document.getElementById('homeButton').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // 初始化
    initTheme();
    loadProjectDetails();
});

// 分享项目
function shareProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const shareText = `${project.title}\n${project.shortDescription}\n${window.location.origin}/project.html?project=${project.fileName}`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('项目链接已复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制链接。');
        });
    }
}