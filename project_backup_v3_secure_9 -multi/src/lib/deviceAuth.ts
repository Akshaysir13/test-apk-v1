// src/lib/deviceAuth.ts

import { supabase } from './supabase'
import { generateDeviceId, getStoredDeviceId, setStoredDeviceId } from '../utils/deviceId'

export async function validateDevice(userId: string): Promise<{
  success: boolean
  message?: string
  deviceId?: string
}> {
  try {
    let deviceId = getStoredDeviceId()
    
    if (!deviceId) {
      deviceId = generateDeviceId()
      setStoredDeviceId(deviceId)
    }

    // Check if this device is registered for this user
    const { data: existingDevice, error: fetchError } = await supabase
      .from('user_devices')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    // No device registered yet - register this one
    if (!existingDevice) {
      const { error: insertError } = await supabase
        .from('user_devices')
        .insert({
          user_id: userId,
          device_id: deviceId,
          device_type: deviceId.startsWith('web_') ? 'web' : 'android',
          device_info: {
            userAgent: navigator.userAgent,
            screen: `${window.screen.width}x${window.screen.height}`
          }
        })

      if (insertError) throw insertError

      return {
        success: true,
        message: 'Device registered successfully',
        deviceId
      }
    }

    // Device already registered - check if it matches
    if (existingDevice.device_id === deviceId) {
      // Update last active time
      await supabase
        .from('user_devices')
        .update({ last_active: new Date().toISOString() })
        .eq('user_id', userId)

      return {
        success: true,
        message: 'Device validated',
        deviceId
      }
    }

    // Different device trying to login
    return {
      success: false,
      message: 'This account is already registered on another device. Please contact admin to reset your device.'
    }

  } catch (error) {
    console.error('Device validation error:', error)
    return {
      success: false,
      message: 'Device validation failed'
    }
  }
}