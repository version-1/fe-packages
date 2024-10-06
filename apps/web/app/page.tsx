import Image from "next/image";
import styles from "./page.module.css";
import Button from "@fe-sk/ui/button";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Button>Click me</Button>
      </main>
    </div>
  );
}
