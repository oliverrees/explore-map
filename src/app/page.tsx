import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { NonAuthedHome } from "./components/non-authed/NonAuthedHome";

const Home = async () => {
  const token = cookies().get("token");
  if (!token) {
    return <NonAuthedHome />;
  }
  return redirect("/app/home");
};

export default Home;
