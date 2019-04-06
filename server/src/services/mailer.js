const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)

/*
 * Sends email
 *
 * @param {String} email Recepient email address
 * @param {String} name Recepient name
 * @param {String} subject Email subject
 * @param {String} text Email body
 * @param {Object} substitutions Substitution data
 *
 * @return Promise
 *
 */
export const sendEmail = (email, name, subject, text, substitutions = {}) => {
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      from: {
        email: process.env.MAIL_FROM,
        name: process.env.MAIL_FROM_NAME
      },
      content: [
        {
          type: 'text/html',
          value: text
        }
      ],
      personalizations: [
        {
          substitutions: substitutions,
          to: [
            {
              email: email,
              name: name
            }
          ],
          reply_to: {
            email: process.env.MAIL_FROM,
            name: process.env.MAIL_FROM_NAME
          },
          subject: subject
        }
      ]
    }
  })

  return new Promise((resolve, reject) => {
    sg.API(request, function(err, resp) {
      if (err) {
        if (err.response && err.response.body && err.response.body.errors) {
          reject(err.response.body.errors)
        } else {
          reject(err)
        }
      } else {
        resolve(resp.body)
      }
    })
  })
}
