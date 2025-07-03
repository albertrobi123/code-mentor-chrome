
class LeetCodeDetector {
    constructor() {
        this.problemData = null;
        this.init();
    }

    init() {
        // Wait for page to load then extract problem info
        setTimeout(() => {
            this.extractProblemInfo();
        }, 2000);
        this.setupMessageListener();
    }

    extractProblemInfo() {
        try {
            console.log('Student Buddy: Attempting to extract problem info...');
            
            // Try multiple selectors for problem title
            const titleSelectors = [
                'h1[data-cy="question-title"]',
                '[data-cy="question-title"]',
                'h1.text-title-large',
                'h1.mr-2',
                '.css-v3d350',
                'h1',
                '.question-title h1',
                '.question-title'
            ];
            
            let titleElement = null;
            let title = 'Unknown Problem';
            
            for (const selector of titleSelectors) {
                titleElement = document.querySelector(selector);
                if (titleElement && titleElement.textContent.trim()) {
                    title = titleElement.textContent.trim();
                    // Remove any numbering prefix like "1. Two Sum" -> "Two Sum"
                    title = title.replace(/^\d+\.\s*/, '');
                    console.log('Student Buddy: Found title with selector:', selector, title);
                    break;
                }
            }

            // Try multiple selectors for difficulty
            const difficultySelectors = [
                '[data-degree]',
                '.text-difficulty-easy',
                '.text-difficulty-medium', 
                '.text-difficulty-hard',
                '[class*="difficulty"]',
                '.css-10o4wqw',
                '[diff]'
            ];
            
            let difficulty = 'Unknown';
            
            for (const selector of difficultySelectors) {
                const diffElement = document.querySelector(selector);
                if (diffElement) {
                    const diffText = diffElement.textContent.toLowerCase();
                    if (diffText.includes('easy')) {
                        difficulty = 'Easy';
                        break;
                    } else if (diffText.includes('medium')) {
                        difficulty = 'Medium';
                        break;
                    } else if (diffText.includes('hard')) {
                        difficulty = 'Hard';
                        break;
                    }
                    console.log('Student Buddy: Found difficulty element:', diffElement.textContent);
                }
            }

            // Also try to find difficulty by class names
            if (difficulty === 'Unknown') {
                if (document.querySelector('.text-difficulty-easy, [class*="easy"]')) {
                    difficulty = 'Easy';
                } else if (document.querySelector('.text-difficulty-medium, [class*="medium"]')) {
                    difficulty = 'Medium';
                } else if (document.querySelector('.text-difficulty-hard, [class*="hard"]')) {
                    difficulty = 'Hard';
                }
            }

            // Extract problem description
            const descriptionSelectors = [
                '[data-track-load="description_content"]',
                '.content__u3I1',
                '.question-content',
                '[class*="content"]',
                '.elfjS'
            ];
            
            let description = '';
            for (const selector of descriptionSelectors) {
                const descElement = document.querySelector(selector);
                if (descElement && descElement.textContent.trim()) {
                    description = descElement.textContent.trim().substring(0, 1000);
                    break;
                }
            }

            this.problemData = {
                title,
                difficulty,
                description,
                url: window.location.href
            };

            console.log('Student Buddy: Problem detected', this.problemData);
        } catch (error) {
            console.error('Student Buddy: Error extracting problem info', error);
            // Fallback data
            this.problemData = {
                title: 'LeetCode Problem',
                difficulty: 'Unknown',
                description: 'Problem detected on LeetCode',
                url: window.location.href
            };
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
        setTimeout(() => new LeetCodeDetector(), 2000); // Delay for page to load
    }
}, 1000);
