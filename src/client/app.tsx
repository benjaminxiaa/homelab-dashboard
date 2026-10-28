import styles from "./app.module.css";
import HealthStatus from "@/client/components/HealthStatus.tsx";

function App() {
    return (
        <main className={styles.page}>
            <HealthStatus />
        </main>
    );
}

export default App;
