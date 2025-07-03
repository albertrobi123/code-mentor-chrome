
class LeetCodeDetector {
    constructor() {
        this.problemData = null;
        this.init();
    }

    init() {
        this.extractProblemInfo();
        this.setupMessageListener();
    }

    extractProblemInfo() {
        try {
            // Extract problem title
            const titleElement = document.querySelector('[data-cy="question-title"]') || 
                                 document.querySelector('.css-v3d350') ||
                                 document.querySelector('h1');
            
            const title = titleElement ? titleElement.textContent.trim() : 'Unknown Problem';

            // Extract difficulty
            const difficultyElement = document.querySelector('[diff]') ||
                                    document.querySelector('.css-10o4wqw') ||
                                    document.querySelector('[data-degree]');
            
            let difficulty = 'Unknown';
            if (difficultyElement) {
                const diffText = difficultyElement.textContent.toLowerCase();
                if (diffText.includes('easy')) difficulty = 'Easy';
                else if (diffText.includes('medium')) difficulty = 'Medium';
                else if (diffText.includes('hard')) difficulty = 'Hard';
            }

            // Extract problem description
            const descriptionElement = document.querySelector('[data-track-load="description_content"]') ||
                                      document.querySelector('.content__u3I1') ||
                                      document.querySelector('.question-content');
            
            const description = descriptionElement ? 
                descriptionElement.textContent.trim().substring(0, 500) : '';

            this.problemData = {
                title,
                difficulty,
                description,
                url: window.location.href
            };

            console.log('Student Buddy: Problem detected', this.problemData);
        } catch (error) {
            console.error('Student Buddy: Error extracting problem info', error);
        }
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'getProblemInfo') {
                if (this.problemData) {
                    sendResponse({ success: true, data: this.problemData });
                } else {
                    // Try to extract again if not found
                    this.extractProblemInfo();
                    sendResponse({ 
                        success: !!this.problemData, 
                        data: this.problemData 
                    });
                }
            }
            return true; // Keep message channel open for async response
        });
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LeetCodeDetector();
    });
} else {
    new LeetCodeDetector();
}

// Also initialize on URL changes (SPA navigation)
let currentUrl = window.location.href;
setInterval(() => {
    if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        setTimeout(() => new LeetCodeDetector(), 1000); // Delay for page to load
    }
}, 1000);
