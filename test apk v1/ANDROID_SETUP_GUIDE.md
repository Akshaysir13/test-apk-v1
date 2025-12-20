# Moghe's Institute - Android App Complete Setup Guide

## What You Have Now

I've created a complete Android WebView application with the following features:

### Key Features
1. **Screenshot Blocking** - Uses Android's FLAG_SECURE to prevent screenshots and screen recording
2. **Full Web Functionality** - Loads your entire web portal in a native Android app
3. **App Name** - "Moghe's Institute" (already configured)
4. **Professional UI** - Blue theme matching your brand
5. **Offline Support** - Local storage and caching enabled
6. **Security** - Prevents tampering during tests

### Screenshot Blocking Technology
The app uses `WindowManager.LayoutParams.FLAG_SECURE` which:
- Blocks screenshots (Power + Volume Down)
- Blocks screen recording
- Prevents the app from appearing in recent apps preview
- Shows black screen if someone tries to capture
- Works on all non-rooted Android devices

## Quick Start Guide

### Step 1: Prerequisites
Download and install:
- **Android Studio** (latest version): https://developer.android.com/studio
- Make sure you have at least 8GB RAM and 10GB free space

### Step 2: Import Project into Android Studio

1. **Open Android Studio**
2. Click **"Open"** or **"File" → "Open"**
3. Navigate to the `android` folder in your project directory:
   ```
   mock portal history/android/
   ```
4. Click **"OK"**
5. Wait for **Gradle Sync** to complete (may take 5-10 minutes first time)
   - You'll see progress in the bottom right corner
   - If it fails, click "Try Again" or "Sync Project with Gradle Files"

### Step 3: Configure Your Website URL

**IMPORTANT:** You must update the URL to point to your deployed website.

1. In Android Studio, open: `app/src/main/java/com/moghesinstitute/mocktest/MainActivity.java`
2. Find line 23:
   ```java
   private static final String URL = "https://your-app-url.vercel.app";
   ```
3. Replace with your actual Vercel deployment URL:
   ```java
   private static final String URL = "https://your-actual-url.vercel.app";
   ```
4. Press **Ctrl+S** (Windows/Linux) or **Cmd+S** (Mac) to save

### Step 4: Test the App

#### Option A: Using Android Emulator
1. Click **"Device Manager"** in the right sidebar
2. Click **"Create Device"**
3. Select **"Pixel 5"** or any phone model
4. Click **"Next"**
5. Select **"Tiramisu"** (API 33) or **"UpsideDownCake"** (API 34)
6. Click **"Download"** next to the system image
7. Wait for download, then click **"Next"** → **"Finish"**
8. Click the **green play button** (▶️) in the toolbar
9. The app will install and launch in the emulator

**Note:** Screenshot blocking won't work in emulator - you need a real device to test this.

#### Option B: Using Your Android Phone (Recommended for Testing Screenshot Blocking)
1. Enable **Developer Options** on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - You'll see "You are now a developer!"
2. Enable **USB Debugging**:
   - Go to Settings → System → Developer Options
   - Toggle "USB Debugging" ON
3. Connect your phone to computer via USB cable
4. On your phone, tap **"Allow USB Debugging"** when prompted
5. In Android Studio, select your device from the dropdown (top toolbar)
6. Click the **green play button** (▶️)
7. App will install and launch on your phone

### Step 5: Test Screenshot Blocking

Once the app is running on your **physical phone**:
1. Navigate to any test in the app
2. Try to take a screenshot (Power + Volume Down)
3. You'll see a message: "Couldn't capture screenshot" or "Screenshot blocked"
4. If you manage to take a screenshot, it will appear completely black
5. Try screen recording - the video will show a black screen for the app

### Step 6: Build Release APK for Distribution

When you're ready to share the app:

1. **Clean Build:**
   - Click **"Build" → "Clean Project"**
   - Wait for completion
   - Click **"Build" → "Rebuild Project"**

2. **Generate Signed APK:**
   - Click **"Build" → "Generate Signed Bundle / APK"**
   - Select **"APK"**
   - Click **"Next"**

3. **Create Keystore** (First time only):
   - Click **"Create new..."**
   - **Key store path:** Choose a safe location (e.g., Desktop/moghes-keystore.jks)
   - **Password:** Create a STRONG password (save it safely!)
   - **Confirm password:** Re-enter password
   - **Alias:** moghes-institute
   - **Key password:** Same or different password
   - **Validity (years):** 25 (required for Google Play)
   - **Certificate:**
     - First and Last Name: Your Name
     - Organizational Unit: Moghe's Institute
     - Organization: Moghe's Institute
     - City: Your City
     - State: Your State
     - Country Code: IN (for India)
   - Click **"OK"**

4. **Sign the APK:**
   - Enter keystore password
   - Enter key password
   - Check **"Remember passwords"** (optional but convenient)
   - Click **"Next"**

5. **Build Configuration:**
   - Select **"release"** build variant
   - Check **"V1 (Jar Signature)"**
   - Check **"V2 (Full APK Signature)"**
   - Click **"Finish"**

6. **Locate Your APK:**
   - Android Studio will show: "locate" link in bottom right notification
   - Or manually navigate to: `android/app/release/app-release.apk`
   - This is your installable APK file!

### Step 7: Install APK on Phones

#### Method 1: Direct Transfer
1. Copy `app-release.apk` to the phone
2. Open the file on the phone
3. Tap **"Install"**
4. If prompted, enable **"Install from Unknown Sources"** for your file manager
5. Tap **"Install"** again

#### Method 2: ADB Install (Developer Method)
```bash
adb install app/release/app-release.apk
```

## File Structure Explanation

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/moghesinstitute/mocktest/
│   │       │   └── MainActivity.java          # Main app code with screenshot blocking
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml      # WebView layout
│   │       │   ├── values/
│   │       │   │   ├── strings.xml            # App name: "Moghe's Institute"
│   │       │   │   └── themes.xml             # Blue theme colors
│   │       │   └── xml/
│   │       │       └── network_security_config.xml  # Network settings
│   │       └── AndroidManifest.xml            # App configuration & permissions
│   ├── build.gradle                           # App build configuration
│   └── proguard-rules.pro                     # Code obfuscation rules
├── gradle/                                     # Gradle wrapper files
├── build.gradle                                # Project build configuration
├── settings.gradle                             # Project settings
└── gradle.properties                           # Gradle properties

```

## Understanding the Code

### MainActivity.java - Key Features

**Screenshot Blocking:**
```java
private void blockScreenshots() {
    getWindow().setFlags(
        WindowManager.LayoutParams.FLAG_SECURE,
        WindowManager.LayoutParams.FLAG_SECURE
    );
}
```

**WebView Setup:**
```java
webSettings.setJavaScriptEnabled(true);        // Required for your React app
webSettings.setDomStorageEnabled(true);        // Local storage for test data
webSettings.setCacheMode(WebSettings.LOAD_DEFAULT); // Offline support
```

**Back Button Handling:**
- If there's web history → goes back in browser
- If no history → shows exit confirmation dialog

## Customization Options

### Change App Icon
1. Right-click on `app` folder
2. Select **"New" → "Image Asset"**
3. Choose **"Launcher Icons"**
4. Upload your logo image
5. Click **"Next" → "Finish"**

### Change Theme Colors
Edit `app/src/main/res/values/themes.xml`:
```xml
<item name="colorPrimary">#2563EB</item>        <!-- Main blue color -->
<item name="colorPrimaryDark">#1E40AF</item>    <!-- Dark blue -->
<item name="colorAccent">#2563EB</item>         <!-- Accent color -->
```

### Change Package Name
1. In Android Studio, right-click on the package folder
2. Select **"Refactor" → "Rename"**
3. Choose **"Rename Package"**
4. Enter new package name
5. Update in build.gradle and AndroidManifest.xml

## Publishing to Google Play Store

### Prerequisites
- Google Play Console account ($25 one-time fee)
- Signed release APK (from Step 6)
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- Screenshots (at least 2, recommended 5-8)
- Privacy policy URL

### Steps
1. Go to https://play.google.com/console
2. Create new app
3. Fill in app details:
   - **App name:** Moghe's Institute
   - **Category:** Education
   - **Content rating:** Everyone
4. Upload signed APK/AAB
5. Add store listing:
   - Short description (80 chars)
   - Full description (4000 chars)
   - Screenshots
   - Feature graphic
6. Set pricing: Free or Paid
7. Select countries
8. Submit for review (takes 1-3 days)

## Troubleshooting

### Problem: Gradle Sync Failed
**Solution:**
- Update Android Studio: Help → Check for Updates
- File → Invalidate Caches → Invalidate and Restart
- Check internet connection

### Problem: Website Not Loading
**Solution:**
- Verify URL in MainActivity.java
- Check internet permission in AndroidManifest.xml
- Test URL in phone browser first

### Problem: Screenshot Blocking Not Working
**Solution:**
- Must test on physical device (not emulator)
- Check that FLAG_SECURE is called in onCreate
- Some custom ROMs may bypass this (rare)

### Problem: App Crashes on Launch
**Solution:**
- Check Logcat for error messages (bottom panel in Android Studio)
- Verify all permissions in AndroidManifest.xml
- Ensure URL is valid and accessible

### Problem: Can't Install APK on Phone
**Solution:**
- Enable "Install Unknown Apps" for your file manager
- Settings → Apps → Special Access → Install Unknown Apps
- Select your file manager and enable

## Testing Checklist

Before releasing:
- [ ] Test on at least 3 different devices
- [ ] Test with different Android versions (7.0+)
- [ ] Verify screenshot blocking works
- [ ] Test all test-taking features
- [ ] Test login/logout
- [ ] Test with slow internet
- [ ] Test in airplane mode (offline behavior)
- [ ] Test back button navigation
- [ ] Test app rotation (portrait/landscape)
- [ ] Verify app icon and name appear correctly

## Security Notes

### What's Protected:
- Screenshots blocked (FLAG_SECURE)
- Screen recording blocked
- Recent apps preview blocked
- Copy/paste within WebView controlled by web app
- Tab switching detection from web app

### What's NOT Protected:
- Rooted devices (can bypass screenshot protection)
- Camera photos of the screen (physical security needed)
- Second device screen capture

### Additional Security Recommendations:
1. Use HTTPS for your website (already done with Vercel)
2. Implement backend validation for test submissions
3. Use Supabase RLS policies (already configured)
4. Consider adding device fingerprinting
5. Monitor violation logs in admin panel

## Performance Optimization

Already implemented:
- Minify enabled for release builds
- ProGuard configuration for code obfuscation
- Resource shrinking to reduce APK size
- WebView caching for faster loading
- Progress indicators for better UX

## Updates and Maintenance

### Updating the App:
1. Make changes to web app → deploy to Vercel
2. No app update needed (WebView loads latest website)

### When You Need New APK:
- Changing app icon
- Changing app name
- Adding new Android features
- Updating package name
- Fixing native bugs

### Version Management:
In `app/build.gradle`:
```gradle
versionCode 1      // Increment for each release (1, 2, 3...)
versionName "1.0"  // User-visible version (1.0, 1.1, 2.0...)
```

## Support Resources

- **Android Developer Docs:** https://developer.android.com/docs
- **Stack Overflow:** Tag your questions with `android` and `webview`
- **Gradle Issues:** https://gradle.org/help/

## Next Steps

1. Import project into Android Studio
2. Update URL in MainActivity.java
3. Test on your phone
4. Verify screenshot blocking works
5. Add your app icon
6. Build signed APK
7. Distribute to students or publish to Play Store

## Important Files to Keep Safe

**CRITICAL - Never lose these:**
- Keystore file (moghes-keystore.jks or whatever you named it)
- Keystore password
- Key alias (moghes-institute)
- Key password

**Without these, you CANNOT update your app on Google Play Store!**

Store them:
- In a password manager
- On secure cloud storage
- On an external drive
- In multiple safe locations

## Questions or Issues?

If you encounter any problems:
1. Check the Troubleshooting section above
2. Review Android Studio's Logcat for error messages
3. Ensure all steps were followed correctly
4. Test on multiple devices

Your Android app is now ready to use!
