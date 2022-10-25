import { Button } from "@showtime-xyz/universal.button";
import { View } from "@showtime-xyz/universal.view";

import { useMagic } from "app/lib/magic";

const LoginWithTwitter = () => {
  const { magic } = useMagic();
  return (
    <View tw="mt-40">
      <Button
        onPress={async () => {
          await magic.oauth.loginWithRedirect({
            provider: "twitter",
            redirectURI:
              "https://auth.magic.link/v1/oauth2/B6WVeBbFYMWjJeR5xAjRdDB2H0daBnkamY70k7ENqCQ=/callback",
            scope: ["user:email"] /* optional */,
          });
        }}
      >
        login with twitter
      </Button>
    </View>
  );
};

export default LoginWithTwitter;
