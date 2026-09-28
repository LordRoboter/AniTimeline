import { PUBLIC_USE_TEST_DATA } from "$env/static/public";
import { testMedia } from "$lib/mock/media";
import { TimelineRelevantAnimeEntriesDocument, MediaType } from "../../../graphql/generated";
import { anilist } from "./client";
import type { TimelineQueryMediaListType } from "./types";

const useTestData = PUBLIC_USE_TEST_DATA === 'true';

export async function loadTimelineRelevantMedia(username: string, type: MediaType): Promise<TimelineQueryMediaListType> {
    if (useTestData) {
        return testMedia;
    }

    const data = await anilist(TimelineRelevantAnimeEntriesDocument, {
        username: username,
        type: type
    });

    return Object.values(data.MediaListCollection?.lists ?? {})
    .filter((list) => list?.isCustomList === false)
    .flatMap((list) => list?.entries ?? [])
    .filter((media) => media !== null);
}