import { CircularProgress } from "@mui/material";

export default function Loading() {
  // Define the Loading UI here
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 flex items-center justify-center">
        <CircularProgress />
      </div>
    </div>
  )
}
