// src/utils/deviceId.ts

export function generateDeviceId(): string {
  // Check if running in Android WebView
  if (typeof window !== 'undefined' && (window as any).androidDeviceId) {
    return (window as any).androidDeviceId
  }
  
  // Check if Android bridge is available
  if (typeof window !== 'undefined' && (window as any).AndroidBridge) {
    try {
      const androidId = (window as any).AndroidBridge.getDeviceId()
      if (androidId) return androidId
    } catch (e) {
      console.error('Failed to get Android device ID:', e)
    }
  }
  
  // Fall back to web fingerprint
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillText('fingerprint', 2, 2)
    }
    
    const fingerprint = canvas.toDataURL()
    const screen = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`
    const nav = navigator.userAgent + navigator.language
    
    const combined = fingerprint + screen + nav
    return hashString(combined)
  }
  
  return ''
}

function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return 'web_' + Math.abs(hash).toString(36)
}

export function getStoredDeviceId(): string | null {
  return localStorage.getItem('device_id')
}

export function setStoredDeviceId(deviceId: string): void {
  localStorage.setItem('device_id', deviceId)
}