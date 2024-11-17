import axios from "axios";
import { getCache, setCache } from "../lib/cache";

export async function getUserByAuthHeader(authHeader: string) {
  try {
    const cacheKey = `githubProfile:${authHeader}`;
    const githubProfile = getCache(cacheKey);
    if (githubProfile) {
      return githubProfile;
    }
    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: authHeader,
        Accept: "application/vnd.github.v3+json",
      },
    });
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    // await logToDiscord(
    //   `getUserByAuthHeader: ${(error as any).message}`,
    //   "ERROR"
    // );

    console.error("Failed to fetch Github ID", error);
    return null;
  }
}
