#!/bin/bash

start=$(date +%s)

export CAPACITOR_ANDROID_STUDIO_PATH=/programs/android-studio-2021.3.1.17-linux/android-studio/bin/studio.sh;
npm run build;
ionic cap build android --prod --release;
npx cap sync android;
npx cap open android;

end=$(date +%s)
echo "Redeploying took $((end-start))s and finished at $(date +"%H:%M:%S")"
