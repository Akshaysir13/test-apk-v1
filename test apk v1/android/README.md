# Moghe's Institute - Android App Setup Guide

## Overview
This is a WebView-based Android application for the JEE B.Arch Mock Test Portal with built-in screenshot blocking functionality.

## Features
- **Screenshot Blocking**: Prevents users from taking screenshots during tests (FLAG_SECURE)
- **WebView Integration**: Full web functionality in a native Android app
- **Offline Support**: Local storage and caching enabled
- **Progress Indicator**: Loading bar for better UX
- **Exit Confirmation**: Prevents accidental app closure

## Prerequisites
- Android Studio Arctic Fox or later
- Android SDK 24 (Android 7.0) or higher
- Java 8 or higher

## Import Instructions

### Step 1: Import into Android Studio
1. Open Android Studio
2. Click "File" → "Open"
3. Navigate to the `android` folder in this project
4. Click "OK" to import the project
5. Wait for Gradle sync to complete

### Step 2: Configure Your Web URL
Open `MainActivity.java` and update the URL:
```java
private static final String URL = "https://your-deployed-app-url.vercel.app";
```
Replace with your actual deployed Vercel URL.

### Step 3: Add App Icons
1. Right-click on `app` → "New" → "Image Asset"
2. Choose "Launcher Icons (Adaptive and Legacy)"
3. Upload your app icon
4. Click "Next" then "Finish"

### Step 4: Build the App

#### For Testing (Debug Build):
1. Connect your Android device via USB or start an emulator
2. Click "Run" (green play button) or press Shift+F10
3. Select your device
4. The app will install and launch automatically

#### For Release (Production Build):
1. Click "Build" → "Generate Signed Bundle / APK"
2. Choose "APK" and click "Next"
3. Create a new keystore or use an existing one:
   - Keystore path: Choose a location to save
   - Password: Create a strong password
   - Key alias: `moghesinstitute`
   - Key password: Create a strong password
   - Validity: 25 years minimum (for Play Store)
   - Certificate info: Fill in your organization details
4. Click "Next"
5. Select "release" build variant
6. Check both signature versions (V1 and V2)
7. Click "Finish"
8. APK will be generated in `app/release/app-release.apk`

## Key Security Features

### 1. Screenshot Blocking
```java
getWindow().setFlags(
    WindowManager.LayoutParams.FLAG_SECURE,
    WindowManager.LayoutParams.FLAG_SECURE
);
```
This prevents:
- Screenshots
- Screen recording
- Screen sharing
- Recent apps preview

### 2. Secure WebView Configuration
- JavaScript enabled for full app functionality
- DOM storage for test state persistence
- Mixed content allowed for compatibility
- Cache enabled for offline support

## App Configuration

### Package Name
`com.moghesinstitute.mocktest`

### App Name
Moghe's Institute

### Minimum SDK
Android 7.0 (API 24)

### Target SDK
Android 14 (API 34)

## Permissions Required
- **INTERNET**: Required for loading web content
- **ACCESS_NETWORK_STATE**: To check connectivity
- **WRITE_EXTERNAL_STORAGE**: For caching (Android 9 and below)

## Troubleshooting

### Issue: App doesn't load the website
**Solution**:
- Check the URL in MainActivity.java
- Ensure your device has internet connection
- Verify the website is accessible in a browser

### Issue: Gradle sync fails
**Solution**:
- Update Android Studio to the latest version
- File → Invalidate Caches → Invalidate and Restart
- Update Gradle version in gradle-wrapper.properties

### Issue: Screenshot blocking not working
**Solution**:
- FLAG_SECURE only works on physical devices, not emulators
- Test on a real Android phone
- Some rooted devices may bypass this protection

### Issue: WebView shows blank page
**Solution**:
- Check internet permissions in AndroidManifest.xml
- Verify network_security_config.xml is properly configured
- Check logcat for JavaScript errors

## Testing Screenshot Blocking

1. Install the app on a physical device
2. Navigate to the test screen
3. Try to take a screenshot using:
   - Power + Volume Down
   - Screenshots will appear black/blank
4. Try screen recording:
   - Recording will show a black screen for the app

## Publishing to Google Play Store

1. Generate a release APK (see Step 4 above)
2. Create a Google Play Console account
3. Create a new app listing
4. Upload your APK/AAB
5. Fill in app details:
   - Title: Moghe's Institute
   - Description: JEE B.Arch Mock Test Portal
   - Category: Education
   - Content rating: Everyone
6. Add screenshots (5-8 recommended)
7. Submit for review

## Important Notes

- **Keep your keystore safe**: Without it, you cannot update your app
- **Test thoroughly**: Always test on multiple devices before release
- **Update regularly**: Keep dependencies and SDK versions updated
- **Monitor crashes**: Use Firebase Crashlytics or Google Play Console

## Support

For issues or questions:
- Check the main project README.md
- Review Android Studio logcat for errors
- Test on multiple devices and Android versions

## Version History

**Version 1.0**
- Initial release
- WebView integration
- Screenshot blocking
- Basic navigation and loading indicators
