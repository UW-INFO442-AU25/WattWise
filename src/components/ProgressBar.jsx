
export default function ProgressBar({ currentStep, totalSteps }) {
    const progress = (currentStep / totalSteps) * 100;

    return (
    <div className="progress-bar-outer" style={styles.outer}>
        <div
        className="progress-bar-inner"
        style={{ ...styles.inner, width: `${progress}%` }}
        />
    </div>
    );
    }

    const styles = {
    outer: {
    width: "100%",
    height: "12px",
    backgroundColor: "#e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
    marginBottom: "1.5rem",
    },
    inner: {
    height: "100%",
    backgroundColor: "#4CAF50",
    transition: "width 0.3s ease",
    }
};
