
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-muted-foreground">502</h1>
        <h2 className="mt-4 text-2xl font-bold">Bad Gateway</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          The server encountered a temporary error and could not complete your request.
        </p>
        <div className="mt-6">
          <Button onClick={() => navigate("/")}>Try Again</Button>
        </div>
      </div>
    </div>
  );
}
