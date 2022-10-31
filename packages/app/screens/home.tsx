import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

let music;
const initMusicKit = async () => {
  try {
    await window.MusicKit.configure({
      developerToken:
        "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilo2VkQ0NTJOMjcifQ.eyJpYXQiOjE2NjY5ODIzODUsImV4cCI6MTY4MjUzNDM4NSwiaXNzIjoiODhUS0hCMjY4VyJ9.fVefAK7d250DZw1CzmQgSPrUy_3X6yz8am0SgWYow9fOdz_H5akyyP_NH2maEOH2V8TfOxMpYvyXVzJzvE7dPw",
      app: {
        name: "Showtime",
        build: "1978.4.1",
      },
    });
  } catch (err) {
    console.error("Errorr ", err);
    // Handle configuration error
  }

  // MusicKit instance is available
  music = window.MusicKit.getInstance();
  // const a = await music.authorize();
  // console.log("RFfrk ", a);
  console.log("efokfe ", music);

  return music;
};

const HomeScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });

  useEffect(() => {
    if (window.MusicKit) {
      initMusicKit();
    } else {
      document.addEventListener("musickitloaded", async function () {
        // MusicKit global is now defined.
        console.log("efkifeijfe ", 123);
      });
    }
  }, []);

  return (
    <button
      style={{ marginTop: 100 }}
      onClick={async () => {
        const v = await music.authorize();
        console.log("v ", v, music);
      }}
    >
      {" "}
      Authorize
    </button>
  );
});

export { HomeScreen };
