import { Toaster } from "react-hot-toast";
import AppRouter from "./router/AppRouter";
import { Provider } from "react-redux";
import store from "./store/store";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <Provider store={store}>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </Provider>
    </>
  );
};

export default App;
