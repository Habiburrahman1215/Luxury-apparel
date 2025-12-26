
'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1A1A1A',
          color: '#F7F6F3',
          padding: '16px',
          borderRadius: '0',
        },
        success: {
          iconTheme: {
            primary: '#B6A26A',
            secondary: '#F7F6F3',
          },
        },
      }}
    />
  )
}