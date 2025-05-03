import { lazy } from "react";
import { Route } from "wouter";

const Home = lazy(() => import("@/components/Home"));
const App = lazy(() => import("@/components/App"));

const AppRouter = () => {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/app" component={App} />
    </>
  );
};

export default AppRouter;
