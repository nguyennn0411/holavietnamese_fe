export class Enrollment {
  constructor(data) { Object.assign(this, data) }
  get isEnrolled() {
    return ['ACTIVE', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].includes(this.status)
  }
}
