import { CircularProgress } from "@mui/material";

export default function AppLoading() {
  // Define the Loading UI here
  return (
    <div className="fixed inset-0 !z-[9999] flex items-center justify-center bg-black/10">
      <CircularProgress />
    </div>

  )
}
