import { Toaster } from "react-hot-toast";
import AppRouter from "./router/AppRouter";
import { Provider } from "react-redux";
import store from "./store/store";

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </>
  );
};

export default App;
