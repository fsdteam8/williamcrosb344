import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // Adjust import based on your UI library

export default function ErrorPage() {
  const error = useRouteError();
  let errorMessage = "An unexpected error occurred";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  console.log(errorMessage)
  const errorTitles: Record<number, string> = {
    404: "Page Not Found",
  };

  const title = errorTitles[errorStatus] || "Something went wrong";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="h-16 w-16 text-red-500" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Page Not Found
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <Button asChild variant="default">
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}