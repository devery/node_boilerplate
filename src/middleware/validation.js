import Promise from 'bluebird'
import { check as checkApi, body, param, query, validationResult } from 'express-validator/check'
import mongoose from 'mongoose'

/**
 * Wrapper for "express-validator" check api.
 * Adds error status and custom validators:
 *  - isObjectId - check if string is mongo object id
 */
export const check = (field, errorText) => {
  const middleware = checkApi(field, errorText)
  middleware.isObjectId = () => {
    return middleware.custom(objectIdValidator)
  }
  return middleware
}

/**
 * Wrapper for "express-validator" check body api.
 * Adds error status and custom validators:
 *  - isObjectId - check if string is mongo object id
 */
export const checkBody = (field, errorText) => {
  const middleware = body(field, errorText)
  middleware.isObjectId = () => {
    return middleware.custom(objectIdValidator)
  }
  return middleware
}

/**
 * Wrapper for "express-validator" check param api.
 * Adds error status and custom validators:
 *  - isObjectId - check if string is mongo object id
 */
export const checkParam = (field, errorText) => {
  const middleware = param(field, errorText)
  middleware.isObjectId = () => {
    return middleware.custom(objectIdValidator)
  }
  return middleware
}

/**
 * Wrapper for "express-validator" check query api.
 * Adds error status and custom validators:
 *  - isObjectId - check if string is mongo object id
 */
export const checkQuery = (field, errorText) => {
  const middleware = query(field, errorText)
  middleware.isObjectId = () => {
    return middleware.custom(objectIdValidator)
  }
  return middleware
}

/**
 * Runs validators one by one. Sends error response if someone validators failed.
 */
export const validate = validators => {
  return (req, res, next) => {
    let validationError
    Promise.map(
      validators,
      validator => {
        return new Promise((resolve, reject) => {
          validator(req, res, () => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
              validationError = {
                msg: errors.array()[0].msg,
                status: validator._context.errorStatus
              }
              return reject()
            }
            return resolve()
          })
        })
      },
      { concurrency: 0 }
    )
      .then(() => {
        next()
      })
      .catch(err => {
        if (validationError) {
          res.sendError(validationError.msg, validationError.status)
        } else {
          res.sendError(err)
        }
      })
  }
}

const objectIdValidator = value => {
  return mongoose.Types.ObjectId.isValid(value)
}
