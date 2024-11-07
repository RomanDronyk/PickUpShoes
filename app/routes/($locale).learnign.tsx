import { LoaderFunctionArgs, json } from "@remix-run/server-runtime";
import { Form, useSearchParams } from "@remix-run/react";
export async function loader({
  request,
}: LoaderFunctionArgs) {
  const user = {
    displayName: "Ivan",
    email: "Ivan"
  };
  return json({
    displayName: user.displayName,
    email: user.email,
  });
}

export default function Component() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "list";

  return (
    <div>
      <Form>
        <button name="view" value="list">
          View as List
        </button>
        <button name="view" value="details">
          View with Details
        </button>
      </Form>
      {view === "list" ? <>some list data</> : <>some details data</>}
    </div>
  );
}
export async function action() {
  // ...
}
