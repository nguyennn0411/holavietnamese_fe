export class Lesson {
  constructor(data) { Object.assign(this, data) }
  get isCompleted() { return this.learningStatus === 'COMPLETED' }
}
