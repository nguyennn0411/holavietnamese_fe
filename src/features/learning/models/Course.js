export class Course {
  constructor(data) { Object.assign(this, data) }
  get durationLabel() { return `${this.estimatedDuration} min` }
}
