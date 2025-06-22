class QA {
    constructor(data = {}) {
        this.id = data.id || '';
        this.question = data.question || '';
        this.answers = data.answers || [];
        this.tags = data.tags || [];
        this.category = data.category || '';
        this.difficulty = data.difficulty || 'easy';
        this.last_updated = data.last_updated || new Date().toISOString();
    }

    // Get primary answer
    getPrimaryAnswer() {
        return this.answers.find(answer => answer.is_primary) || this.answers[0];
    }

    // Get all answers
    getAllAnswers() {
        return this.answers;
    }

    // Check if has multiple answers
    hasMultipleAnswers() {
        return this.answers.length > 1;
    }

    // Get answer by ID
    getAnswerById(answerId) {
        return this.answers.find(answer => answer.id === answerId);
    }

    // Add new answer
    addAnswer(answer) {
        if (!answer.id) {
            answer.id = `ans_${this.id}_${this.answers.length + 1}`;
        }
        this.answers.push(answer);
        this.last_updated = new Date().toISOString();
    }

    // Update answer
    updateAnswer(answerId, updatedAnswer) {
        const index = this.answers.findIndex(answer => answer.id === answerId);
        if (index !== -1) {
            this.answers[index] = { ...this.answers[index], ...updatedAnswer };
            this.last_updated = new Date().toISOString();
            return true;
        }
        return false;
    }

    // Remove answer
    removeAnswer(answerId) {
        const index = this.answers.findIndex(answer => answer.id === answerId);
        if (index !== -1) {
            this.answers.splice(index, 1);
            this.last_updated = new Date().toISOString();
            return true;
        }
        return false;
    }

    // Add tag
    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    }

    // Remove tag
    removeTag(tag) {
        const index = this.tags.indexOf(tag);
        if (index !== -1) {
            this.tags.splice(index, 1);
        }
    }

    // Check if has tag
    hasTag(tag) {
        return this.tags.includes(tag);
    }

    // Validate QA data
    validate() {
        const errors = [];

        if (!this.question || this.question.trim().length === 0) {
            errors.push('Question is required');
        }

        if (!this.answers || this.answers.length === 0) {
            errors.push('At least one answer is required');
        }

        if (!this.category || this.category.trim().length === 0) {
            errors.push('Category is required');
        }

        // Validate answers
        this.answers.forEach((answer, index) => {
            if (!answer.answer || answer.answer.trim().length === 0) {
                errors.push(`Answer ${index + 1} content is required`);
            }
            if (!answer.id) {
                errors.push(`Answer ${index + 1} ID is required`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Convert to plain object
    toJSON() {
        return {
            id: this.id,
            question: this.question,
            answers: this.answers,
            tags: this.tags,
            category: this.category,
            difficulty: this.difficulty,
            last_updated: this.last_updated
        };
    }

    // Create from plain object
    static fromJSON(data) {
        return new QA(data);
    }
}

module.exports = QA; 