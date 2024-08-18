import "./screens/index";
import "./server/index";

process.on("SIGTERM", () => {
    process.exit(0);
});