export class Enrollment {
  constructor(data) { Object.assign(this, data) }
  get isEnrolled() { return this.status === 'ACTIVE' || this.status === 'COMPLETED' }
}
