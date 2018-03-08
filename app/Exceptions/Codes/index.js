const exceptions = {
  PENDING_APPLICATION_EXISTS: 'PENDING_APPLICATION_EXISTS',
  APPLICATION_STATUS_ALREADY_SET: 'APPLICATION_STATUS_ALREADY_SET',
  LEGACY_USER_INCOMPLETE: 'LEGACY_USER_INCOMPLETE',
  COMPETENCE_PARAMETERS_INVALID: 'COMPETENCE_PARAMETERS_INVALID',
  AVAILABILITY_PARAMETERS_INVALID: 'AVAILABILITY_PARAMETERS_INVALID',
  CONDITIONS_INVALID: 'CONDITIONS_INVALID',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  USERNAME_NOT_FOUND: 'USERNAME_NOT_FOUND',
  USER_EMAIL_MISSING: 'USER_EMAIL_MISSING',
  USER_UNAUTHORIZED: 'USER_UNAUTHORIZED',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  SSN_NOT_FOUND: 'SSN_NOT_FOUND',
  IDENTIFIERS_MISSING: 'IDENTIFIERS_MISSING',
  CREDENTIALS_INCORRECT: 'CREDENTIALS_INCORRECT'
}

module.exports = Object.freeze(exceptions)
