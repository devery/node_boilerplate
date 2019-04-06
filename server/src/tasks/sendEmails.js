/**
 * Send emails task
 */
import { sendEmail } from '../controllers/email.controller'
import { createLogger } from '../services/logger'
import Email from '../models/email.model'
import { CREATED, SENDING, SENT, ERROR } from '../constants/emailStatuses'

const logger = createLogger('SendEmailsTask')

const ATTEMPT_DELAY_IN_MS = 30 * 1000
const ATTEMPTS_TO_ERROR = 3

export const TASK_PERIOD_IN_MS = 5 * 1000

export function runTask() {
  Email.find({
    status: CREATED
  }).then(emails => {
    emails = emails.filter(email => {
      return (
        email.attempts === 0 ||
        new Date(email.attemptAt).getTime() + ATTEMPT_DELAY_IN_MS <= Date.now()
      )
    })
    for (let i = 0; i < emails.length; i++) {
      _sendEmail(emails[i])
    }
  })
}

const _sendEmail = email => {
  email.status = SENDING
  email
    .save()
    .then(() => {
      return sendEmail(email.toEmail, email.templateId, email.substitutions)
    })
    .then(() => {
      email.status = SENT
      email.save()
    })
    .catch(err => {
      /***/ logger.warn('Cannot send email cause', err)
      if (++email.attempts >= ATTEMPTS_TO_ERROR) {
        email.status = ERROR
      } else {
        email.status = CREATED
      }
      email.attemptAt = new Date()
      email.save()
    })
}

/***/ logger.info('TASK "Send emails" started..')
setInterval(runTask, TASK_PERIOD_IN_MS)
