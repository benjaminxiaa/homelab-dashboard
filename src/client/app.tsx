import styles from "./app.module.css";
import HealthStatus from "@/client/components/HealthStatus.tsx";
import ServiceList from "@/client/components/ServiceList.tsx";

function App() {
    return (
        <main className={styles.page}>
            <HealthStatus />
            <ServiceList />
        </main>
    );
}

export default App;
