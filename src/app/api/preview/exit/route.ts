import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  (await draftMode()).disable();
  const back = new URL(req.url).searchParams.get("path") ?? "/de/ratgeber";
  redirect(/^\/(de|en|es)\/[a-z0-9/-]*$/.test(back) ? back : "/de/ratgeber");
}
