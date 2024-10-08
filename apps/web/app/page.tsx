import Image from "next/image";
import styles from "./page.module.css";
import Button from "@fe-sk/ui/button";
import { TextInput } from "@fe-sk/ui/input";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Button>Click me</Button>
        <TextInput value="" />
      </main>
    </div>
  );
}
