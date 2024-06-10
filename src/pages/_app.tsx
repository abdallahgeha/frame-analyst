import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { ObjectsProvider } from "~/contexts/objectsContexts";
import { TypeProvider } from "~/contexts/typeContext";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <TypeProvider>
        <ObjectsProvider>
          <Component {...pageProps} />
        </ObjectsProvider>
      </TypeProvider>
    </SessionProvider>
  );
};

export default MyApp;
