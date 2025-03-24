export class Score {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.value = 0;
    }
    
    update(newScore) {
        if (newScore > this.value) {
            this.value = newScore;
            this.display();
        }
    }
    
    display() {
        this.scoreElement.textContent = this.value;
    }
    
    reset() {
        this.value = 0;
        this.display();
    }
} 