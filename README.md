Install npm modules

```bash
npm install
```

To run development server:

```bash
npm run dev
```

Example .env file

```bash
#FIREBASE
NEXT_FIREBASE_API_KEY=AIzaSyC**************************
NEXT_FIREBASE_AUTH_DOMAIN=nioblue.firebaseapp.com
NEXT_FIREBASE_DATABASE_URL=https://nioblue-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nio******
NEXT_FIREBASE_STORAGE_BUCKET=niob**.appspot.com
NEXT_FIREBASE_MESSAGING_SENDER_ID=59******15606
NEXT_FIREBASE_APP_ID=1:59*************e72ba13d35a1b7
NEXT_FIREBASE_MEASUREMENT_ID=G-JG*******

# SIGNALLING SERVER URL
NEXT_PUBLIC_SIGNALLING_SERVER_URL=https://nios****er.ga******.com:8080/
```

This application is develped to receive data from the ROV and make connection to the companion mobile application possible. This application should be run in the same machine where the ROV is connected.
Once ROV is connected follow the instruction from the startup manual to ensure smooth operation of this application.
