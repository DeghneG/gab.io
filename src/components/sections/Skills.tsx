"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillCategories, type Skill } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ───────────────────────────────────────────────────────────
 * TWEAKABLE CONFIGURATION VALUES
 * ───────────────────────────────────────────────────────────
 */
export const SKILLS_CONFIG = {
  // Disc dimensions (px)
  featuredDiscSize: 80, // Size for Frontend tile
  standardDiscSize: 64, // Size for Backend, Tools, AIs tiles

  // Groove styling on skill discs
  grooveContrast: 0.045, // Groove rings opacity (0.01 - 0.15)
  sheenOpacity: 0.08, // Diagonal light reflection opacity (0.04 - 0.15)

  // Giant decorative record in right margin
  giantRecordSize: 900, // Diameter in px
  giantRecordCropPercent: 55, // % of diameter off-screen to the right
  giantRecordGrooveOpacity: 0.4, // Groove opacity on giant record (0.1 - 0.8)
  giantRecordSpinDuration: 60, // Full revolution duration in seconds (ultra-slow)
};

/** Color map: data token → real hex for inline styles */
const colorHex = {
  teal: "#2BAF90",
  mint: "#A1D4B1",
  mustard: "#F1A512",
  orange: "#DD4111",
  wine: "#8C0027",
  cream: "#F5F0E8",
};

/* ───────────────────────────────────────────────────────────
   TECHNOLOGY ICONS (Exact artwork preserved)
   ─────────────────────────────────────────────────────────── */
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function ReactIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-11.5 -10.23 23 20.46"
      className={className}
      aria-hidden="true"
    >
      <circle cx="0" cy="0" r="2.2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function NextjsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
    </svg>
  );
}

function TypeScriptIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
    </svg>
  );
}

function TailwindIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
    </svg>
  );
}

function PythonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.914 0C5.82 0 6.188 2.643 6.188 2.643l.006 2.738h5.836v.834H3.854S0 5.754 0 11.885c0 6.13 3.36 5.922 3.36 5.922h2.004v-2.805s-.108-3.36 3.308-3.36h5.707s3.2 0 3.2-3.145V2.643S18.01 0 11.914 0zm-3.25 1.706a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1zM12.086 24c6.094 0 5.726-2.643 5.726-2.643l-.006-2.738H11.97v-.834h8.176S24 18.246 24 12.115c0-6.13-3.36-5.922-3.36-5.922h-2.004v2.805s.108 3.36-3.308 3.36H9.62s-3.2 0-3.2 3.145v5.852S5.99 24 12.086 24zm3.25-1.706a1.05 1.05 0 1 1 0-2.1 1.05 1.05 0 0 1 0 2.1z" />
    </svg>
  );
}

function SupabaseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z" />
    </svg>
  );
}

function WordPressIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0" />
    </svg>
  );
}

function VercelIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 1.608 12 20.784H0Z" />
    </svg>
  );
}

function CanvaIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM6.962 7.68c.754 0 1.337.549 1.405 1.2.069.583-.171 1.097-.822 1.406-.343.171-.48.172-.549.069-.034-.069 0-.137.069-.206.617-.514.617-.926.548-1.508-.034-.378-.308-.618-.583-.618-1.2 0-2.914 2.674-2.674 4.629.103.754.549 1.646 1.509 1.646.308 0 .65-.103.96-.24.5-.264.799-.47 1.097-.8-.073-.885.704-2.046 1.851-2.046.515 0 .926.205.96.583.068.514-.377.582-.514.582s-.378-.034-.378-.17c-.034-.138.309-.07.275-.378-.035-.206-.24-.274-.446-.274-.72 0-1.131.994-1.029 1.611.035.275.172.549.447.549.205 0 .514-.31.617-.755.068-.308.343-.514.583-.514.102 0 .17.034.205.171v.138c-.034.137-.137.548-.102.651 0 .069.034.171.17.171.092 0 .436-.18.777-.459.117-.59.253-1.298.253-1.357.034-.24.137-.48.617-.48.103 0 .171.034.205.171v.138l-.136.617c.445-.583 1.097-.994 1.508-.994.172 0 .309.102.309.274 0 .103 0 .274-.069.446-.137.377-.309.96-.412 1.474 0 .137.035.274.207.274.171 0 .685-.206 1.096-.754l.007-.004c-.002-.068-.007-.134-.007-.202 0-.411.035-.754.104-.994.068-.274.411-.514.617-.514.103 0 .205.069.205.171 0 .035 0 .103-.034.137-.137.446-.24.857-.24 1.269 0 .24.034.582.102.788 0 .034.035.069.07.069.068 0 .548-.445.89-1.028-.308-.206-.48-.549-.48-.96 0-.72.446-1.097.858-1.097.343 0 .617.24.617.72 0 .308-.103.65-.274.96h.102a.77.77 0 0 0 .584-.24.293.293 0 0 1 .134-.117c.335-.425.83-.74 1.41-.74.48 0 .924.205.959.582.068.515-.378.618-.515.618l-.002-.002c-.138 0-.377-.035-.377-.172 0-.137.309-.068.274-.376-.034-.206-.24-.275-.446-.275-.686 0-1.13.891-1.028 1.611.034.275.171.583.445.583.206 0 .515-.308.652-.754.068-.274.343-.514.583-.514.103 0 .17.034.205.171 0 .069 0 .206-.137.652-.17.308-.171.48-.137.617.034.274.171.48.309.583.034.034.068.102.068.102 0 .069-.034.138-.137.138-.034 0-.068 0-.103-.035-.514-.205-.72-.548-.789-.891-.205.24-.445.377-.72.377-.445 0-.89-.411-.96-.926a1.609 1.609 0 0 1 .075-.649c-.203.13-.422.203-.623.203h-.17c-.447.652-.927 1.098-1.27 1.303a.896.896 0 0 1-.377.104c-.068 0-.171-.035-.205-.104-.095-.152-.156-.392-.193-.667-.481.527-1.145.805-1.453.805-.343 0-.548-.206-.582-.55v-.376c.102-.754.377-1.2.377-1.337a.074.074 0 0 0-.069-.07c-.24 0-1.028.824-1.166 1.373l-.103.445c-.068.309-.377.515-.582.515-.103 0-.172-.035-.206-.172v-.137l.046-.233c-.435.31-.87.508-1.075.508-.308 0-.48-.172-.514-.412-.206.274-.445.412-.754.412-.352 0-.696-.24-.862-.593-.244.275-.523.553-.852.764-.48.309-1.028.549-1.68.549-.582 0-1.097-.309-1.371-.583-.412-.377-.651-.96-.686-1.509-.205-1.68.823-3.84 2.4-4.8.378-.205.755-.343 1.132-.343zm9.77 3.291c-.104 0-.172.172-.172.343 0 .274.137.583.309.755a1.74 1.74 0 0 0 .102-.583c0-.343-.137-.515-.24-.515z" />
    </svg>
  );
}

function ClaudeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}

function ChatGptIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function GeminiIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
    </svg>
  );
}

function SkillIcon({ name, className }: { name: string; className?: string }) {
  const n = name.toLowerCase();
  switch (n) {
    case "github":
      return <GitHubIcon className={className} />;
    case "react":
      return <ReactIcon className={className} />;
    case "next.js":
      return <NextjsIcon className={className} />;
    case "typescript":
      return <TypeScriptIcon className={className} />;
    case "tailwind css":
      return <TailwindIcon className={className} />;
    case "python":
      return <PythonIcon className={className} />;
    case "supabase":
      return <SupabaseIcon className={className} />;
    case "wordpress":
      return <WordPressIcon className={className} />;
    case "vercel":
      return <VercelIcon className={className} />;
    case "canva":
      return <CanvaIcon className={className} />;
    case "claude":
      return <ClaudeIcon className={className} />;
    case "chatgpt":
      return <ChatGptIcon className={className} />;
    case "gemini":
      return <GeminiIcon className={className} />;
    default:
      return null;
  }
}

/**
 * ───────────────────────────────────────────────────────────
 * INDIVIDUAL VINYL RECORD SKILL ITEM
 * ───────────────────────────────────────────────────────────
 */
function VinylSkillItem({
  skill,
  isFeatured = false,
  labelColor,
}: {
  skill: Skill;
  isFeatured?: boolean;
  labelColor: keyof typeof colorHex;
}) {
  const discRef = useRef<HTMLDivElement>(null);
  const size = isFeatured
    ? SKILLS_CONFIG.featuredDiscSize
    : SKILLS_CONFIG.standardDiscSize;
  const labelSize = Math.round(size * 0.38);
  const iconSize = Math.round(labelSize * 0.6);
  const centerHex = colorHex[labelColor] || colorHex.teal;
  // High contrast icon color on the center label: wine on light pastel, cream on deep orange/wine
  const iconColor =
    labelColor === "orange" || labelColor === "wine" ? "#F5F0E8" : "#8C0027";

  const handleMouseEnter = () => {
    if (!discRef.current) return;
    gsap.killTweensOf(discRef.current);
    gsap.to(discRef.current, {
      y: -4,
      rotation: "+=360",
      duration: 1.2,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!discRef.current) return;
    gsap.to(discRef.current, {
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  return (
    <li
      className="list-none flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-wine min-h-[44px] transition-colors duration-150 hover:bg-white/[0.04]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      role="button"
      aria-label={skill.name}
    >
      {/* Vinyl record disc */}
      <div
        ref={discRef}
        aria-hidden="true"
        className="rounded-full relative flex items-center justify-center select-none shadow-[2px_3px_6px_rgba(0,0,0,0.5)] transition-shadow duration-200 group-hover:shadow-[4px_6px_10px_rgba(0,0,0,0.6)]"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: "#1c1416",
          backgroundImage: `
            conic-gradient(
              from 45deg at 50% 50%,
              transparent 0deg,
              rgba(255, 255, 255, ${SKILLS_CONFIG.sheenOpacity}) 45deg,
              transparent 90deg,
              transparent 180deg,
              rgba(255, 255, 255, ${SKILLS_CONFIG.sheenOpacity}) 225deg,
              transparent 270deg
            ),
            repeating-radial-gradient(
              circle at center,
              transparent 0px,
              transparent 3.5px,
              rgba(255, 255, 255, ${SKILLS_CONFIG.grooveContrast}) 4px,
              transparent 4.5px
            )
          `,
          willChange: "transform",
        }}
      >
        {/* 3 thin concentric groove rings */}
        <div
          className="absolute inset-[16%] rounded-full border border-white/[0.06] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-[24%] rounded-full border border-white/[0.06] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-[31%] rounded-full border border-white/[0.06] pointer-events-none"
          aria-hidden="true"
        />

        {/* Center label */}
        <div
          className="rounded-full relative flex items-center justify-center shadow-xs border border-white/20 shrink-0"
          style={{
            width: `${labelSize}px`,
            height: `${labelSize}px`,
            backgroundColor: centerHex,
            color: iconColor,
          }}
        >
          {/* Spindle hole */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "4px",
              height: "4px",
              backgroundColor: "#8C0027",
            }}
          />

          {/* Tech icon */}
          <div
            className="relative z-10 flex items-center justify-center shrink-0"
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              color: iconColor,
            }}
          >
            <SkillIcon name={skill.name} className="w-full h-full fill-current" />
          </div>
        </div>
      </div>

      {/* Skill name label */}
      <span
        className="text-base text-cream select-none text-center mt-2.5 font-normal leading-tight tracking-wide"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {skill.name}
      </span>
    </li>
  );
}

/**
 * ───────────────────────────────────────────────────────────
 * GIANT RECORD IN THE MARGIN (Ultra-slow ambient rotation)
 * ───────────────────────────────────────────────────────────
 */
function GiantMarginRecord() {
  const {
    giantRecordSize,
    giantRecordCropPercent,
    giantRecordGrooveOpacity,
    giantRecordSpinDuration,
  } = SKILLS_CONFIG;

  const cropOffsetPx = (giantRecordSize * giantRecordCropPercent) / 100;

  // Concentric groove ring radii
  const grooveRadii = [
    80, 105, 130, 155, 180, 205, 230, 255, 280, 305, 330, 355, 380, 405, 430,
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute hidden xl:block select-none z-0"
      style={{
        width: `${giantRecordSize}px`,
        height: `${giantRecordSize}px`,
        right: `-${cropOffsetPx}px`,
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <div
        className="w-full h-full origin-center animate-vinyl-spin relative"
        style={{ animationDuration: `${giantRecordSpinDuration}s` }}
      >
        <svg
          viewBox="0 0 900 900"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Top arc for curved text: center (450, 450), radius 105 */}
            <path
              id="giant-label-top"
              d="M 345 450 A 105 105 0 0 1 555 450"
              fill="none"
            />
            {/* Bottom arc for curved text: center (450, 450), radius 105 */}
            <path
              id="giant-label-bottom"
              d="M 555 450 A 105 105 0 0 1 345 450"
              fill="none"
            />
          </defs>

          {/* Base disc in tone-on-tone lighter wine #9A1238 */}
          <circle cx="450" cy="450" r="450" fill="#9A1238" />

          {/* Concentric groove rings in band wine #8C0027 at ~40% opacity */}
          {grooveRadii.map((r, idx) => (
            <circle
              key={idx}
              cx="450"
              cy="450"
              r={r}
              fill="none"
              stroke="#8C0027"
              strokeWidth="2.5"
              strokeOpacity={giantRecordGrooveOpacity}
            />
          ))}

          {/* Run-out groove band */}
          <circle
            cx="450"
            cy="450"
            r="165"
            fill="none"
            stroke="#8C0027"
            strokeWidth="5"
            strokeOpacity="0.5"
          />

          {/* Center label ring in wine #8C0027 */}
          <circle
            cx="450"
            cy="450"
            r="135"
            fill="#8C0027"
            stroke="#7A0020"
            strokeWidth="4"
          />

          {/* Subtle label inner ring */}
          <circle
            cx="450"
            cy="450"
            r="126"
            fill="none"
            stroke="#9A1238"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />

          {/* Vintage label horizontal divider accents */}
          <line
            x1="330"
            y1="450"
            x2="415"
            y2="450"
            stroke="#F1A512"
            strokeWidth="2.5"
            strokeOpacity="0.75"
          />
          <line
            x1="485"
            y1="450"
            x2="570"
            y2="450"
            stroke="#2BAF90"
            strokeWidth="2.5"
            strokeOpacity="0.75"
          />

          {/* Vintage typography printed along top arc */}
          <text
            fill="#F5F0E8"
            fillOpacity="0.85"
            fontSize="12.5"
            fontWeight="bold"
            fontFamily="var(--font-body)"
            letterSpacing="0.18em"
          >
            <textPath href="#giant-label-top" startOffset="50%" textAnchor="middle">
              ✦ GAB.IO HI-FI SOUND SYSTEM ✦
            </textPath>
          </text>

          {/* Vintage typography printed along bottom arc */}
          <text
            fill="#F1A512"
            fillOpacity="0.9"
            fontSize="11"
            fontWeight="bold"
            fontFamily="var(--font-body)"
            letterSpacing="0.14em"
          >
            <textPath href="#giant-label-bottom" startOffset="50%" textAnchor="middle">
              ✦ 33⅓ RPM • STEREO • SIDE A ✦
            </textPath>
          </text>

          {/* Spindle hole */}
          <circle cx="450" cy="450" r="14" fill="#5E001A" />
        </svg>

        {/* Diagonal sheen highlight that sweeps across grooves as record spins */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `
              conic-gradient(
                from 25deg at 50% 50%,
                transparent 0deg,
                rgba(255, 255, 255, 0.07) 40deg,
                transparent 80deg,
                transparent 180deg,
                rgba(255, 255, 255, 0.07) 220deg,
                transparent 260deg
              )
            `,
          }}
        />
      </div>
    </div>
  );
}

/**
 * ───────────────────────────────────────────────────────────
 * MAIN SKILLS SECTION (Bento Grid)
 * ───────────────────────────────────────────────────────────
 */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const tilesRef = useRef<(HTMLElement | null)[]>([]);

  useGSAP(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      tilesRef.current.forEach((tile) => {
        if (tile) gsap.set(tile, { opacity: 1, y: 0 });
      });
      return;
    }

    tilesRef.current.forEach((tile, i) => {
      if (!tile) return;
      gsap.fromTo(
        tile,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    });
  }, []);

  // Split categories for explicit bento placement
  const frontend = skillCategories.find((c) => c.category === "Frontend");
  const backend = skillCategories.find((c) => c.category === "Backend");
  const tools = skillCategories.find(
    (c) => c.category === "Developer Tools" || c.category === "Tools"
  );
  const ais = skillCategories.find((c) => c.category === "AIs");

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Technology Stack"
      className="relative isolate overflow-x-clip py-24 bg-wine"
    >
      {/* ── Top stripe band (matching bottom) ──────── */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 z-20 stripe-band"
      />

      {/* ── Giant Record in Margin (z-0) ───────────── */}
      <GiantMarginRecord />

      {/* ── Content Container (z-10) ────────────────── */}
      <div className="relative z-10 mx-auto max-w-6xl w-full px-6 md:px-8">
        {/* Section Header */}
        <div className="mb-10 md:mb-12">
          {/* Catalog badge above heading */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs uppercase tracking-[0.25em] text-cream/70 font-bold"
              style={{ fontFamily: "var(--font-body)" }}
            >
              SIDE A
            </span>
            <span className="w-12 h-[2px] bg-cream/40" aria-hidden="true" />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl text-cream"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Technology Stack
          </h2>

          <p
            className="mt-3 text-base sm:text-lg text-cream/90"
            style={{ fontFamily: "var(--font-body)" }}
          >
            My record collection of tools and technologies.
          </p>
        </div>

        {/* ── Bento Grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {/* 1. FRONTEND TILE (Col 1-5, spanning both rows) */}
          {frontend && (
            <section
              ref={(el) => {
                tilesRef.current[0] = el;
              }}
              aria-label="Frontend skills"
              className="
                col-span-1 md:col-span-2 lg:col-span-5 lg:row-span-2
                bg-white/[0.04] border-[3px] border-cream/30 rounded-3xl
                shadow-[6px_6px_0_0_#5A0019]
                p-6 md:p-8 flex flex-col justify-between relative overflow-hidden
              "
            >
              {/* Colored top stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: colorHex[frontend.accent] }}
                aria-hidden="true"
              />

              {/* Tile Heading */}
              <div>
                <h3
                  className="text-2xl md:text-3xl text-cream tracking-wide whitespace-nowrap"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {frontend.category}
                </h3>
                <div
                  className="h-1 w-10 mt-2 rounded-full"
                  style={{ backgroundColor: colorHex[frontend.accent] }}
                  aria-hidden="true"
                />
              </div>

              {/* 2x2 grid of 80px record discs */}
              <ul className="grid grid-cols-2 gap-4 sm:gap-6 my-auto pt-6 pb-2">
                {frontend.skills.map((skill) => (
                  <VinylSkillItem
                    key={skill.name}
                    skill={skill}
                    isFeatured={true}
                    labelColor={skill.color}
                  />
                ))}
              </ul>
            </section>
          )}

          {/* 2. BACKEND TILE (Col 6-9, row 1) */}
          {backend && (
            <section
              ref={(el) => {
                tilesRef.current[1] = el;
              }}
              aria-label="Backend skills"
              className="
                col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-1
                bg-white/[0.04] border-[3px] border-cream/30 rounded-3xl
                shadow-[6px_6px_0_0_#5A0019]
                p-6 md:p-8 flex flex-col justify-between relative overflow-hidden
              "
            >
              {/* Colored top stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: colorHex[backend.accent] }}
                aria-hidden="true"
              />

              {/* Tile Heading */}
              <div>
                <h3
                  className="text-2xl md:text-3xl text-cream tracking-wide whitespace-nowrap"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {backend.category}
                </h3>
                <div
                  className="h-1 w-10 mt-2 rounded-full"
                  style={{ backgroundColor: colorHex[backend.accent] }}
                  aria-hidden="true"
                />
              </div>

              {/* 3 discs in one row */}
              <ul className="grid grid-cols-3 gap-2 sm:gap-4 my-auto pt-6 pb-2">
                {backend.skills.map((skill) => (
                  <VinylSkillItem
                    key={skill.name}
                    skill={skill}
                    isFeatured={false}
                    labelColor={skill.color}
                  />
                ))}
              </ul>
            </section>
          )}

          {/* 3. TOOLS TILE (Col 10-12, row 1) */}
          {tools && (
            <section
              ref={(el) => {
                tilesRef.current[2] = el;
              }}
              aria-label="Developer tools skills"
              className="
                col-span-1 md:col-span-1 lg:col-span-3 lg:row-span-1
                bg-white/[0.04] border-[3px] border-cream/30 rounded-3xl
                shadow-[6px_6px_0_0_#5A0019]
                p-6 md:p-8 flex flex-col justify-between relative overflow-hidden
              "
            >
              {/* Colored top stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: colorHex[tools.accent] }}
                aria-hidden="true"
              />

              {/* Tile Heading — 'Tools' on tight lg, 'Developer Tools' when wide */}
              <div>
                <h3
                  className="text-2xl md:text-3xl text-cream tracking-wide whitespace-nowrap"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span className="hidden xl:inline">Developer </span>Tools
                </h3>
                <div
                  className="h-1 w-10 mt-2 rounded-full"
                  style={{ backgroundColor: colorHex[tools.accent] }}
                  aria-hidden="true"
                />
              </div>

              {/* 3 discs in one row */}
              <ul className="grid grid-cols-3 gap-1 sm:gap-3 my-auto pt-6 pb-2">
                {tools.skills.map((skill) => (
                  <VinylSkillItem
                    key={skill.name}
                    skill={skill}
                    isFeatured={false}
                    labelColor={skill.color}
                  />
                ))}
              </ul>
            </section>
          )}

          {/* 4. AIS TILE (Col 6-12, row 2) */}
          {ais && (
            <section
              ref={(el) => {
                tilesRef.current[3] = el;
              }}
              aria-label="Artificial intelligence tools"
              className="
                col-span-1 md:col-span-2 lg:col-span-7 lg:row-span-1
                bg-white/[0.04] border-[3px] border-cream/30 rounded-3xl
                shadow-[6px_6px_0_0_#5A0019]
                p-6 md:p-8 flex flex-col justify-between relative overflow-hidden
              "
            >
              {/* Colored top stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: colorHex[ais.accent] }}
                aria-hidden="true"
              />

              {/* Tile Heading */}
              <div>
                <h3
                  className="text-2xl md:text-3xl text-cream tracking-wide whitespace-nowrap"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {ais.category}
                </h3>
                <div
                  className="h-1 w-10 mt-2 rounded-full"
                  style={{ backgroundColor: colorHex[ais.accent] }}
                  aria-hidden="true"
                />
              </div>

              {/* 3 discs in one wide row */}
              <ul className="grid grid-cols-3 gap-4 sm:gap-6 my-auto pt-6 pb-2">
                {ais.skills.map((skill) => (
                  <VinylSkillItem
                    key={skill.name}
                    skill={skill}
                    isFeatured={false}
                    labelColor={skill.color}
                  />
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {/* ── Bottom stripe band ──────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 z-20 stripe-band"
      />
    </section>
  );
}
