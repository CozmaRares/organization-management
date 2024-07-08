import { useEffect } from "react";

function App() {
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/hello.php");
      const jason = await r.json();
      console.log(jason);
    })();
  }, []);

  return <h1 className="bg-black text-3xl text-white">Hello</h1>;
}

export default App;
