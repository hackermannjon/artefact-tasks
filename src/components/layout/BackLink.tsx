import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "./BackLink.module.css";

export function BackLink() {
  return (
    <Link href="/" className={styles.back}>
      <ArrowLeft size={18} aria-hidden />
      All tasks
    </Link>
  );
}
