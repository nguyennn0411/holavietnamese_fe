export class LearningProgress {
  constructor(data) { Object.assign(this, data) }
  get isComplete() { return this.progressPercentage === 100 }
}
