import React, { createContext, useState } from "react";
import "./app.css";
import "./media/css/animations.css";
// Routes
import Routes from "./router/routes";
import Providers from "./Prodivers";
import Preloader from "./includes/preloader";
import initUser from "./api/initUser";
import { useEffect } from "react";
import { Application } from "pixi.js";
import LocationLinter from "./locationLinter.tsx";

function App({ intlProviderValue }) {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const tgReady = () => {
      if (tg) {
        tg.headerColor = "#141019";
        tg.backgroundColor = "#141019";

        tg.disableVerticalSwipes();
        tg.ready();
        tg.expand();
        tg.BackButton.hide();
      }
    };

    const auth = async () => {
      let response;

      try {
        if (loading === false) {
          return;
        }
        await initUser().then(() => {
			setLoading(false);
        });
      } catch (error) {
        if (error.response && error.response.status) {
          console.log(error.response.status);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      }

      if (response && response.status) {
        console.log(response.status);
      }
    };

    auth();
    tgReady();

    document.body.addEventListener(
      "touchmove",
      function (e) {
        if (e.target === document.body) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    function preventCollapse() {
      console.log("preventCollapse");
      if (window.scrollY === 0) {
        window.scrollTo(0, 1);
      }
    }

    document.body.addEventListener("touchstart", preventCollapse, {
      passive: false,
    });

    return () => {
      document.body.removeEventListener("touchmove", function (e) {
        if (e.target === document.body) {
          e.preventDefault();
        }
      });

      document.body.removeEventListener("touchstart", preventCollapse);
    };
  }, []);

  return <>{loading === true ? <Preloader /> : <Routes />}</>;
}

export const CanvasContext = createContext('CanvasContext');
export default function AppWithProviders() {
	let scrollHeight = Math.max(
		document.body.scrollHeight, document.documentElement.scrollHeight,
		document.body.offsetHeight, document.documentElement.offsetHeight,
		document.body.clientHeight, document.documentElement.clientHeight
	);
	let scrollWidth = Math.max(
	document.body.scrollWidth, document.documentElement.scrollWidth,
	document.body.offsetWidth, document.documentElement.offsetWidth,
	document.body.clientWidth, document.documentElement.clientWidth
	);

	const [CanvasApp, setCanvasApp] = useState({})
	
	useEffect(()=>{
		if (iOS()) {
			document.documentElement.style.setProperty('--ios-padding-top', `${0}px`);
			document.documentElement.style.setProperty('--ios-padding-bottom', `${30}px`);
		} else {
			document.documentElement.style.setProperty('--ios-padding-top', `${0}px`);
			document.documentElement.style.setProperty('--ios-padding-bottom', `${0}px`);
		}
	})

	useEffect(()=>{
	(async () =>
		{
			const app = new Application();
			await app.init({ backgroundAlpha: 0, resizeTo: window, resolution: 4, antialias: true, roundPixels: true });
	
			app.canvas.style.position = 'absolute'
			app.canvas.style.top = '0'
			app.canvas.style.left = '0'
  
			app.canvas.id = 'gameCanvas'

			document.body.appendChild(app.canvas);
			setCanvasApp(app)
		})();
	}, [])

  return (
    <Providers>
      	<CanvasContext.Provider value={CanvasApp}>
      		<App />
			{/* <LocationLinter/> */}
      	</CanvasContext.Provider>
    </Providers>
  );
}

export function iOS() {
    return (
        ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
            navigator.platform,
        ) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
}
