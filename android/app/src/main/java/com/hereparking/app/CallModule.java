package com.hereparking.app;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

public class CallModule extends ReactContextBaseJavaModule {
    Context mContext;

    public CallModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "CallModule";
    }

    @ReactMethod
    public void call(String phoneNumber) {
        Intent mIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("tel:" + phoneNumber));
        mContext.startActivity(mIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
    }
}
