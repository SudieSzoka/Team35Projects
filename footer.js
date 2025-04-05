function loadFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-section">
                <h3>关于我们</h3>
                <p>35岁危机应对小组致力于帮助职场人士应对职业发展挑战，提供实用的职业规划建议和技能提升资源。</p>
            </div>
            <div class="footer-section">
                <h3>联系方式</h3>
                <p>邮箱：contact@team35.com</p>
                <p>微信：team35_official</p>
            </div>
            <div class="footer-section">
                <h3>关注我们</h3>
                <div class="social-links">
                    <a href="#" aria-label="微信公众号">📱</a>
                    <a href="#" aria-label="知乎">📚</a>
                    <a href="#" aria-label="微博">📝</a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Team 35. 保留所有权利。</p>
        </div>
    `;
    document.body.appendChild(footer);
}

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', loadFooter); 