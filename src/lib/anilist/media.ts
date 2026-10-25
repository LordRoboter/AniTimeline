import { PUBLIC_USE_TEST_DATA } from "$env/static/public";
import { testMedia } from "$lib/mock/media";
import { MediaUserQueryDocument, MediaType, MediaListStatus,  } from "../../../graphql/generated";
import { anilist } from "./client";
import type { MediaListType } from "./types";

const useTestData = PUBLIC_USE_TEST_DATA === 'true';

export async function loadCompletedMedia(username: string, type: MediaType, statusNotIn: MediaListStatus[]): Promise<MediaListType[]> {
    if (useTestData) {
        return testMedia;
    }

    const data = await anilist(MediaUserQueryDocument, {
        username: username,
        type: type,
        statusNotIn: statusNotIn,
    });

    return Object.values(data.MediaListCollection?.lists ?? {})
    .filter((list) => list?.isCustomList === false)
    .flatMap((list) => list?.entries ?? [])
    .filter((media) => media !== null);
}