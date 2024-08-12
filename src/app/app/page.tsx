import { redirect } from "next/navigation";

const Home = async () => {
  return redirect("/app/home");
};

export default Home;
