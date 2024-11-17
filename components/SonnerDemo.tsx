"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SonnerDemo({
  children,
  dataSent,
}: Readonly<{ children: React.ReactNode; dataSent: boolean }>) {
  // State to ensure no hydration issues
  const [isClient, setIsClient] = useState(false);

  // Set the client-side flag to true after the first render
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Trigger toast when `dataSent` changes
  useEffect(() => {
    if (dataSent && isClient) {
      const currentDateTime = new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });

      toast("Data Sent Successfully", {
        description: currentDateTime,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    }
  }, [dataSent, isClient]); // Ensure the effect runs only after component is mounted on client

  if (!isClient) {
    // Avoid rendering the button on the server-side to fix hydration mismatch
    return null;
  }

  return (
    <Button
      variant="default"
      className="w-full p-0 m-0"
      onClick={() => {
        if (dataSent) {
          const currentDateTime = new Date().toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          });

          toast("Event has been created", {
            description: currentDateTime,
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          });
        }
      }}
    >
      {children}
    </Button>
  );
}
