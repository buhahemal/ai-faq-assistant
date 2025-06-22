const fs = require('fs').promises;
const path = require('path');

class QAEngine {
    constructor() {
        this.embedder = null;
        this.qaPairs = [];
        this.questionEmbeddings = [];
        this.isInitialized = false;
        this.qaDataPath = path.join(__dirname, 'qa_data.json');
    }

    async loadQAData() {
        try {
            console.log('Loading QA data from JSON file...');
            const data = await fs.readFile(this.qaDataPath, 'utf8');
            const qaData = JSON.parse(data);
            this.qaPairs = qaData.qa_pairs;
            console.log(`Loaded ${this.qaPairs.length} QA pairs with ${qaData.metadata.total_answers} total answers`);
            return qaData;
        } catch (error) {
            console.error('Error loading QA data:', error);
            throw new Error('Failed to load QA data from JSON file');
        }
    }

    async initialize() {
        try {
            console.log('Loading embedding model...');
            const { pipeline } = await import('@xenova/transformers');
            this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            
            // Load QA data from JSON file
            await this.loadQAData();
            
            console.log('Generating embeddings for QA pairs...');
            await this.generateQuestionEmbeddings();
            
            this.isInitialized = true;
            console.log('QA Engine initialized successfully');
        } catch (error) {
            console.error('Error initializing QA Engine:', error);
            throw error;
        }
    }

    async generateQuestionEmbeddings() {
        this.questionEmbeddings = [];
        
        for (const qaPair of this.qaPairs) {
            const embedding = await this.getEmbedding(qaPair.question);
            this.questionEmbeddings.push({
                id: qaPair.id,
                question: qaPair.question,
                answers: qaPair.answers,
                tags: qaPair.tags,
                category: qaPair.category,
                embedding: embedding
            });
        }
    }

    async getEmbedding(text) {
        const output = await this.embedder(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    cosineSimilarity(vecA, vecB) {
        if (vecA.length !== vecB.length) {
            throw new Error('Vectors must have the same length');
        }

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);

        if (normA === 0 || normB === 0) {
            return 0;
        }

        return dotProduct / (normA * normB);
    }

    async findBestMatch(userQuestion) {
        if (!this.isInitialized) {
            throw new Error('QA Engine not initialized');
        }

        const userEmbedding = await this.getEmbedding(userQuestion);
        let bestMatch = null;
        let bestScore = -1;

        for (const qaEmbedding of this.questionEmbeddings) {
            const similarity = this.cosineSimilarity(userEmbedding, qaEmbedding.embedding);
            
            if (similarity > bestScore) {
                bestScore = similarity;
                
                // Find the primary answer (or first answer if no primary)
                const primaryAnswer = qaEmbedding.answers.find(ans => ans.is_primary) || qaEmbedding.answers[0];
                
                bestMatch = {
                    id: qaEmbedding.id,
                    question: qaEmbedding.question,
                    answer: primaryAnswer.answer,
                    answer_id: primaryAnswer.id,
                    all_answers: qaEmbedding.answers,
                    confidence: similarity,
                    category: qaEmbedding.category,
                    tags: qaEmbedding.tags
                };
            }
        }

        return bestMatch;
    }

    async findBestMatchWithAllAnswers(userQuestion) {
        if (!this.isInitialized) {
            throw new Error('QA Engine not initialized');
        }

        const userEmbedding = await this.getEmbedding(userQuestion);
        let bestMatch = null;
        let bestScore = -1;

        for (const qaEmbedding of this.questionEmbeddings) {
            const similarity = this.cosineSimilarity(userEmbedding, qaEmbedding.embedding);
            
            if (similarity > bestScore) {
                bestScore = similarity;
                
                bestMatch = {
                    id: qaEmbedding.id,
                    question: qaEmbedding.question,
                    answers: qaEmbedding.answers,
                    confidence: similarity,
                    category: qaEmbedding.category,
                    tags: qaEmbedding.tags
                };
            }
        }

        return bestMatch;
    }

    async searchByCategory(category) {
        if (!this.isInitialized) {
            throw new Error('QA Engine not initialized');
        }

        return this.qaPairs.filter(qa => qa.category === category);
    }

    async searchByTags(tags) {
        if (!this.isInitialized) {
            throw new Error('QA Engine not initialized');
        }

        const tagSet = new Set(tags);
        return this.qaPairs.filter(qa => 
            qa.tags.some(tag => tagSet.has(tag))
        );
    }

    async getQAPairById(id) {
        if (!this.isInitialized) {
            throw new Error('QA Engine not initialized');
        }

        return this.qaPairs.find(qa => qa.id === id);
    }

    async reloadQAData() {
        try {
            console.log('Reloading QA data...');
            await this.loadQAData();
            await this.generateQuestionEmbeddings();
            console.log('QA data reloaded successfully');
        } catch (error) {
            console.error('Error reloading QA data:', error);
            throw error;
        }
    }

    isReady() {
        return this.isInitialized;
    }

    getQAPairs() {
        return this.qaPairs;
    }

    getCategories() {
        const categories = [...new Set(this.qaPairs.map(qa => qa.category))];
        return categories;
    }

    getTags() {
        const allTags = this.qaPairs.flatMap(qa => qa.tags);
        const uniqueTags = [...new Set(allTags)];
        return uniqueTags;
    }

    getStats() {
        const totalAnswers = this.qaPairs.reduce((sum, qa) => sum + qa.answers.length, 0);
        const categories = this.getCategories();
        const tags = this.getTags();
        
        return {
            total_questions: this.qaPairs.length,
            total_answers: totalAnswers,
            categories: categories,
            unique_tags: tags.length,
            average_answers_per_question: (totalAnswers / this.qaPairs.length).toFixed(2)
        };
    }
}

module.exports = QAEngine; 