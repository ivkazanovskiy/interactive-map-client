import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import Map from "./components/Canvas/Map";
import { isAuthorizedState } from "./states/isAuth";
import { config } from "./config";
import { useEffect } from "react";

function App() {
  const [isAuthorized, setIsAuthorized] = useRecoilState(isAuthorizedState);
  const navigate = useNavigate();

  const checkState = useMutation(() => axios.get(config.backendUrl + "/auth"), {
    onSuccess: () => {
      setIsAuthorized(true);
    },
    onError: (err: AxiosError) => {
      setIsAuthorized(false);
      navigate("/login");
    },
  });

  useEffect(() => checkState.mutate(), []);

  if (isAuthorized) return <Map></Map>;

  return <></>;
}

export default App;
