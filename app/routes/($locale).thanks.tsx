import { LATEST_API_VERSION } from "@shopify/shopify-app-remix/server";
import ThanksScreen from "~/screens/ThanksScreen";

// Checkout component
export default function Thanks() {
    console.log(LATEST_API_VERSION)

    return (
        <ThanksScreen />
    )
}

