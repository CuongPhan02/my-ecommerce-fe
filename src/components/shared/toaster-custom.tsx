'use client'

import React from 'react'
import { Bounce, ToastContainer } from 'react-toastify'

const ToasterCustom = () => {
  const contextClass = {
    default: 'bg-white dark:bg-gray-800',
    info: 'bg-blue-50 dark:bg-blue-900',
    success: 'bg-green-50 dark:bg-green-600',
    warning: 'bg-yellow-50 dark:bg-yellow-600',
    error: 'bg-red-50 dark:bg-red-600',
  }
  return (
    <ToastContainer
      position='top-right'
      autoClose={3000}
      // autoClose={false}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='colored'
      transition={Bounce}
      toastClassName={(context) =>
        contextClass[context?.type || 'default'] +
        ' ' +
        'relative flex pl-4 ml-[23px] pr-[35px] py-3 min-h-[55px] rounded-md justify-between items-center overflow-hidden cursor-pointer opacity-100 mb-2'
      }
    />
  )
}

export default ToasterCustom
