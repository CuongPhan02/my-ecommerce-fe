/**
 * Logger Utility
 * Use to log information to the console with beautiful and easy-to-see style.
 * Can block all logs just by changing the ENABLE_LOGS variable.
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// Change to true to enable logs, false to disable logs
const ENABLE_LOGS = !IS_PRODUCTION

const logStyles = {
  info: 'background: #2563eb; color: #f0fdfa; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-family: sans-serif;',
  success:
    'background: #10b981; color: #f0fdfa; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-family: sans-serif;',
  warn: 'background: #f59e0b; color: #f0fdfa; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-family: sans-serif;',
  error:
    'background: #ef4444; color: #f0fdfa; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-family: sans-serif;',
  debug:
    'background: #6b7280; color: #f0fdfa; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-family: sans-serif;',
  label: 'font-weight: bold; color: #f0fdfa;',
}

/**
 * Print styled log to console
 */
const printLog = (
  type: keyof typeof logStyles,
  message: string,
  ...data: any[]
) => {
  if (!ENABLE_LOGS) return

  const style = logStyles[type]
  const label = type.toUpperCase()

  // Format message: [LABEL] message
  console.log(`%c ${label} %c ${message}`, style, logStyles.label, ...data)
}

export const logger = {
  info: (message: string, ...data: any[]) => printLog('info', message, ...data),
  success: (message: string, ...data: any[]) =>
    printLog('success', message, ...data),
  warn: (message: string, ...data: any[]) => printLog('warn', message, ...data),
  error: (message: string, ...data: any[]) =>
    printLog('error', message, ...data),
  debug: (message: string, ...data: any[]) =>
    printLog('debug', message, ...data),

  // Clear console
  clear: () => {
    if (!ENABLE_LOGS) return
    console.clear()
  },
}

// Mặc định export
export default logger
