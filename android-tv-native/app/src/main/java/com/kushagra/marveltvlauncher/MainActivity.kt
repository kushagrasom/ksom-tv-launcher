package com.kushagra.marveltvlauncher

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.os.Bundle
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayOutputStream

class MainActivity : Activity() {
    private lateinit var webView: WebView

    private val packageReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            webView.post {
                webView.evaluateJavascript("window.onTvPackageChanged && window.onTvPackageChanged()", null)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this)
        setContentView(webView)

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.allowFileAccess = true

        webView.webViewClient = WebViewClient()
        webView.addJavascriptInterface(TvLauncherBridge(this), "AndroidBridge")

        // Load bundled Vite build from assets
        webView.loadUrl("file:///android_asset/dist/index.html")

        // Listen for newly installed/uninstalled TV apps automatically
        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_PACKAGE_ADDED)
            addAction(Intent.ACTION_PACKAGE_REMOVED)
            addDataScheme("package")
        }
        registerReceiver(packageReceiver, filter)
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(packageReceiver)
    }

    inner class TvLauncherBridge(private val context: Context) {

        @JavascriptInterface
        fun getInstalledTvApps(): String {
            val pm: PackageManager = context.packageManager
            val appsArray = JSONArray()

            // Query both Leanback (Android TV) and standard Launcher apps
            val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
                addCategory(Intent.CATEGORY_LEANBACK_LAUNCHER)
            }
            val resolveInfos = pm.queryIntentActivities(mainIntent, 0).toMutableList()

            val stdIntent = Intent(Intent.ACTION_MAIN, null).apply {
                addCategory(Intent.CATEGORY_LAUNCHER)
            }
            resolveInfos.addAll(pm.queryIntentActivities(stdIntent, 0))

            val seenPackages = mutableSetOf<String>()

            for (info in resolveInfos) {
                val pkgName = info.activityInfo.packageName
                if (pkgName == context.packageName || seenPackages.contains(pkgName)) continue
                seenPackages.add(pkgName)

                val appLabel = info.loadLabel(pm).toString()
                val iconDrawable = info.activityInfo.loadBanner(pm) ?: info.loadIcon(pm)
                val iconBase64 = drawableToBase64(iconDrawable)

                val obj = JSONObject().apply {
                    put("appName", appLabel)
                    put("packageName", pkgName)
                    put("iconBase64", "data:image/png;base64,$iconBase64")
                }
                appsArray.put(obj)
            }
            return appsArray.toString()
        }

        @JavascriptInterface
        fun launchApp(packageName: String) {
            val pm = context.packageManager
            val leanbackIntent = pm.getLeanbackLaunchIntentForPackage(packageName)
            val fallbackIntent = pm.getLaunchIntentForPackage(packageName)
            val targetIntent = leanbackIntent ?: fallbackIntent
            targetIntent?.let {
                it.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(it)
            }
        }

        private fun drawableToBase64(drawable: Drawable): String {
            val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 192
            val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 192
            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)
            drawable.setBounds(0, 0, canvas.width, canvas.height)
            drawable.draw(canvas)
            val stream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.PNG, 90, stream)
            return Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP)
        }
    }
}
