import Email from '../models/email.model'

const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/*
 * Add email to mailer queue
 *
 * @param {String} toEmail Recepient email address
 * @param {String} templateId Email template
 * @param {Object} [substitutions] Substitution data
 *
 * @return {Promise} Promise resolved with created email model
 *
 */
export function createEmail(toEmail, templateId, substitutions = {}) {
  return new Email({
    toEmail,
    templateId,
    substitutions
  }).save()
}

/*
 * Send email
 *
 * @param {String} toEmail Recepient email address
 * @param {String} templateId Email template
 * @param {Object} [substitutions] Substitution data
 *
 * @return {Promise} Promise resolved with sendgrid response data
 *
 */
export function sendEmail(toEmail, templateId, substitutions = {}) {
  const confurl = `${process.env.SITE_URL}/confirmations/${substitutions.cid}`
  const msg = {
    from: process.env.MAIL_FROM,
    templateId: process.env.MAIL_TEMPLATE_ID_REG,
    subject: 'Confirm Mail',
    substitutionWrappers: ['{{', '}}'],
    dynamic_template_data: {
      confurl,
      email: toEmail
    },
    personalizations: [
      {
        to: {
          name: 'Vladimir',
          email: toEmail
        }
      }
    ]
  }

  sgMail.send(msg)
  // console.log('templateId', templateId, substitutions, toEmail, process.env.MAIL_FROM, process.env.MAIL_FROM_NAME)
  // const request = sg.emptyRequest({
  //   method: 'POST',
  //   path: '/v3/mail/send',
  //   body: {
  //     from: {
  //       email: process.env.MAIL_FROM,
  //       name: process.env.MAIL_FROM_NAME
  //     },
  //     template_id: templateId,
  //     personalizations: [
  //       {
  //         dynamic_template_data: substitutions,
  //         to: [
  //           {
  //             email: toEmail
  //           }
  //         ],
  //         reply_to: {
  //           email: process.env.MAIL_FROM,
  //           name: process.env.MAIL_FROM_NAME
  //         }
  //       }
  //     ]
  //   }
  // })
  //
  // return new Promise((resolve, reject) => {
  //   sg.API(request, function(err, resp) {
  //     if (err) {
  //       if (err.response && err.response.body && err.response.body.errors) {
  //         reject(err.response.body.errors)
  //       } else {
  //         reject(err)
  //       }
  //     } else {
  //       resolve(resp.body)
  //     }
  //   })
  // })
}
