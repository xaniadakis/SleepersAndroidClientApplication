#!/bin/bash

npx cap add android;
npx cap build android;
npx cap sync android;
export CAPACITOR_ANDROID_STUDIO_PATH=/programs/android-studio-2021.3.1.17-linux/android-studio/bin/studio.sh;
npx cap open android;
