const GLOSSARY_ITEMS: { term: string; definition: string }[] = [
  { term: "Screen lock", definition: "A setting that makes your phone ask for a PIN, passcode, fingerprint, or face before it opens." },
  { term: "PIN", definition: "A short number code (often 4–6 digits) you type to unlock your phone." },
  { term: "Passcode", definition: "Another word for a PIN. Some phones allow a longer code, which can be safer." },
  { term: "Biometrics", definition: "Using your fingerprint or face to unlock your phone." },
  { term: "Fingerprint / Face recognition", definition: "A way to unlock your phone without typing a PIN. Your phone still keeps a PIN as a backup." },
  { term: "Settings", definition: "The place on your phone where you change options like security, privacy, and updates." },
  { term: "App", definition: "A program on your phone (like messages, photos, weather, or games)." },
  { term: "App permissions", definition: "What an app is allowed to use on your phone, like your location, microphone, camera, or photos." },
  { term: "Location", definition: "Your phone's ability to tell where you are (city, neighborhood, or exact spot)." },
  { term: "Microphone", definition: "Lets an app listen to sound. Many apps don't need this." },
  { term: "Camera", definition: "Lets an app take pictures or record video." },
  { term: "Photos / Files access", definition: "Lets an app view or change your photos or saved files." },
  { term: "Notifications", definition: "Alerts that pop up on your screen (like messages, reminders, or warnings)." },
  { term: "Software update / System update", definition: "A phone update that fixes problems and improves safety. Updates often include security fixes." },
  { term: "Wi-Fi", definition: "Wireless internet. Public Wi-Fi (cafés, malls) can be less safe than your home Wi-Fi." },
  { term: "App Store / Play Store", definition: "The official places to get apps: App Store (iPhone), Play Store (Android)." },
  { term: "Password", definition: "A secret word or phrase used to sign in to an account." },
  { term: "Password manager", definition: "An app that stores your passwords safely so you don't have to remember them all." },
  { term: "Master password", definition: "The main password that opens your password manager. This should be strong and private." },
  { term: "2FA / Two-Factor Authentication", definition: "A second step after your password (like a code or approval). It helps protect your account even if someone learns your password." },
  { term: "Phishing", definition: "A scam message that tries to trick you into clicking a link or sharing personal information." },
  { term: "Suspicious link", definition: "A link that may take you to a fake site. If you're unsure, don't click." },
  { term: "\"Verify using official sources\"", definition: "Check using a website or phone number you already trust (for example: the official website you type yourself, or a number on your bill/card)." },
  { term: "Spam / Report", definition: "Marking a message as unwanted or dangerous, so your phone can block similar messages." },
  { term: "Delete", definition: "Removing the message so you don't click it by accident later." },
  { term: "LocalStorage (your site's progress saving)", definition: "A safe way your browser saves your checkmarks on your device so you don't lose progress when you refresh." },
];

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-[#000080]">Glossary</h1>
      

      <dl className="space-y-6">
        {GLOSSARY_ITEMS.map(({ term, definition }) => (
          <div key={term}>
            <dt className="text-lg font-bold text-[#000080]">{term}</dt>
            <dd className="mt-1 text-base text-black">{definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
