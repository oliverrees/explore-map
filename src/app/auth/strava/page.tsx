"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "../../components/LoadingScreen";
export default function Track() {
  const getUserInfo = async (code: string) => {
    try {
      const response = await fetch("/auth/get-user", {
        method: "POST",
        body: JSON.stringify({
          code: code,
        }),
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  };
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const scope = searchParams.get("scope");
  const isRequesting = useRef(false);

  if (!code || !scope) {
    router.push("/");
  }

  // if (scope !== "read,activity:read") {
  //   router.push("/");
  // }

  useEffect(() => {
    if (!code || isRequesting.current) {
      return;
    }
    const getInfo = async () => {
      const data = await getUserInfo(code);
      if (data.success) {
        router.push(`/app/home`);
      } else {
        alert(data.message);
        router.push(`/`);
      }
    };
    isRequesting.current = true;
    getInfo();
  }, []);

  return <LoadingScreen />;
}
