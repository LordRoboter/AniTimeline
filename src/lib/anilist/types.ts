import type { MediaListStatus } from "../../../graphql/generated";

export type TimelineQueryMediaListType = {
 status: MediaListStatus | null;
 media: {
 id: number;
 bannerImage: string | null;
 title: {
 romaji: string | null;
 } | null;
 } | null;
 completedAt: {
 day: number | null;
 month: number | null;
 year: number | null;
 } | null;
 startedAt: {
 day: number | null;
 month: number | null;
 year: number | null;
 } | null;
}[]