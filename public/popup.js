
class StudentBuddyPopup {
    constructor() {
        this.hints = [];
        this.currentHintIndex = 0;
        this.apiKey = '';
        this.init();
    }

    async init() {
        await this.loadApiKey();
        await this.checkLeetCodePage();
        this.setupEventListeners();
    }

    async loadApiKey() {
        const result = await chrome.storage.local.get(['hf_api_key']);
        this.apiKey = result.hf_api_key || '';
        
        if (!this.apiKey) {
            document.getElementById('api-key-section').style.display = 'block';
        } else {
            document.getElementById('api-key-section').style.display = 'none';
        }
    }

    setupEventListeners() {
        document.getElementById('get-hint-btn').addEventListener('click', () => {
            this.getNextHint();
        });

        document.getElementById('save-key-btn').addEventListener('click', () => {
            this.saveApiKey();
        });
    }

    async saveApiKey() {
        const keyInput = document.getElementById('api-key-input');
        const key = keyInput.value.trim();
        
        if (!key.startsWith('hf_')) {
            this.showError('Please enter a valid Hugging Face API key (starts with hf_)');
            return;
        }

        await chrome.storage.local.set({ hf_api_key: key });
        this.apiKey = key;
        document.getElementById('api-key-section').style.display = 'none';
        this.showError('API key saved successfully!');
        setTimeout(() => document.getElementById('error-message').style.display = 'none', 2000);
    }

    async checkLeetCodePage() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('leetcode.com/problems/')) {
                document.getElementById('not-leetcode').style.display = 'block';
                return;
            }

            // Get problem info from content script
            const response = await chrome.tabs.sendMessage(tab.id, { action: 'getProblemInfo' });
            
            if (response && response.success) {
                this.displayProblemInfo(response.data);
                document.getElementById('leetcode-detected').style.display = 'block';
            } else {
                this.showError('Could not detect LeetCode problem. Please refresh the page.');
            }
        } catch (error) {
            console.error('Error checking LeetCode page:', error);
            this.showError('Error connecting to LeetCode page.');
        }
    }

    displayProblemInfo(problemData) {
        document.getElementById('problem-title').textContent = problemData.title || 'Unknown Problem';
        
        const difficultyBadge = document.getElementById('problem-difficulty');
        const difficulty = problemData.difficulty || 'unknown';
        difficultyBadge.textContent = difficulty;
        difficultyBadge.className = `difficulty-badge difficulty-${difficulty.toLowerCase()}`;
    }

    async getNextHint() {
        if (!this.apiKey) {
            this.showError('Please enter your Hugging Face API key first.');
            return;
        }

        const button = document.getElementById('get-hint-btn');
        const loading = document.getElementById('loading');
        
        button.disabled = true;
        loading.style.display = 'flex';

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const response = await chrome.tabs.sendMessage(tab.id, { action: 'getProblemInfo' });
            
            if (!response || !response.success) {
                throw new Error('Could not get problem information');
            }

            const hint = await this.generateHint(response.data, this.currentHintIndex);
            this.addHintToUI(hint);
            this.currentHintIndex++;
            
            // Update button text
            if (this.currentHintIndex >= 3) {
                button.textContent = 'Max hints reached';
                button.disabled = true;
            } else {
                button.textContent = `Get Hint ${this.currentHintIndex + 1}`;
            }
            
        } catch (error) {
            console.error('Error getting hint:', error);
            this.showError('Failed to generate hint. Please try again.');
        } finally {
            loading.style.display = 'none';
            if (this.currentHintIndex < 3) {
                button.disabled = false;
            }
        }
    }

    async generateHint(problemData, hintLevel) {
        const prompts = [
            `Give a subtle hint for this LeetCode problem without revealing the solution. Focus on the approach or data structure to consider: "${problemData.title}"`,
            `Give a more specific hint about the algorithm or technique needed for: "${problemData.title}". Don't give the complete solution.`,
            `Provide the final hint about implementation details for: "${problemData.title}". Guide towards the solution without writing code.`
        ];

        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompts[hintLevel] || prompts[0],
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7,
                    return_full_text: false
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data[0]?.generated_text || `Hint ${hintLevel + 1}: Consider the problem step by step. What data structure would be most efficient here?`;
    }

    addHintToUI(hintText) {
        const container = document.getElementById('hints-container');
        const hintCard = document.createElement('div');
        hintCard.className = 'hint-card';
        hintCard.innerHTML = `
            <div class="hint-number">Hint ${this.currentHintIndex + 1}</div>
            <div class="hint-text">${hintText}</div>
        `;
        container.appendChild(hintCard);
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudentBuddyPopup();
});
