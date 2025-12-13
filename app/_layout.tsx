import { Slot } from "expo-router";
import { SacolaProvider } from "../context/SacolaContext";

export default function RootLayout() {
  return (
    <SacolaProvider>
      <Slot />
    </SacolaProvider>
  );
}
